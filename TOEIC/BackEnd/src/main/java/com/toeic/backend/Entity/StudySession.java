package com.toeic.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "study_session")
public class StudySession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private String type;

    private Integer duration;

    private LocalDate date;

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public String getType() {
        return type;
    }

    public Integer getDuration() {
        return duration;
    }

    public LocalDate getDate() {
        return date;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setType(String type) {
        this.type = type;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public void setDate(LocalDate date) {
        this.date = date;
    }
}