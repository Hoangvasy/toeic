package com.toeic.backend.service;

import com.toeic.backend.entity.ExamAnswer;
import com.toeic.backend.repository.ExamAnswerRepo;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ResultService {

    private final ExamAnswerRepo examAnswerRepo;

    public ResultService(ExamAnswerRepo examAnswerRepo) {
        this.examAnswerRepo = examAnswerRepo;
    }

    // ================= MAIN =================
    public Map<String, Object> getResult(Long sessionId) {

        List<ExamAnswer> answers =
                examAnswerRepo.findByExamSessionId(sessionId);

        List<Map<String, Object>> questionResults = new ArrayList<>();

        int correctCount = 0;
        int wrongCount = 0;
        int total = answers.size();

        // ================= PART STATS =================
        Map<Integer, Integer> correctByPart = new HashMap<>();
        Map<Integer, Integer> totalByPart = new HashMap<>();

        // ================= SKILL STATS =================
        Map<String, Integer> skillCorrect = new HashMap<>();
        Map<String, Integer> skillTotal = new HashMap<>();

        for (ExamAnswer a : answers) {

            boolean isCorrect =
                    a.getUserAnswer() != null &&
                    a.getCorrectAnswer() != null &&
                    a.getUserAnswer().equalsIgnoreCase(a.getCorrectAnswer());

            if (isCorrect) correctCount++;
            else wrongCount++;

            int part = a.getPart() != null ? a.getPart() : 0;

            totalByPart.put(part, totalByPart.getOrDefault(part, 0) + 1);
            if (isCorrect) {
                correctByPart.put(part, correctByPart.getOrDefault(part, 0) + 1);
            }

            // ================= LABEL FIX (IMPORTANT) =================
            String label = a.getLabel();
            if (label == null || label.isEmpty()) {
                label = "unknown";
            }

            skillTotal.put(label, skillTotal.getOrDefault(label, 0) + 1);
            if (isCorrect) {
                skillCorrect.put(label, skillCorrect.getOrDefault(label, 0) + 1);
            }

            // ================= QUESTION DETAIL =================
            Map<String, Object> q = new HashMap<>();
            q.put("questionId", a.getQuestionId());
            q.put("questionNumber", a.getQuestionNumber());
            q.put("part", part);
            q.put("userAnswer", a.getUserAnswer());
            q.put("correctAnswer", a.getCorrectAnswer());
            q.put("isCorrect", isCorrect);
            q.put("timeSpent", a.getTimeSpent());
            q.put("label", label);

            questionResults.add(q);
        }

        // ================= SCORE =================
        double score = total == 0
                ? 0
                : (correctCount * 100.0 / total);

        // ================= PART STATS =================
        List<Map<String, Object>> partStats = new ArrayList<>();

        Set<Integer> parts = new HashSet<>();
        parts.addAll(totalByPart.keySet());
        parts.addAll(correctByPart.keySet());

        for (Integer p : parts) {

            int totalP = totalByPart.getOrDefault(p, 0);
            int correctP = correctByPart.getOrDefault(p, 0);

            Map<String, Object> part = new HashMap<>();
            part.put("part", p);
            part.put("total", totalP);
            part.put("correct", correctP);
            part.put("wrong", totalP - correctP);
            part.put("accuracy", totalP == 0 ? 0 : (double) correctP / totalP);

            partStats.add(part);
        }

        // ================= SKILL ANALYSIS =================
        List<Map<String, Object>> skillStats = new ArrayList<>();

        for (String label : skillTotal.keySet()) {

            int totalL = skillTotal.get(label);
            int correctL = skillCorrect.getOrDefault(label, 0);

            double acc = totalL == 0 ? 0 : (double) correctL / totalL;

            Map<String, Object> s = new HashMap<>();
            s.put("label", label);
            s.put("total", totalL);
            s.put("correct", correctL);
            s.put("accuracy", acc);

            skillStats.add(s);
        }

        // ================= WEAK / STRONG =================
        List<Map<String, Object>> weakSkills = new ArrayList<>();
        List<Map<String, Object>> strongSkills = new ArrayList<>();

        for (Map<String, Object> s : skillStats) {

            double acc = (double) s.get("accuracy");

            if (acc < 0.5) {
                weakSkills.add(s);
            } else {
                strongSkills.add(s);
            }
        }

        weakSkills.sort(Comparator.comparingDouble(a -> (double) a.get("accuracy")));

        strongSkills.sort((a, b) ->
                Double.compare((double) b.get("accuracy"), (double) a.get("accuracy"))
        );

        // ================= RECOMMENDATION =================
        String recommendation;

        if (!weakSkills.isEmpty()) {

            Map<String, Object> worst = weakSkills.get(0);

            recommendation = "Bạn đang yếu nhất ở: " + worst.get("label")
                    + ". Hãy luyện thêm nhóm kỹ năng này để cải thiện nhanh điểm TOEIC.";
        } else {
            recommendation = "Bạn làm khá tốt. Hãy tăng độ khó để nâng band điểm.";
        }

        // ================= RESPONSE =================
        Map<String, Object> result = new HashMap<>();

        result.put("sessionId", sessionId);
        result.put("totalQuestions", total);
        result.put("correctAnswers", correctCount);
        result.put("wrongAnswers", wrongCount);
        result.put("score", Math.round(score));

        result.put("partStats", partStats);

        result.put("questions", questionResults);

        result.put("skillStats", skillStats);
        result.put("weakSkills", weakSkills);
        result.put("strongSkills", strongSkills);

        result.put("recommendation", recommendation);

        return result;
    }
}