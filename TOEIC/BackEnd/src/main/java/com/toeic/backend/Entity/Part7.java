package com.toeic.backend.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "part7")
public class Part7 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String header;

    @Column(columnDefinition = "TEXT")
    private String passage;

    @Column(name = "question_number")
    private int questionNumber;

    private String question;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    private ToeicTest test;

    // ===== GETTER SETTER =====
    public Long getId() { return id; }

    public String getHeader() { return header; }
    public void setHeader(String header) { this.header = header; }

    public String getPassage() { return passage; }
    public void setPassage(String passage) { this.passage = passage; }

    public int getQuestionNumber() { return questionNumber; }
    public void setQuestionNumber(int questionNumber) { this.questionNumber = questionNumber; }

    public String getQuestion() { return question; }
    public void setQuestion(String question) { this.question = question; }

    public String getOptionA() { return optionA; }
    public void setOptionA(String optionA) { this.optionA = optionA; }

    public String getOptionB() { return optionB; }
    public void setOptionB(String optionB) { this.optionB = optionB; }

    public String getOptionC() { return optionC; }
    public void setOptionC(String optionC) { this.optionC = optionC; }

    public String getOptionD() { return optionD; }
    public void setOptionD(String optionD) { this.optionD = optionD; }

    public String getAnswer() { return answer; }
    public void setAnswer(String answer) { this.answer = answer; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public ToeicTest getTest() { return test; }
    public void setTest(ToeicTest test) { this.test = test; }
}