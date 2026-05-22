package com.toeic.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
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

    // ✅ DỊCH CÂU HỎI
    @Column(name = "translation_vn", columnDefinition = "TEXT")
    private String translationVn;

    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_a_vn")
    private String optionAVn;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_b_vn")
    private String optionBVn;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_c_vn")
    private String optionCVn;

    @Column(name = "option_d")
    private String optionD;

    @Column(name = "option_d_vn")
    private String optionDVn;

    @Column(name = "answer")
    private String answer;

    @Column(columnDefinition = "TEXT")
    private String explanation;

    // ✅ LABEL
    @Column(name = "label")
    private String label;

    @Column(name = "difficulty")
private Float difficulty = 0.5f;

    // ✅ RELATIONSHIP
    @ManyToOne
    @JoinColumn(name = "test_id")
    @JsonIgnore
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

    // ===== TRANSLATION =====

    public String getTranslationVn() {
        return translationVn;
    }

    public void setTranslationVn(String translationVn) {
        this.translationVn = translationVn;
    }

    public String getOptionA() {
        return optionA;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public String getOptionAVn() {
        return optionAVn;
    }

    public void setOptionAVn(String optionAVn) {
        this.optionAVn = optionAVn;
    }

    public String getOptionB() {
        return optionB;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public String getOptionBVn() {
        return optionBVn;
    }

    public void setOptionBVn(String optionBVn) {
        this.optionBVn = optionBVn;
    }

    public String getOptionC() {
        return optionC;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public String getOptionCVn() {
        return optionCVn;
    }

    public void setOptionCVn(String optionCVn) {
        this.optionCVn = optionCVn;
    }

    public String getOptionD() {
        return optionD;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public String getOptionDVn() {
        return optionDVn;
    }

    public void setOptionDVn(String optionDVn) {
        this.optionDVn = optionDVn;
    }

    // ===== OTHER =====

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

    public String getLabel() {
        return label;
    }

    public void setLabel(String label) {
        this.label = label;
    }

    public Float getDifficulty() {
    return difficulty;
}
public void setDifficulty(Float difficulty) {
    this.difficulty = difficulty;
}

    public ToeicTest getTest() {
        return test;
    }

    public void setTest(ToeicTest test) {
        this.test = test;
    }
}