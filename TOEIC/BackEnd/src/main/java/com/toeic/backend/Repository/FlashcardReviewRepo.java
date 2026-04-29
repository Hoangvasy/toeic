package com.toeic.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toeic.backend.entity.FlashcardReview;

public interface FlashcardReviewRepo extends JpaRepository<FlashcardReview, Long> {

    List<FlashcardReview> findByUserIdAndNextReviewBefore(
            Long userId,
            LocalDateTime time);

    Optional<FlashcardReview> findByUserIdAndCardId(Long userId, Long cardId);

    // ===== DUE CARDS =====
    @Query("""
                SELECT r
                FROM FlashcardReview r
                JOIN FlashcardCard c ON r.cardId = c.id
                WHERE r.userId = :userId
                AND c.setId = :setId
                AND r.nextReview <= :time
            """)
    List<FlashcardReview> findDueCards(Long userId, Long setId, LocalDateTime time);

    // ===== COUNT LEARNED (QUAN TRỌNG NHẤT) =====
    @Query("""
                SELECT COUNT(r)
                FROM FlashcardReview r
                JOIN FlashcardCard c ON r.cardId = c.id
                WHERE c.setId = :setId
                AND r.userId = :userId
                AND r.repetitions > 0
            """)
    int countLearned(Long setId, Long userId);

    // ===== COUNT DUE =====
    @Query("""
                SELECT COUNT(r)
                FROM FlashcardReview r
                WHERE r.userId = :userId
                AND r.cardId IN (
                    SELECT c.id FROM FlashcardCard c WHERE c.setId = :setId
                )
                AND r.nextReview <= :now
            """)
    int countDueCards(Long userId, Long setId, LocalDateTime now);

    // ===== COUNT REVIEWED TODAY =====
    @Query("""
                SELECT COUNT(r)
                FROM FlashcardReview r
                WHERE r.userId = :userId
                AND r.lastReview >= CURRENT_DATE
                AND r.cardId IN (
                    SELECT c.id FROM FlashcardCard c WHERE c.setId = :setId
                )
            """)
    int countReviewedToday(Long userId, Long setId);
}