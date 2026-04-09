package com.toeic.backend.repository;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toeic.backend.entity.Part5;

import java.util.List;

public interface Part5Repo extends JpaRepository<Part5, Long> {

    List<Part5> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);

    @Query(value = "SELECT * FROM part5 WHERE label = :label ORDER BY RAND()", nativeQuery = true)
    List<Part5> getRandomQuestions(
            @Param("label") String label,
            Pageable pageable);
}