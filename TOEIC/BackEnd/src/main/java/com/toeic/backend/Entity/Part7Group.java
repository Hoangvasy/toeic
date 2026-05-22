package com.toeic.backend.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "part7_group")
public class Part7Group {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "test_id", nullable = false)
    @JsonIgnore
    private ToeicTest test;

    private String header;

    @Column(columnDefinition = "TEXT")
    private String passage;

    @Column(name = "passage_translation", columnDefinition = "TEXT")
    private String passageTranslation;
    @Column(name = "passage_difficulty")
private Float passageDifficulty = 0.5f;
@Column(name = "structure_type")
    private String structureType;

    @OneToMany(
            mappedBy = "group",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonManagedReference // 🔥 FIX vòng lặp
    private List<Part7Question> questions;

    // ===== GETTER SETTER =====

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public ToeicTest getTest() { return test; }

    public void setTest(ToeicTest test) { this.test = test; }

    public String getHeader() { return header; }

    public void setHeader(String header) { this.header = header; }

    public String getPassage() { return passage; }

    public void setPassage(String passage) { this.passage = passage; }

    public String getPassageTranslation() { return passageTranslation; }

    public void setPassageTranslation(String passageTranslation) {
        this.passageTranslation = passageTranslation;
    }

    public List<Part7Question> getQuestions() { return questions; }

    public void setQuestions(List<Part7Question> questions) {
        this.questions = questions;
    }
    public Float getPassageDifficulty() {
    return passageDifficulty;
}
public void setPassageDifficulty(Float passageDifficulty) {
    this.passageDifficulty = passageDifficulty;
}
public String getStructureType() { return structureType; }

    public void setStructureType(String structureType) {
        this.structureType = structureType;
    }

}