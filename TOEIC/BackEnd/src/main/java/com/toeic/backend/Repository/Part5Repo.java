package com.toeic.backend.repository;

import com.toeic.backend.Entity.Part5;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Part5Repo extends JpaRepository<Part5, Long> {

    List<Part5> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    void deleteByTestId(Long testId);
}