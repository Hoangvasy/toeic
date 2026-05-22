package com.toeic.backend.service;

import com.toeic.backend.entity.*;
import com.toeic.backend.repository.*;
import com.toeic.backend.service.learningengine.updater.AbilityUpdater;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ExamService {

    private final ExamSessionRepo sessionRepo;
    private final ExamAnswerRepo answerRepo;
    private final AbilityUpdater abilityUpdater;

    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7QuestionRepo part7QuestionRepo;

    public ExamService(
            ExamSessionRepo sessionRepo,
            ExamAnswerRepo answerRepo,
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7QuestionRepo part7QuestionRepo,
            AbilityUpdater abilityUpdater
    ) {
        this.sessionRepo = sessionRepo;
        this.answerRepo = answerRepo;
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7QuestionRepo = part7QuestionRepo;
        this.abilityUpdater = abilityUpdater;
    }

    // ================= START EXAM =================
    public ExamSession startExam(
            Long userId,
            Long testId,
            String parts,
            Integer totalQuestions
    ) {

        ExamSession session = new ExamSession();
        session.setUserId(userId);
        session.setTestId(testId);
        session.setParts(parts);
        session.setTotalQuestions(totalQuestions);
        session.setCorrectAnswers(0);
        session.setCompleted(false);
        session.setStartTime(LocalDateTime.now());

        return sessionRepo.save(session);
    }

    // ================= RESOLVE LABEL =================
    private String resolveLabel(Integer part, Long questionId) {

        if (part == null) return "general";

        if (part == 5) {
            return part5Repo.findById(questionId)
                    .map(Part5::getLabel)
                    .orElse("general");
        }

        if (part == 6) {
            return part6Repo.findById(questionId)
                    .map(Part6::getLabel)
                    .orElse("general");
        }

        if (part == 7) {
            return part7QuestionRepo.findById(questionId)
                    .map(Part7Question::getLabel)
                    .orElse("general");
        }

        return "general";
    }

    // ================= SUBMIT ANSWER =================
    public ExamAnswer submitAnswer(
            Long sessionId,
            Long questionId,
            Integer part,
            Integer questionNumber,
            String userAnswer,
            String correctAnswer,
            Integer timeSpent
    ) {

        ExamAnswer existing = answerRepo
                .findByExamSessionIdAndQuestionId(sessionId, questionId);

        boolean isCorrect = correctAnswer != null
                && correctAnswer.equalsIgnoreCase(userAnswer);

        String label = resolveLabel(part, questionId);

        if (existing != null) {
            existing.setUserAnswer(userAnswer);
            existing.setCorrectAnswer(correctAnswer);
            existing.setIsCorrect(isCorrect);
            existing.setTimeSpent(timeSpent);
            existing.setLabel(label);
            return answerRepo.save(existing);
        }

        ExamAnswer answer = new ExamAnswer();
        answer.setExamSessionId(sessionId);
        answer.setQuestionId(questionId);
        answer.setPart(part);
        answer.setQuestionNumber(questionNumber);
        answer.setUserAnswer(userAnswer);
        answer.setCorrectAnswer(correctAnswer);
        answer.setIsCorrect(isCorrect);
        answer.setTimeSpent(timeSpent);
        answer.setLabel(label);

        return answerRepo.save(answer);
    }

    // ================= FINISH EXAM =================
    public ExamSession finishExam(
        Long sessionId,
        List<Map<String, Object>> allQuestions
) {

    System.out.println("===== FINISH EXAM START =====");

    ExamSession session = sessionRepo.findById(sessionId)
            .orElseThrow(() -> new RuntimeException("Exam session not found"));

    List<ExamAnswer> answers = answerRepo.findByExamSessionId(sessionId);

    Set<Long> answeredIds = answers.stream()
            .map(ExamAnswer::getQuestionId)
            .collect(Collectors.toSet());

    // ================= INSERT MISSING ANSWERS (SKIPPED) =================
    for (Map<String, Object> q : allQuestions) {

        Long questionId = Long.valueOf(q.get("questionId").toString());

        if (answeredIds.contains(questionId)) continue;

        Integer part = Integer.valueOf(q.get("part").toString());
        Integer questionNumber = Integer.valueOf(q.get("questionNumber").toString());
        String correctAnswer = String.valueOf(q.get("correctAnswer"));

        String label = resolveLabel(part, questionId);

        ExamAnswer answer = new ExamAnswer();
        answer.setExamSessionId(sessionId);
        answer.setQuestionId(questionId);
        answer.setPart(part);
        answer.setQuestionNumber(questionNumber);

        // skipped
        answer.setUserAnswer(null);
        answer.setCorrectAnswer(correctAnswer);

        // 🔥 IMPORTANT FIX: null = skipped (KHÔNG phải false)
        answer.setIsCorrect(null);

        answer.setTimeSpent(0);
        answer.setLabel(label);

        answerRepo.save(answer);
    }

    // ================= LOAD FINAL =================
    answers = answerRepo.findByExamSessionId(sessionId);

    int correct = (int) answers.stream()
            .filter(a -> Boolean.TRUE.equals(a.getIsCorrect()))
            .count();

    session.setCorrectAnswers(correct);
    session.setCompleted(true);
    session.setEndTime(LocalDateTime.now());

    // ================= BUILD AI DETAILS =================
    List<AttemptDetail> details = answers.stream()
            .map(a -> {

                AttemptDetail d = new AttemptDetail();

                d.setQuestionType("part" + a.getPart());

                // true / false / null đều giữ nguyên
                d.setIsCorrect(a.getIsCorrect());

                String label = a.getLabel();
                if (label == null || label.isBlank() || label.equalsIgnoreCase("unknown")) {
                    label = "general";
                }

                d.setLabel(label.trim().toLowerCase().replace(" ", "_"));

                d.setUserAnswer(a.getUserAnswer());
                d.setCorrectAnswer(a.getCorrectAnswer());

                return d;
            })
            .toList();

    System.out.println("===== AI UPDATE DEBUG =====");
    System.out.println("userId = " + session.getUserId());
    System.out.println("details size = " + details.size());

    abilityUpdater.update(session.getUserId(), details);

    System.out.println("===== FINISH EXAM DONE =====");

    return sessionRepo.save(session);
}

    // ================= HISTORY =================
    public List<ExamSession> getUserHistory(Long userId) {
        return sessionRepo.findByUserIdOrderByIdDesc(userId);
    }


    public List<Map<String, Object>> getAnswers(Long sessionId) {

    List<ExamAnswer> answers = answerRepo.findByExamSessionId(sessionId);

    List<Map<String, Object>> result = new ArrayList<>();

    for (ExamAnswer a : answers) {

        Map<String, Object> obj = new HashMap<>();

        obj.put("questionId", a.getQuestionId());
        obj.put("questionNumber", a.getQuestionNumber());
        obj.put("part", a.getPart());
        obj.put("userAnswer", a.getUserAnswer());
        obj.put("correctAnswer", a.getCorrectAnswer());
        obj.put("isCorrect", a.getIsCorrect());
        obj.put("label", a.getLabel());

        // ================= LOAD QUESTION DETAIL =================
        if (a.getPart() == 5) {

            Part5 q = part5Repo.findById(a.getQuestionId()).orElse(null);

            if (q != null) {
                obj.put("question", q.getQuestion());
                obj.put("optionA", q.getOptionA());
                obj.put("optionB", q.getOptionB());
                obj.put("optionC", q.getOptionC());
                obj.put("optionD", q.getOptionD());
                obj.put("explanation", q.getExplanation());
            }
        }

        if (a.getPart() == 6) {

            Part6 q = part6Repo.findById(a.getQuestionId()).orElse(null);

            if (q != null) {
                obj.put("question", q.getQuestion());
                obj.put("optionA", q.getOptionA());
                obj.put("optionB", q.getOptionB());
                obj.put("optionC", q.getOptionC());
                obj.put("optionD", q.getOptionD());
                obj.put("explanation", q.getExplanation());
            }
        }

        if (a.getPart() == 7) {

            Part7Question q = part7QuestionRepo.findById(a.getQuestionId()).orElse(null);

            if (q != null) {
                obj.put("question", q.getQuestion());
                obj.put("optionA", q.getOptionA());
                obj.put("optionB", q.getOptionB());
                obj.put("optionC", q.getOptionC());
                obj.put("optionD", q.getOptionD());
                obj.put("explanation", q.getExplanation());
            }
        }

        result.add(obj);
    }

    return result;
}

    // ================= UNFINISHED =================
    public List<ExamSession> getUnfinishedExams(Long userId) {
        return sessionRepo.findByUserIdAndCompletedFalse(userId);
    }
}