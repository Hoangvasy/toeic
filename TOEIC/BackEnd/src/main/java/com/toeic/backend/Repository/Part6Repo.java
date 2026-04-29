package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.toeic.backend.entity.Part6;

import java.util.List;

public interface Part6Repo extends JpaRepository<Part6, Long> {

    List<Part6> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);

    @Query("""
            SELECT DISTINCT p.test.id, p.test.title
            FROM Part6 p
            ORDER BY p.test.id
            """)
    List<Object[]> getAvailablePart6Tests();
}