package com.toeic.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.repository.StudySessionRepo;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.Part6;
import com.toeic.backend.entity.Part7Group;

import com.toeic.backend.dto.Part6TestDTO;

import com.toeic.backend.service.PracticeService;
import com.toeic.backend.service.Part6Service;
import com.toeic.backend.service.Part7Service;

@RestController
@RequestMapping("/api/practice")
public class PracticeController {

    private final PracticeService service;
    private final Part6Service part6Service;
    private final Part7Service part7Service;
    private final StudySessionRepo studySessionRepository;

    public PracticeController(
            PracticeService service,
            Part6Service part6Service,
            Part7Service part7Service,
            StudySessionRepo studySessionRepository) {

        this.service = service;
        this.part6Service = part6Service;
        this.part7Service = part7Service;
        this.studySessionRepository = studySessionRepository;
    }

    @PostMapping("/session/start")
    public PracticeSession startSession(@RequestBody Map<String, Object> req) {

        Long userId = ((Number) req.get("userId")).longValue();
        Integer part = ((Number) req.get("part")).intValue();
        String topic = (String) req.get("topic");
        Integer questionCount = ((Number) req.get("questionCount")).intValue();

        return service.startSession(userId, part, topic, questionCount);
    }

    @PostMapping("/answer")
    public PracticeAnswer submitAnswer(@RequestBody Map<String, Object> req) {

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

    // @PostMapping("/session/end")
    // public PracticeSession endSession(@RequestBody Map<String, Object> req) {

    // Long sessionId = ((Number) req.get("sessionId")).longValue();
    // Integer correctAnswers = ((Number) req.get("correctAnswers")).intValue();

    // return service.endSession(sessionId, correctAnswers);
    // }

    @PostMapping("/session/end")
    public PracticeSession endSession(
            @RequestBody Map<String, Object> req) {

        Long sessionId = ((Number) req.get("sessionId"))
                .longValue();

        Integer correctAnswers = ((Number) req.get("correctAnswers"))
                .intValue();

        Integer durationSeconds = ((Number) req.get("durationSeconds"))
                .intValue();

        Integer answeredQuestions = ((Number) req.get("answeredQuestions"))
                .intValue();

        return service.endSession(

                sessionId,

                correctAnswers,

                durationSeconds,

                answeredQuestions);
    }

    @GetMapping("/part5/random")
    public List<Part5> getRandomPart5Questions(
            @RequestParam String label,
            @RequestParam(defaultValue = "20") int limit) {

        return service.getRandomPart5Questions(label, limit);
    }

    @GetMapping("/part6/tests")
    public List<Part6TestDTO> getPart6Tests() {
        return part6Service.getPart6Tests();
    }

    @GetMapping("/part6/random")
    public List<Part6> getPart6ByTest(@RequestParam Long testId) {
        return part6Service.getQuestionsByTest(testId);
    }

    // @GetMapping("/part7")
    // public List<Part7Group> practicePart7(@RequestParam String type) {
    // return part7Service.getPracticeQuestions(type);
    // }

    @GetMapping("/part7")
    public Part7Group getPart7(
            @RequestParam String type) {
        return part7Service.getRandomByType(type);
    }
}