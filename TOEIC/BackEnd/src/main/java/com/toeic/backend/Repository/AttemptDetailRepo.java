package com.toeic.backend.repository;

import com.toeic.backend.entity.AttemptDetail;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AttemptDetailRepo extends JpaRepository<AttemptDetail, Long> {
    List<AttemptDetail> findByAttemptId(Long attemptId);
}