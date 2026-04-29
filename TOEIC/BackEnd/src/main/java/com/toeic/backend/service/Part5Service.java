package com.toeic.backend.service;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Part5Service {

    private final Part5Repo repo;
    private final ToeicTestRepo testRepo;

    public Part5Service(Part5Repo repo, ToeicTestRepo testRepo) {
        this.repo = repo;
        this.testRepo = testRepo;
    }

    // ================= GET DATA =================
    public List<Part5> getByTestId(Long testId) {
        return repo.findByTestId(testId);
    }

    // ================= SAVE =================
    public List<Part5> saveAllWithTest(List<Part5> list, Long testId) {

        System.out.println("========== START SAVE PART5 ==========");

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("List rỗng!");
        }

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        // 🔥 xoá dữ liệu cũ
        repo.deleteByTestId(testId);
        System.out.println("🗑️ DELETED OLD DATA");

        list.forEach(p -> {

            p.setTest(test);

            if (p.getLabel() == null) {
                p.setLabel("unknown");
            }

        });

        List<Part5> saved = repo.saveAll(list);

        System.out.println("✅ SAVED SIZE: " + saved.size());
        System.out.println("========== END SAVE ==========");

        return saved;
    }

    // ================= PRACTICE =================
    public List<Part5> getRandomQuestions(
            String label,
            int limit) {

        return repo.getRandomQuestions(
                label,
                PageRequest.of(0, limit));
    }

}