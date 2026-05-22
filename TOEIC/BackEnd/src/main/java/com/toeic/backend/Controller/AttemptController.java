package com.toeic.backend.controller;

import com.toeic.backend.service.AttemptService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/attempt")
@CrossOrigin
public class AttemptController {

    private final AttemptService attemptService;

    public AttemptController(AttemptService attemptService) {
        this.attemptService = attemptService;
    }

    @PostMapping("/submit")
    public ResponseEntity<Map<String, String>> submit(
            @RequestBody Map<String, Object> body
    ) {

        attemptService.saveAttempt(body);

        Map<String, String> res = new HashMap<>();
        res.put("message", "Saved successfully");

        return ResponseEntity.ok(res);
    }
}