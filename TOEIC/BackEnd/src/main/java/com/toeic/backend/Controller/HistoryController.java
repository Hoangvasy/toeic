package com.toeic.backend.controller;

import com.toeic.backend.entity.User;
import com.toeic.backend.service.HistoryService;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpSession;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ai-path")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true") // 🔥 thêm dòng này
public class HistoryController {

    private final HistoryService service;

    public HistoryController(HistoryService service) {
        this.service = service;
    }

    // ================= HISTORY =================
  @GetMapping("/history")
public List<Map<String, Object>> getHistory(HttpSession session) {

    Long userId = (Long) session.getAttribute("userId");

    if (userId == null) {
        throw new RuntimeException("User not logged in");
    }

    return service.getHistory(userId);
}
    // ================= OVERVIEW =================
    @GetMapping("/attempt/{id}")
    public Map<String, Object> getAttemptDetail(@PathVariable Long id) {
        return service.getAttemptDetail(id);
    }
}