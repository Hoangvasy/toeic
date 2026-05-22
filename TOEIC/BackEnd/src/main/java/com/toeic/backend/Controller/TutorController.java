package com.toeic.backend.controller;

import com.toeic.backend.ai.GroqTutorService;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/tutor")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class TutorController {

    private final GroqTutorService tutorService;

    public TutorController(GroqTutorService tutorService) {
        this.tutorService = tutorService;
    }

    @PostMapping("/explain")
    public String explain(@RequestBody Map<String, String> body) {

        try {
            String text = body.getOrDefault("text", "");
            String userAnswer = body.getOrDefault("userAnswer", ""); // 👈 THÊM

            System.out.println("🔥 HIT /api/tutor/explain");
            System.out.println("TEXT: " + text);
            System.out.println("USER ANSWER: " + userAnswer);

            return tutorService.explain(text, userAnswer); // 👈 FIX

        } catch (Exception e) {
            e.printStackTrace();
            return "❌ Lỗi AI tutor";
        }
    }

    @GetMapping("/ping")
    public String ping() {
        return "Tutor API OK";
    }
}