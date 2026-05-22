package com.toeic.backend.dto;

public class FlashcardDTO {

    private Long reviewId;
    private String word;
    private String meaningVi;
    private String example;
    private String ipa;

    public FlashcardDTO() {
    }

    public FlashcardDTO(Long reviewId, String word, String meaningVi, String example, String ipa) {
        this.reviewId = reviewId;
        this.word = word;
        this.meaningVi = meaningVi;
        this.example = example;
        this.ipa = ipa;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public void setReviewId(Long reviewId) {
        this.reviewId = reviewId;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }

    public String getMeaningVi() {
        return meaningVi;
    }

    public void setMeaningVi(String meaningVi) {
        this.meaningVi = meaningVi;
    }

    public String getExample() {
        return example;
    }

    public void setExample(String example) {
        this.example = example;
    }

    public String getIpa() {
        return ipa;
    }

    public void setIpa(String ipa) {
        this.ipa = ipa;
    }

    @Override
    public String toString() {
        return "FlashcardDTO{" +
                "reviewId=" + reviewId +
                ", word='" + word + '\'' +
                ", meaningVi='" + meaningVi + '\'' +
                ", example='" + example + '\'' +
                ", ipa='" + ipa + '\'' +
                '}';
    }
}