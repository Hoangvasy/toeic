package com.toeic.backend.dto;

import java.time.LocalDate;

public class StudyHeatmapDTO {

    private LocalDate date;

    private Integer duration;

    private Integer level;

    public StudyHeatmapDTO(
            LocalDate date,
            Integer duration,
            Integer level) {
        this.date = date;
        this.duration = duration;
        this.level = level;
    }

    public LocalDate getDate() {
        return date;
    }

    public Integer getDuration() {
        return duration;
    }

    public Integer getLevel() {
        return level;
    }
}