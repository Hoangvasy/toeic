package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.toeic.backend.entity.PracticeSession;

public interface PracticeSessionRepo
                extends JpaRepository<PracticeSession, Long> {
}