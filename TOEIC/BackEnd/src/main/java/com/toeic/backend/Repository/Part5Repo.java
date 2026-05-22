package com.toeic.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toeic.backend.entity.Part5;


import java.util.List;

public interface Part5Repo extends JpaRepository<Part5, Long> {

    // 🔥 Random N câu Part 5
    @Query(value = "SELECT * FROM part5 ORDER BY RAND() LIMIT ?1", nativeQuery = true)
    List<Part5> findRandom(int limit);

    List<Part5> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    List<Part5> findByLabel(String label);

    void deleteByTestId(Long testId);

    @Query(value = "SELECT * FROM part5 WHERE label = :label ORDER BY RAND()", nativeQuery = true)
    List<Part5> getRandomQuestions(
            @Param("label") String label,
            Pageable pageable);
    @Query(value = "SELECT * FROM part5 WHERE label = ?1 ORDER BY RAND() LIMIT ?2", nativeQuery = true)
List<Part5> findRandomByLabel(String label, int limit);

@Query(value = """
    SELECT * FROM part5 
    WHERE label = ?1 
    AND difficulty BETWEEN ?2 AND ?3
    ORDER BY RAND()
    LIMIT ?4
""", nativeQuery = true)
List<Part5> findByLabelAndDifficulty(
        String label,
        float min,
        float max,
        int limit
);
}