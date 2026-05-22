package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import com.toeic.backend.entity.Part6;

import java.util.List;

public interface Part6Repo extends JpaRepository<Part6, Long> {

    // ✅ Lấy random group_id
    @Query(value = "SELECT DISTINCT group_id FROM part6 ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Long> findRandomGroupIds(@org.springframework.data.repository.query.Param("limit") int limit);

    // ✅ Lấy câu hỏi theo group
    List<Part6> findByGroupIdIn(List<Long> groupIds);

    List<Part6> findByTestId(Long testId);

    boolean existsByTestId(Long testId);

    List<Part6> findByGroupId(Long groupId);

    void deleteByTestId(Long testId);

    @Query("""
            SELECT DISTINCT p.test.id, p.test.title
            FROM Part6 p
            ORDER BY p.test.id
            """)
    List<Object[]> getAvailablePart6Tests();
}