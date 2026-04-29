package com.toeic.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.Vocabulary;

public interface VocabularyRepo
        extends JpaRepository<Vocabulary, Long> {

    Optional<Vocabulary> findByWord(String word);
}
