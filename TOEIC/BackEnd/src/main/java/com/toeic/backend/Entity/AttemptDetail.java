package com.toeic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "attempt_details")
public class AttemptDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long questionId;
    private String label; // 🔥 core của AI
    private String userAnswer;
    private String correctAnswer;
    private String questionType; // part5, part6, part7
    private Boolean isCorrect;

    // ================= RELATION =================
    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private UserAttempt attempt;

    // ================= GET SET =================
    public Long getId() {
        return id;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public UserAttempt getAttempt() {
        return attempt;
    }

    public void setAttempt(UserAttempt attempt) {
        this.attempt = attempt;
    }

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public String getQuestionType() {
        return questionType;
    }

    public void setQuestionType(String questionType) {
        this.questionType = questionType;
    }
}