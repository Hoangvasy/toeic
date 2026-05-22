package com.toeic.backend.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "part7_question")
public class Part7Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "group_id", nullable = false)
    @JsonBackReference // 🔥 FIX LOOP
    private Part7Group group;

    @Column(name = "question_number")
    private int questionNumber;

    @Column(name = "label", length = 50)
private String label;

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

    @Column(name = "option_a_vn")
    private String optionAVn;

    @Column(name = "option_b_vn")
    private String optionBVn;

    @Column(name = "option_c_vn")
    private String optionCVn;

    @Column(name = "option_d_vn")
    private String optionDVn;

    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ===== GETTER SETTER =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public Part7Group getGroup() { return group; }

    public void setGroup(Part7Group group) { this.group = group; }

    public int getQuestionNumber() { return questionNumber; }

    public void setQuestionNumber(int questionNumber) {
        this.questionNumber = questionNumber;
    }

    public String getQuestion() { return question; }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getOptionA() { return optionA; }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionB() { return optionB; }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionC() { return optionC; }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionD() { return optionD; }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getOptionAVn() { return optionAVn; }

    public void setOptionAVn(String optionAVn) {
        this.optionAVn = optionAVn;
    }

    public String getOptionBVn() { return optionBVn; }

    public void setOptionBVn(String optionBVn) {
        this.optionBVn = optionBVn;
    }

    public String getOptionCVn() { return optionCVn; }

    public void setOptionCVn(String optionCVn) {
        this.optionCVn = optionCVn;
    }

    public String getOptionDVn() { return optionDVn; }

    public void setOptionDVn(String optionDVn) {
        this.optionDVn = optionDVn;
    }

    public String getAnswer() { return answer; }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getExplanation() { return explanation; }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
    public String getLabel() {
    return label;
}

// setter
public void setLabel(String label) {
    this.label = label;
}
}