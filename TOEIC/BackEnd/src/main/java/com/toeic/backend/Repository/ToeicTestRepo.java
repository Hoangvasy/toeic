package com.toeic.backend.repository;

import com.toeic.backend.Entity.ToeicTest;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ToeicTestRepo extends JpaRepository<ToeicTest, Long> {
}