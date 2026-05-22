package com.toeic.backend.service;

import com.toeic.backend.dto.StudyHeatmapDTO;
import com.toeic.backend.entity.StudySession;
import com.toeic.backend.repository.StudySessionRepo;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class StudySessionService {

    private final StudySessionRepo repo;

    public StudySessionService(
            StudySessionRepo repo) {

        this.repo = repo;
    }

    public List<StudySession> getRecentActivities(
            Long userId) {

        return repo
                .findTop10ByUserIdOrderByDateDescIdDesc(
                        userId);
    }

    public List<StudyHeatmapDTO> getMonthlyHeatmap(
            Long userId,
            int year,
            int month) {

        List<Object[]> rows = repo.getMonthlyStudyHeatmap(
                userId,
                year,
                month);

        List<StudyHeatmapDTO> result = new ArrayList<>();

        for (Object[] row : rows) {

            LocalDate date = (LocalDate) row[0];

            Integer duration = ((Long) row[1]).intValue();

            int level = calculateLevel(duration);

            result.add(
                    new StudyHeatmapDTO(
                            date,
                            duration,
                            level));
        }

        return result;
    }

    private int calculateLevel(int duration) {

        if (duration <= 0) {
            return 0;
        }

        if (duration <= 15) {
            return 1;
        }

        if (duration <= 45) {
            return 2;
        }

        return 3;
    }

    public StudySession save(
            StudySession session) {
        return repo.save(session);
    }

}