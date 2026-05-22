package com.toeic.backend.controller;

import com.toeic.backend.ai.GroqService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")

public class AiController {

    private final GroqService groqService;

    public AiController(GroqService groqService) {
        this.groqService = groqService;
    }

    // ✅ Test controller
    @GetMapping("/ping")
    public String ping() {
        return "AI Controller is working!";
    }

    // ✅ API chính cho frontend (POST)
    @PostMapping("/analyze")
    public Map<String, String> analyze(@RequestBody Map<String, String> request) {

        System.out.println("🔥 HIT /api/ai/analyze");
        System.out.println("🔥 METHOD CALLED");
        System.out.println("🔥 REQUEST BODY: " + request);

        String question = request.getOrDefault("question", "");

        if (question.isBlank()) {
            System.out.println("⚠ QUESTION IS BLANK");
            return Map.of(
                    "label", "",
                    "answer", "");
        }

        try {
            Map<String, String> result = groqService.analyzeQuestion(question);
            System.out.println("✅ AI RESULT: " + result);
            return result;

        } catch (Exception e) {
            System.out.println("❌ AI ERROR");
            e.printStackTrace();
            return Map.of(
                    "label", "",
                    "answer", "");
        }
    }

    @PostMapping("/analyze-part6")
public Map<String, String> analyzePart6(@RequestBody Map<String, String> request) {

    System.out.println("🔥 HIT /api/ai/analyze-part6");
    System.out.println("🔥 REQUEST BODY: " + request);

    String question = request.getOrDefault("question", "");

    if (question.isBlank()) {
        return Map.of(
                "label", "",
                "answer", "");
    }

    try {
        Map<String, String> result = groqService.analyzeQuestionPart6(question);
        System.out.println("✅ AI RESULT PART 6: " + result);
        return result;

    } catch (Exception e) {
        System.out.println("❌ AI ERROR PART 6");
        e.printStackTrace();
        return Map.of(
                "label", "",
                "answer", "");
    }
}
@PostMapping("/analyze-part7")
public Map<String, String> analyzePart7(@RequestBody Map<String, String> request) {

    System.out.println("🔥 HIT /api/ai/analyze-part7");
    System.out.println("🔥 REQUEST BODY: " + request);

    String question = request.getOrDefault("question", "");

    if (question.isBlank()) {
        return Map.of(
                "label", "",
                "answer", "");
    }

    try {
        Map<String, String> result = groqService.analyzeQuestionPart7(question);
        System.out.println("✅ AI RESULT PART 7: " + result);
        return result;

    } catch (Exception e) {
        System.out.println("❌ AI ERROR PART 7");
        e.printStackTrace();
        return Map.of(
                "label", "",
                "answer", "");
    }
}
}