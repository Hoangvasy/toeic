package com.toeic.backend.repository;

import com.toeic.backend.Entity.Part7;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Part7Repo extends JpaRepository<Part7, Long> {

    List<Part7> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);
}