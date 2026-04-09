package com.toeic.backend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.entity.SkillAnalysisDTO;
import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.repository.PracticeSessionRepo;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.PracticeAnswerRepo;

@Service
public class PracticeService {

    private final Part5Repo part5Repo;
    private final PracticeSessionRepo sessionRepo;
    private final PracticeAnswerRepo answerRepo;

    public PracticeService(
            PracticeSessionRepo sessionRepo,
            PracticeAnswerRepo answerRepo,
            Part5Repo part5Repo) {

        this.sessionRepo = sessionRepo;
        this.answerRepo = answerRepo;
        this.part5Repo = part5Repo;
    }

    public PracticeSession startSession(
            Long userId,
            Integer part,
            String topic,
            Integer questionCount) {

        PracticeSession session = new PracticeSession();

        session.setUserId(userId);
        session.setPart(part);
        session.setTopic(topic);
        session.setTotalQuestions(questionCount);
        session.setCorrectAnswers(0);
        session.setStartTime(LocalDateTime.now());

        return sessionRepo.save(session);
    }

    public PracticeAnswer submitAnswer(
            Long sessionId,
            Long questionId,
            String userAnswer,
            String correctAnswer,
            Integer timeSpent) {

        PracticeAnswer answer = new PracticeAnswer();

        answer.setSessionId(sessionId);
        answer.setQuestionId(questionId);
        answer.setUserAnswer(userAnswer);
        answer.setCorrectAnswer(correctAnswer);

        // tránh NullPointerException
        boolean isCorrect = correctAnswer != null && correctAnswer.equals(userAnswer);

        answer.setIsCorrect(isCorrect);
        answer.setTimeSpent(timeSpent);

        return answerRepo.save(answer);
    }

    public PracticeSession endSession(
            Long sessionId,
            Integer correctAnswers) {

        PracticeSession session = sessionRepo
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Practice session not found"));

        session.setCorrectAnswers(correctAnswers);
        session.setEndTime(LocalDateTime.now());

        return sessionRepo.save(session);
    }

    public List<Part5> getRandomPart5Questions(
            String label,
            int limit) {

        return part5Repo.getRandomQuestions(
                label,
                PageRequest.of(0, limit));
    }

    public List<SkillAnalysisDTO> getPart5Analysis(Long userId) {

        List<Object[]> result = answerRepo.getPart5SkillAnalysis(userId);

        List<SkillAnalysisDTO> list = new ArrayList<>();

        for (Object[] row : result) {

            String topic = (String) row[0];

            Number total = (Number) row[1];
            Number correct = (Number) row[2];

            double accuracy = (correct.doubleValue() / total.doubleValue()) * 100;

            list.add(new SkillAnalysisDTO(topic, accuracy));
        }

        return list;
    }
}