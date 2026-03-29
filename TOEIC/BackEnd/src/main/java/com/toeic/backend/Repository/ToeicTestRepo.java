package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.ToeicTest;

public interface ToeicTestRepo extends JpaRepository<ToeicTest, Long> {
}