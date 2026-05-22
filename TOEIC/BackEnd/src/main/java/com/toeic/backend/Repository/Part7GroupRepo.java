package com.toeic.backend.repository;

import com.toeic.backend.entity.Part7Group;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface Part7GroupRepo extends JpaRepository<Part7Group, Long> {

    // RANDOM MODE (giữ nguyên)
    @Query(value = "SELECT * FROM part7_group ORDER BY RAND() LIMIT :limit", nativeQuery = true)
    List<Part7Group> findRandom(@Param("limit") int limit);

    // FULL MODE
    List<Part7Group> findByTestId(Long testId);

    // ==================== BỔ SUNG KHUYẾN NGHỊ ====================

    // Lấy theo testId và sắp xếp theo thứ tự
    List<Part7Group> findByTestIdOrderByIdAsc(Long testId);

    void deleteByTestId(Long testId);

    boolean existsByTestId(Long testId);

    @Query("""
                SELECT DISTINCT g
                FROM Part7Group g
                LEFT JOIN FETCH g.questions
                WHERE g.structureType = :type
            """)
    List<Part7Group> findByTypeWithQuestions(
            @Param("type") String type);

    // Tiện ích
    List<Part7Group> findByIdIn(List<Long> ids);

@Query(value = """
    SELECT *
    FROM part7_group
    WHERE structure_type = :structure
      AND passage_difficulty BETWEEN :min AND :max
    ORDER BY RAND()
    LIMIT :limit
""", nativeQuery = true)
List<Part7Group> findAdaptive(
        @Param("structure") String structure,
        @Param("min") float min,
        @Param("max") float max,
        @Param("limit") int limit
);

}