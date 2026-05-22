package com.toeic.backend.repository;

import com.toeic.backend.entity.ExamAnswer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamAnswerRepo
        extends JpaRepository<ExamAnswer, Long> {

    // lấy tất cả answer của 1 session
    List<ExamAnswer> findByExamSessionId(
            Long examSessionId
    );

    // tìm answer theo question
    ExamAnswer findByExamSessionIdAndQuestionId(
            Long examSessionId,
            Long questionId
    );

    // xoá answer theo session
    void deleteByExamSessionId(
            Long examSessionId
    );
}