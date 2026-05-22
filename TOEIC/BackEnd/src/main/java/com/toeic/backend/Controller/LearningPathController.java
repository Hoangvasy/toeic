package com.toeic.backend.controller;

import com.toeic.backend.service.LearningPathService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/learning-path")
public class LearningPathController {

    private final LearningPathService learningPathService;

    public LearningPathController(LearningPathService learningPathService) {
        this.learningPathService = learningPathService;
    }

    // ================= 🎯 MAIN LEARNING SESSION =================
    @GetMapping("/today")
    public Map<String, Object> getTodayPlan() {
        return learningPathService.generateTodayPlan();
    }

    // ================= 🔁 REVIEW ONLY (optional) =================
    @GetMapping("/review")
    public List<Map<String, Object>> getReviewQuestions() {
        return learningPathService.getReviewQuestions();
    }

    // ================= 📉 WEAK SKILLS (optional) =================
    @GetMapping("/weak-skills")
    public List<Map<String, Object>> getWeakSkills() {
        return learningPathService.getWeakSkills();
    }
}