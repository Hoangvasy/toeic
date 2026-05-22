package com.toeic.backend.repository;

import com.toeic.backend.entity.ExamSession;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExamSessionRepo
        extends JpaRepository<ExamSession, Long> {

    // lấy lịch sử làm đề của user
    List<ExamSession> findByUserIdOrderByIdDesc(Long userId);

    // lấy các lần làm theo test
    List<ExamSession> findByUserIdAndTestId(
            Long userId,
            Long testId
    );

    // kiểm tra user đang làm dở
    List<ExamSession> findByUserIdAndCompletedFalse(
            Long userId
    );
}