package com.toeic.backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.FlashcardSet;

public interface FlashcardSetRepo extends JpaRepository<FlashcardSet, Long> {

    List<FlashcardSet> findByUserId(Long userId);

}