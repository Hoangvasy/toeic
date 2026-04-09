package com.toeic.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.entity.SkillAnalysisDTO;
import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.service.PracticeService;

@RestController
@RequestMapping("/api/practice")
@CrossOrigin(origins = "http://localhost:5173")
public class PracticeController {

    private final PracticeService service;

    public PracticeController(PracticeService service) {
        this.service = service;
    }

    @PostMapping("/session/start")
    public PracticeSession startSession(
            @RequestBody Map<String, Object> req) {

        Long userId = ((Number) req.get("userId")).longValue();
        Integer part = ((Number) req.get("part")).intValue();
        String topic = (String) req.get("topic");
        Integer questionCount = ((Number) req.get("questionCount")).intValue();

        return service.startSession(
                userId,
                part,
                topic,
                questionCount);
    }

    @PostMapping("/answer")
    public PracticeAnswer submitAnswer(
            @RequestBody Map<String, Object> req) {

        Long sessionId = ((Number) req.get("sessionId")).longValue();
        Long questionId = ((Number) req.get("questionId")).longValue();
        String userAnswer = (String) req.get("userAnswer");
        String correctAnswer = (String) req.get("correctAnswer");
        Integer timeSpent = ((Number) req.get("timeSpent")).intValue();

        return service.submitAnswer(
                sessionId,
                questionId,
                userAnswer,
                correctAnswer,
                timeSpent);
    }

    @PostMapping("/session/end")
    public PracticeSession endSession(
            @RequestBody Map<String, Object> req) {

        Long sessionId = ((Number) req.get("sessionId")).longValue();
        Integer correctAnswers = ((Number) req.get("correctAnswers")).intValue();

        return service.endSession(
                sessionId,
                correctAnswers);
    }

    @GetMapping("/part5/random")
    public List<Part5> getRandomPart5Questions(
            @RequestParam String label,
            @RequestParam(defaultValue = "20") int limit) {

        return service.getRandomPart5Questions(label, limit);
    }

    @GetMapping("/analysis/part5/{userId}")
    public List<SkillAnalysisDTO> getPart5Analysis(
            @PathVariable Long userId) {

        return service.getPart5Analysis(userId);
    }
}