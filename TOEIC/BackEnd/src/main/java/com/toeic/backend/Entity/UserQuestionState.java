package com.toeic.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_question_state",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "question_id"})
)
public class UserQuestionState {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    // ================= CORE =================
    @Column(name = "mastery_level")
    private Integer masteryLevel = 0;

    @Column(name = "wrong_count")
    private Integer wrongCount = 0;

    // ================= TRACKING =================
    @Column(name = "correct_count")
    private Integer correctCount = 0;

    @Column(name = "total_attempts")
    private Integer totalAttempts = 0;

    // ================= BEHAVIOR =================
    private Integer streak = 0;

    @Column(name = "last_result")
    private Boolean lastResult;

    // ================= SRS =================
    @Column(name = "ease_factor")
    private Float easeFactor = 2.5f;

    @Column(name = "review_interval")
    private Integer reviewInterval = 1;

    // ================= TIME =================
    @Column(name = "last_seen")
    private LocalDateTime lastSeen;

    @Column(name = "next_review")
    private LocalDateTime nextReview;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================= GETTER / SETTER =================

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public Long getQuestionId() { return questionId; }
    public void setQuestionId(Long questionId) { this.questionId = questionId; }

    public Integer getMasteryLevel() { return masteryLevel; }
    public void setMasteryLevel(Integer masteryLevel) { this.masteryLevel = masteryLevel; }

    public Integer getWrongCount() { return wrongCount; }
    public void setWrongCount(Integer wrongCount) { this.wrongCount = wrongCount; }

    public Integer getCorrectCount() { return correctCount; }
    public void setCorrectCount(Integer correctCount) { this.correctCount = correctCount; }

    public Integer getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(Integer totalAttempts) { this.totalAttempts = totalAttempts; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public Boolean getLastResult() { return lastResult; }
    public void setLastResult(Boolean lastResult) { this.lastResult = lastResult; }

    public Float getEaseFactor() { return easeFactor; }
    public void setEaseFactor(Float easeFactor) { this.easeFactor = easeFactor; }

    public Integer getReviewInterval() { return reviewInterval; }
    public void setReviewInterval(Integer reviewInterval) { this.reviewInterval = reviewInterval; }

    public LocalDateTime getLastSeen() { return lastSeen; }
    public void setLastSeen(LocalDateTime lastSeen) { this.lastSeen = lastSeen; }

    public LocalDateTime getNextReview() { return nextReview; }
    public void setNextReview(LocalDateTime nextReview) { this.nextReview = nextReview; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}