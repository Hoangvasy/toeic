package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.Part5;

import java.util.List;

public interface Part5Repo extends JpaRepository<Part5, Long> {

    List<Part5> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);
}