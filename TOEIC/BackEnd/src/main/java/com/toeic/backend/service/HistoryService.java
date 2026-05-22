package com.toeic.backend.service;

import com.toeic.backend.entity.AttemptDetail;
import com.toeic.backend.entity.UserAttempt;
import com.toeic.backend.repository.AttemptDetailRepo;
import com.toeic.backend.repository.UserAttemptRepo;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class HistoryService {

    private final UserAttemptRepo userAttemptRepo;
    private final AttemptDetailRepo attemptDetailRepo;

    public HistoryService(UserAttemptRepo userAttemptRepo,
                          AttemptDetailRepo attemptDetailRepo) {
        this.userAttemptRepo = userAttemptRepo;
        this.attemptDetailRepo = attemptDetailRepo;
    }

    // ================= HISTORY =================
    public List<Map<String, Object>> getHistory(Long userId) {

    List<UserAttempt> attempts =
            userAttemptRepo.findByUserIdOrderByIdDesc(userId);

    return attempts.stream().map(attempt -> {
        Map<String, Object> map = new HashMap<>();

        map.put("attemptId", attempt.getId());
        map.put("score", attempt.getScore());
        map.put("totalQuestions", attempt.getTotalQuestions());
        map.put("correctAnswers", attempt.getCorrectAnswers());
        map.put("createdAt", attempt.getCreatedAt());

        return map;
    }).collect(Collectors.toList());
}
    // ================= DETAIL =================
    public Map<String, Object> getAttemptDetail(Long attemptId) {

        UserAttempt attempt = userAttemptRepo.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt not found"));

        List<AttemptDetail> details =
                attemptDetailRepo.findByAttemptId(attemptId);

        Map<String, Object> res = new HashMap<>();

        // ===== attempt info =====
        res.put("attemptId", attempt.getId());
        res.put("score", attempt.getScore());
        res.put("totalQuestions", attempt.getTotalQuestions());
        res.put("correctAnswers", attempt.getCorrectAnswers());
        res.put("type", attempt.getType());
        res.put("createdAt", attempt.getCreatedAt());

        // ===== user =====
        res.put("userId", attempt.getUser() != null ? attempt.getUser().getId() : null);

        // ===== details =====
        List<Map<String, Object>> detailList = details.stream().map(d -> {
            Map<String, Object> m = new HashMap<>();

            m.put("questionId", d.getQuestionId());
            m.put("userAnswer", d.getUserAnswer());
            m.put("correctAnswer", d.getCorrectAnswer());
            m.put("isCorrect", d.getIsCorrect()); // ✅ FIX HERE
 m.put("questionType", d.getQuestionType());
    m.put("label", d.getLabel());
            return m;
        }).collect(Collectors.toList());

        res.put("details", detailList);

        return res;
    }
}