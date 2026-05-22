package com.toeic.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "exam_session")
public class ExamSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // user nào làm
    @Column(name = "user_id", nullable = false)
    private Long userId;

    // đề nào
    @Column(name = "test_id", nullable = false)
    private Long testId;

    // parts làm: "5,6,7"
    @Column(nullable = false)
    private String parts;

    // tổng số câu
    @Column(name = "total_questions")
    private Integer totalQuestions;

    // số câu đúng
    @Column(name = "correct_answers")
    private Integer correctAnswers = 0;

    // trạng thái hoàn thành
    @Column(name = "is_completed")
    private Boolean completed = false;

    // thời gian bắt đầu
    @Column(name = "start_time")
    private LocalDateTime startTime;

    // thời gian nộp bài
    @Column(name = "end_time")
    private LocalDateTime endTime;

    // ================= GETTER SETTER =================

    public Long getId() {
        return id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getTestId() {
        return testId;
    }

    public void setTestId(Long testId) {
        this.testId = testId;
    }

    public String getParts() {
        return parts;
    }

    public void setParts(String parts) {
        this.parts = parts;
    }

    public Integer getTotalQuestions() {
        return totalQuestions;
    }

    public void setTotalQuestions(Integer totalQuestions) {
        this.totalQuestions = totalQuestions;
    }

    public Integer getCorrectAnswers() {
        return correctAnswers;
    }

    public void setCorrectAnswers(Integer correctAnswers) {
        this.correctAnswers = correctAnswers;
    }

    public Boolean getCompleted() {
        return completed;
    }

    public void setCompleted(Boolean completed) {
        this.completed = completed;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }
}