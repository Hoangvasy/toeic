package com.toeic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "practice_answer")
public class PracticeAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long sessionId;

    private Long questionId;

    private String userAnswer;

    private String correctAnswer;

    private Boolean isCorrect;

    private Integer timeSpent;

    // getters setters

    public Long getId() {
        return id;
    }

    public Long getSessionId() {
        return sessionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public String getUserAnswer() {
        return userAnswer;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setSessionId(Long sessionId) {
        this.sessionId = sessionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public void setUserAnswer(String userAnswer) {
        this.userAnswer = userAnswer;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public void setIsCorrect(Boolean isCorrect) {
        this.isCorrect = isCorrect;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
}