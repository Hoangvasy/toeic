package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.toeic.backend.entity.Part7;

import java.util.List;

public interface Part7Repo extends JpaRepository<Part7, Long> {

    List<Part7> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);

    @Query(value = "SELECT DISTINCT group_id FROM part7 WHERE type = :type ORDER BY RAND() LIMIT 1", nativeQuery = true)
    Long getRandomGroup(String type);

    List<Part7> findByGroupIdOrderByQuestionNumber(Long groupId);
}