package com.toeic.backend.dto;

import java.util.List;

public class FlashcardQuizDTO {

    private Long reviewId;
    private String word;
    private String correctAnswer;
    private List<String> options;

    public FlashcardQuizDTO(Long reviewId, String word, String correctAnswer, List<String> options) {
        this.reviewId = reviewId;
        this.word = word;
        this.correctAnswer = correctAnswer;
        this.options = options;
    }

    public Long getReviewId() {
        return reviewId;
    }

    public String getWord() {
        return word;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public List<String> getOptions() {
        return options;
    }
}