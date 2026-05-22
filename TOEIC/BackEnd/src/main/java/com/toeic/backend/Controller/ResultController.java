package com.toeic.backend.controller;

import com.toeic.backend.service.ResultService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/result")
@CrossOrigin(origins = "*")
public class ResultController {

    private final ResultService resultService;

    public ResultController(ResultService resultService) {
        this.resultService = resultService;
    }

    // ================= GET RESULT BY SESSION =================
    @GetMapping("/{sessionId}")
    public ResponseEntity<Map<String, Object>> getResult(
            @PathVariable Long sessionId
    ) {
        Map<String, Object> result = resultService.getResult(sessionId);

        return ResponseEntity.ok(result);
    }

    // ================= OPTIONAL: QUICK SUMMARY ONLY =================
    @GetMapping("/{sessionId}/summary")
    public ResponseEntity<Map<String, Object>> getSummary(
            @PathVariable Long sessionId
    ) {
        Map<String, Object> full = resultService.getResult(sessionId);

        Map<String, Object> summary = Map.of(
                "sessionId", full.get("sessionId"),
                "totalQuestions", full.get("totalQuestions"),
                "correctAnswers", full.get("correctAnswers"),
                "wrongAnswers", full.get("wrongAnswers"),
                "score", full.get("score")
        );

        return ResponseEntity.ok(summary);
    }

    // ================= OPTIONAL: REVIEW WRONG QUESTIONS ONLY =================
    @GetMapping("/{sessionId}/wrong")
    public ResponseEntity<Map<String, Object>> getWrongQuestions(
            @PathVariable Long sessionId
    ) {
        Map<String, Object> full = resultService.getResult(sessionId);

        var questions = (java.util.List<Map<String, Object>>) full.get("questions");

        var wrongOnly = questions.stream()
                .filter(q -> Boolean.FALSE.equals(q.get("isCorrect")))
                .toList();

        return ResponseEntity.ok(Map.of(
                "sessionId", sessionId,
                "wrongCount", wrongOnly.size(),
                "questions", wrongOnly
        ));
    }
}