package com.toeic.backend.repository;

import com.toeic.backend.entity.UserAttempt;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAttemptRepo extends JpaRepository<UserAttempt, Long> {

    List<UserAttempt> findByUserId(Long userId);

    List<UserAttempt> findByUserIdOrderByIdDesc(Long userId); // ✅ thêm dòng này
}