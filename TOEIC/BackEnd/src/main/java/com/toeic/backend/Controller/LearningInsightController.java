package com.toeic.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.toeic.backend.ai.GroqAnalyze;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
public class LearningInsightController {

    private final GroqAnalyze groqAnalyze;

    public LearningInsightController(GroqAnalyze groqAnalyze) {
        this.groqAnalyze = groqAnalyze;
    }

    @PostMapping("/insight")
    public ResponseEntity<Map<String, Object>> analyze(@RequestBody Map<String, Object> request) throws Exception {

        // lấy structured data từ request
        String structuredData = (String) request.get("data");

        Map<String, Object> result = groqAnalyze.analyzePerformance(structuredData);

        return ResponseEntity.ok(result);
    }
}