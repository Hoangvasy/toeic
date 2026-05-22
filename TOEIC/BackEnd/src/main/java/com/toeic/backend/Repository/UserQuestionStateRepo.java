// package com.toeic.backend.repository;

// import com.toeic.backend.entity.UserQuestionState;
// import org.springframework.data.jpa.repository.JpaRepository;

// import java.util.Optional;

// public interface UserQuestionStateRepo extends JpaRepository<UserQuestionState, Long> {

//     Optional<UserQuestionState> findByUserIdAndQuestionId(Long userId, Long questionId);
// }
package com.toeic.backend.repository;

import com.toeic.backend.entity.UserQuestionState;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface UserQuestionStateRepo extends JpaRepository<UserQuestionState, Long> {

    Optional<UserQuestionState> findByUserIdAndQuestionId(Long userId, Long questionId);

    List<UserQuestionState> findByUserId(Long userId);

    // 🔥 dùng cho review (xịn hơn version filter trong Java)
    List<UserQuestionState> findByUserIdAndNextReviewBefore(Long userId, LocalDateTime time);
}