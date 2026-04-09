package com.toeic.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "practice_session")
public class PracticeSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;

    private Integer part;

    private String topic;

    private Integer totalQuestions;

    private Integer correctAnswers;

    private LocalDateTime startTime;

    private LocalDateTime endTime;

    // getters setters

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public Integer getPart() {
        return part;
    }

    public String getTopic() {
        return topic;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setPart(Integer part) {
        this.part = part;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}