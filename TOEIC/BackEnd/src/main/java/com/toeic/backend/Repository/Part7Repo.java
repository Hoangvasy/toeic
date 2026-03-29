package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.Part7;

import java.util.List;

public interface Part7Repo extends JpaRepository<Part7, Long> {

    List<Part7> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);
}