package com.toeic.backend.dto;

public class FlashcardSetDTO {

    private Long id;
    private String title;
    private String description;

    private int cardCount;
    private int progressReview;
    private int progressAnki;
    private int progressQuiz;
    private int progressMatch;

    private int learnedReview;
    private int learnedAnki;
    private int learnedQuiz;
    private int learnedMatch;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getCardCount() {
        return cardCount;
    }

    public void setCardCount(int cardCount) {
        this.cardCount = cardCount;
    }

    public int getProgressReview() {
        return progressReview;
    }

    public void setProgressReview(int progressReview) {
        this.progressReview = progressReview;
    }

    public int getProgressAnki() {
        return progressAnki;
    }

    public void setProgressAnki(int progressAnki) {
        this.progressAnki = progressAnki;
    }

    public int getProgressQuiz() {
        return progressQuiz;
    }

    public void setProgressQuiz(int progressQuiz) {
        this.progressQuiz = progressQuiz;
    }

    public int getProgressMatch() {
        return progressMatch;
    }

    public void setProgressMatch(int progressMatch) {
        this.progressMatch = progressMatch;
    }

    public int getLearnedReview() {
        return learnedReview;
    }

    public void setLearnedReview(int learnedReview) {
        this.learnedReview = learnedReview;
    }

    public int getLearnedAnki() {
        return learnedAnki;
    }

    public void setLearnedAnki(int learnedAnki) {
        this.learnedAnki = learnedAnki;
    }

    public int getLearnedQuiz() {
        return learnedQuiz;
    }

    public void setLearnedQuiz(int learnedQuiz) {
        this.learnedQuiz = learnedQuiz;
    }

    public int getLearnedMatch() {
        return learnedMatch;
    }

    public void setLearnedMatch(int learnedMatch) {
        this.learnedMatch = learnedMatch;
    }

}