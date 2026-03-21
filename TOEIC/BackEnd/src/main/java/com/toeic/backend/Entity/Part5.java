package com.toeic.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "part5")
public class Part5 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "idpart5")
    private Long id;

    @Column(name = "question_number")
    private Integer questionNumber;

    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    @Column(name = "answer")
    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ✅ THÊM LABEL
    @Column(name = "label")
    private String label;

    // ✅ RELATIONSHIP
    @ManyToOne
    @JoinColumn(name = "test_id")
    private ToeicTest test;

    // ===== GETTER & SETTER =====

    public Long getId() {
        return id;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }

    // ✅ LABEL
    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    // ✅ TEST
    public ToeicTest getTest() {
        return test;
    }

    public void setTest(ToeicTest test) {
        this.test = test;
    }
}