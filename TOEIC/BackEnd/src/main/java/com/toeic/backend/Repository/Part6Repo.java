package com.toeic.backend.repository;

import com.toeic.backend.Entity.Part6;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Part6Repo extends JpaRepository<Part6, Long> {

    List<Part6> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);
}