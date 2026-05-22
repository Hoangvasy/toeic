package com.toeic.backend.repository;

import com.toeic.backend.entity.StudySession;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface StudySessionRepo
                extends JpaRepository<StudySession, Long> {

        List<StudySession> findTop10ByUserIdOrderByDateDescIdDesc(
                        Long userId);

        @Query("""
                                SELECT s.date, SUM(s.duration)
                                FROM StudySession s
                                WHERE s.userId = :userId
                                AND YEAR(s.date) = :year
                                AND MONTH(s.date) = :month
                                GROUP BY s.date
                                ORDER BY s.date
                        """)
        List<Object[]> getMonthlyStudyHeatmap(
                        Long userId,
                        int year,
                        int month);
}
