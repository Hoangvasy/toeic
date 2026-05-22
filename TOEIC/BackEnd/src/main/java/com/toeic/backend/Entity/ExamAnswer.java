package com.toeic.backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "exam_answer")
public class ExamAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // session nào
    @Column(name = "exam_session_id", nullable = false)
    private Long examSessionId;

    // question id
    @Column(name = "question_id", nullable = false)
    private Long questionId;

    // part mấy
    @Column(nullable = false)
    private Integer part;

    // số câu
    @Column(name = "question_number")
    private Integer questionNumber;

    // user chọn
    @Column(name = "user_answer")
    private String userAnswer;

    // đáp án đúng
    @Column(name = "correct_answer")
    private String correctAnswer;

    // đúng hay sai
    @Column(name = "is_correct")
    private Boolean isCorrect;

    // thời gian làm câu đó (giây)
    @Column(name = "time_spent")
    private Integer timeSpent;

    @Column(name = "label")
private String label;

    // ================= GETTER SETTER =================

    public Long getId() {
        return id;
    }

    public Long getExamSessionId() {
        return examSessionId;
    }

    public void setExamSessionId(Long examSessionId) {
        this.examSessionId = examSessionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Integer getPart() {
        return part;
    }

    public void setPart(Integer part) {
        this.part = part;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
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

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }

    public Integer getTimeSpent() {
        return timeSpent;
    }

    public void setTimeSpent(Integer timeSpent) {
        this.timeSpent = timeSpent;
    }
    public String getLabel() {
    return label;
}

public void setLabel(String label) {
    this.label = label;
}
}