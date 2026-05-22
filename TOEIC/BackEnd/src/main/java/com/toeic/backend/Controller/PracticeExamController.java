package com.toeic.backend.controller;

import com.toeic.backend.service.PracticeExamService;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/practice-exam")
@CrossOrigin("*")
public class PracticeExamController {

    private final PracticeExamService practiceExamService;

    public PracticeExamController(PracticeExamService practiceExamService) {
        this.practiceExamService = practiceExamService;
    }

    // ================= GET EXAM =================
    @GetMapping
public List<Map<String, Object>> getPracticeExam(
        @RequestParam Long testId,
        @RequestParam String parts
) {
    // Hỗ trợ cả hai định dạng: 5-7  hoặc  5,6,7
    String normalized = parts.replace("-", ",");
    
    List<Integer> partList = Arrays.stream(normalized.split(","))
            .map(String::trim)
            .filter(s -> !s.isEmpty())
            .map(Integer::parseInt)
            .toList();

    if (partList.isEmpty()) {
        throw new IllegalArgumentException("Parts cannot be empty");
    }

    return practiceExamService.getExam(testId, partList);
}

    @GetMapping("/ping")
    public String ping() {
        return "OK";
    }
}