package com.toeic.backend.repository;

import com.toeic.backend.entity.Part7Question;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface Part7QuestionRepo extends JpaRepository<Part7Question, Long> {

    // Lấy câu hỏi theo group

    List<Part7Question> findByGroupId(Long groupId);

    // Xoá câu hỏi theo group
    void deleteByGroupId(Long groupId);

    Optional<Part7Question> findById(Long id);
}