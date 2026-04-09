package com.toeic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toeic.backend.entity.PracticeAnswer;

public interface PracticeAnswerRepo
                extends JpaRepository<PracticeAnswer, Long> {

        @Query("""
                        SELECT s.topic,
                               COUNT(a.id),
                               SUM(CASE WHEN a.isCorrect = true THEN 1 ELSE 0 END)
                        FROM PracticeAnswer a
                        JOIN PracticeSession s
                        ON a.sessionId = s.id
                        WHERE s.userId = :userId
                        AND s.part = 5
                        GROUP BY s.topic
                        """)
        List<Object[]> getPart5SkillAnalysis(Long userId);

}