package com.toeic.backend.controller;

import com.toeic.backend.dto.StudyHeatmapDTO;
import com.toeic.backend.entity.StudySession;
import com.toeic.backend.service.StudySessionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/study-session")
public class StudySessionController {

    private final StudySessionService service;

    public StudySessionController(
            StudySessionService service) {

        this.service = service;
    }

    @GetMapping("/user/{userId}")
    public List<StudySession> getUserActivities(
            @PathVariable Long userId) {

        return service
                .getRecentActivities(userId);
    }

    @GetMapping("/heatmap")
    public List<StudyHeatmapDTO> getHeatmap(
            @RequestParam Long userId,
            @RequestParam int year,
            @RequestParam int month) {

        return service.getMonthlyHeatmap(
                userId,
                year,
                month);
    }

    @PostMapping
    public StudySession createSession(
            @RequestBody StudySession session) {

        return service.save(session);
    }
}