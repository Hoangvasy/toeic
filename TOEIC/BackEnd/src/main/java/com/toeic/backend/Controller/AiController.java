package com.toeic.backend.Controller;

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
}