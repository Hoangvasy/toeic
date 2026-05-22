package com.toeic.backend.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "flashcard_progress", uniqueConstraints = @UniqueConstraint(columnNames = { "userId", "cardId" }))
public class FlashcardProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private Long cardId;

    private boolean learnedReview = false;
    private boolean learnedAnki = false;
    private boolean learnedQuiz = false;
    private boolean learnedMatch = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCardId() {
        return cardId;
    }

    public void setCardId(Long cardId) {
        this.cardId = cardId;
    }

    public boolean isLearnedReview() {
        return learnedReview;
    }

    public void setLearnedReview(boolean learnedReview) {
        this.learnedReview = learnedReview;
    }

    public boolean isLearnedAnki() {
        return learnedAnki;
    }

    public void setLearnedAnki(boolean learnedAnki) {
        this.learnedAnki = learnedAnki;
    }

    public boolean isLearnedQuiz() {
        return learnedQuiz;
    }

    public void setLearnedQuiz(boolean learnedQuiz) {
        this.learnedQuiz = learnedQuiz;
    }

    public boolean isLearnedMatch() {
        return learnedMatch;
    }

    public void setLearnedMatch(boolean learnedMatch) {
        this.learnedMatch = learnedMatch;
    }

}
