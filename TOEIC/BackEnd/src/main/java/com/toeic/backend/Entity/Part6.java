package com.toeic.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "part6")
public class Part6 {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // ================= PASSAGE =================
    @Column(columnDefinition = "TEXT")
    private String passage;

    @Column(name = "passage_vn", columnDefinition = "TEXT")
    private String passageVn;

    // 🔥 GROUP PASSAGE (RẤT QUAN TRỌNG)
    @Column(name = "group_id")
    private Integer groupId;

    // ================= QUESTION =================
    @Column(columnDefinition = "TEXT")
    private String question;

    @Column(name = "question_number", nullable = false)
    private Integer questionNumber;

    // ================= OPTIONS =================
    @Column(name = "option_a")
    private String optionA;

    @Column(name = "option_b")
    private String optionB;

    @Column(name = "option_c")
    private String optionC;

    @Column(name = "option_d")
    private String optionD;

    // ================= OPTIONS VN =================
    @Column(name = "option_a_vn")
    private String optionAVn;

    @Column(name = "option_b_vn")
    private String optionBVn;

    @Column(name = "option_c_vn")
    private String optionCVn;

    @Column(name = "option_d_vn")
    private String optionDVn;

    // ================= ANSWER =================
    private String answer;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String explanation;

    @Column(name = "passage_difficulty")
private Float passageDifficulty = 0.5f;


@Column(name = "label", length = 50)
private String label;
    // ================= RELATION =================
    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    @JsonIgnore
    private ToeicTest test;

    // ================= GETTER SETTER =================

    public Long getId() {
        return id;
    }

    public String getPassage() {
        return passage;
    }

    public void setPassage(String passage) {
        this.passage = passage;
    }

    public String getPassageVn() {
        return passageVn;
    }

    public void setPassageVn(String passageVn) {
        this.passageVn = passageVn;
    }

    public Integer getGroupId() {
        return groupId;
    }

    public void setGroupId(Integer groupId) {
        this.groupId = groupId;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public Integer getQuestionNumber() {
        return questionNumber;
    }

    public void setQuestionNumber(Integer questionNumber) {
        this.questionNumber = questionNumber;
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

    public String getOptionAVn() {
        return optionAVn;
    }

    public void setOptionAVn(String optionAVn) {
        this.optionAVn = optionAVn;
    }

    public String getOptionBVn() {
        return optionBVn;
    }

    public void setOptionBVn(String optionBVn) {
        this.optionBVn = optionBVn;
    }

    public String getOptionCVn() {
        return optionCVn;
    }

    public void setOptionCVn(String optionCVn) {
        this.optionCVn = optionCVn;
    }

    public String getOptionDVn() {
        return optionDVn;
    }

    public void setOptionDVn(String optionDVn) {
        this.optionDVn = optionDVn;
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

    public ToeicTest getTest() {
        return test;
    }

    public void setTest(ToeicTest test) {
        this.test = test;
    }

    public Float getPassageDifficulty() {
    return passageDifficulty;
}
public void setPassageDifficulty(Float passageDifficulty) {
    this.passageDifficulty = passageDifficulty;
}
public String getLabel() {
    return label;
}

public void setLabel(String label) {
    this.label = label;
}
}