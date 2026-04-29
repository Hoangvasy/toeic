package com.toeic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toeic.backend.entity.FlashcardCard;

public interface FlashcardCardRepo extends JpaRepository<FlashcardCard, Long> {

    List<FlashcardCard> findBySetId(Long setId);

    @Query("""
            SELECT COUNT(c)
            FROM FlashcardCard c
            WHERE c.setId = :setId
            """)
    int countBySetId(Long setId);

    @Query(value = """
                SELECT meaning_vi
                FROM flashcard_card
                WHERE set_id = :setId
                AND id != :cardId
                ORDER BY RAND()
                LIMIT 3
            """, nativeQuery = true)
    List<String> getRandomWrongAnswers(
            @Param("setId") Long setId,
            @Param("cardId") Long cardId);

    @Query(value = """
                SELECT meaning_vi
                FROM flashcard_card
                WHERE id != :cardId
                ORDER BY RAND()
                LIMIT 10
            """, nativeQuery = true)
    List<String> getRandomGlobalWrongAnswers(
            @Param("cardId") Long cardId);
}