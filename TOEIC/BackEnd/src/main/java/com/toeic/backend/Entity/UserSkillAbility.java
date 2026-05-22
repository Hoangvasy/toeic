package com.toeic.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "user_skill_ability",
    uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill"})
)
public class UserSkillAbility {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= RELATION =================
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // ================= CORE =================
    @Column(nullable = false, length = 50)
    private String skill;

    @Column(nullable = false)
    private Float ability = 0.5f;

    private Integer totalAttempts = 0;
    private Integer correctAttempts = 0;

    // ================= LEARNING TRACKING =================
    @Column(name = "last_seen_at")
    private LocalDateTime lastSeenAt;

    @Column(name = "next_review_at")
    private LocalDateTime nextReviewAt;

    @Column(name = "last_result")
    private Boolean lastResult;

    @Column(name = "streak")
    private Integer streak = 0;

    // ================= META =================
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ================= GETTER SETTER =================

    public Long getId() { return id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getSkill() { return skill; }
    public void setSkill(String skill) { this.skill = skill; }

    public Float getAbility() { return ability; }
    public void setAbility(Float ability) { this.ability = ability; }

    public Integer getTotalAttempts() { return totalAttempts; }
    public void setTotalAttempts(Integer totalAttempts) { this.totalAttempts = totalAttempts; }

    public Integer getCorrectAttempts() { return correctAttempts; }
    public void setCorrectAttempts(Integer correctAttempts) { this.correctAttempts = correctAttempts; }

    public LocalDateTime getLastSeenAt() { return lastSeenAt; }
    public void setLastSeenAt(LocalDateTime lastSeenAt) { this.lastSeenAt = lastSeenAt; }

    public LocalDateTime getNextReviewAt() { return nextReviewAt; }
    public void setNextReviewAt(LocalDateTime nextReviewAt) { this.nextReviewAt = nextReviewAt; }

    public Boolean getLastResult() { return lastResult; }
    public void setLastResult(Boolean lastResult) { this.lastResult = lastResult; }

    public Integer getStreak() { return streak; }
    public void setStreak(Integer streak) { this.streak = streak; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
}