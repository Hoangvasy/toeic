package com.toeic.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toeic.backend.entity.FlashcardProgress;

public interface FlashcardProgressRepo extends JpaRepository<FlashcardProgress, Long> {

    Optional<FlashcardProgress> findByUserIdAndCardId(Long userId, Long cardId);

    @Query("""
                SELECT COUNT(p)
                FROM FlashcardProgress p
                JOIN FlashcardCard c ON p.cardId = c.id
                WHERE c.setId = :setId
                AND p.userId = :userId
                AND p.learnedReview = true
            """)
    int countReview(Long setId, Long userId);

    @Query("""
                SELECT COUNT(p)
                FROM FlashcardProgress p
                JOIN FlashcardCard c ON p.cardId = c.id
                WHERE c.setId = :setId
                AND p.userId = :userId
                AND p.learnedQuiz = true
            """)
    int countQuiz(Long setId, Long userId);

    @Query("""
                SELECT COUNT(p)
                FROM FlashcardProgress p
                JOIN FlashcardCard c ON p.cardId = c.id
                WHERE c.setId = :setId
                AND p.userId = :userId
                AND p.learnedMatch = true
            """)
    int countMatch(Long setId, Long userId);

    @Query("""
                SELECT COUNT(p)
                FROM FlashcardProgress p
                JOIN FlashcardCard c ON p.cardId = c.id
                WHERE c.setId = :setId
                AND p.userId = :userId
                AND p.learnedAnki = true
            """)
    int countAnki(Long setId, Long userId);
}