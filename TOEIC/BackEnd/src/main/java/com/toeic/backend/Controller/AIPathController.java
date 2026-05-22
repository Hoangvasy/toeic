package com.toeic.backend.controller;

import com.toeic.backend.service.AIPathService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-path")
@CrossOrigin
public class AIPathController {

    private final AIPathService service;

    public AIPathController(AIPathService service) {
        this.service = service;
    }

    // ================= ENTRY TEST =================
    @PostMapping("/entry-test")
    public Map<String, Object> generateEntryTest() {
        return service.generateEntryTest();
    }

    // ================= REALTIME ANSWER (NEW) =================
    @PostMapping("/answer")
    public Map<String, Object> answer(@RequestBody Map<String, Object> body) {
        return service.handleAnswer(body);
    }

    // ================= SAVE ATTEMPT (OPTIONAL - GIỮ LẠI) =================
   @PostMapping("/submit")
public Map<String, Object> submit(@RequestBody Map<String, Object> body) {

    Long attemptId = service.saveAttempt(body);

    Map<String, Object> res = new HashMap<>();
    res.put("message", "Saved successfully");
    res.put("attemptId", attemptId);

    return res;
}
}