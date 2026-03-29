package com.toeic.backend.service;

import com.toeic.backend.entity.Part6;
import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.Part6Repo;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Part6Service {

    private final Part6Repo repo;
    private final ToeicTestRepo testRepo;
    private final ToeicTestService testService;

    public Part6Service(
            Part6Repo repo,
            ToeicTestRepo testRepo,
            ToeicTestService testService) {
        this.repo = repo;
        this.testRepo = testRepo;
        this.testService = testService;
    }

    // ✅ GET DATA
    public List<Part6> getByTestId(Long testId) {
        return repo.findByTestId(testId);
    }

    // ✅ SAVE
    public List<Part6> saveAllWithTest(List<Part6> list, Long testId) {

        System.out.println("====== SAVE PART6 ======");

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("List rỗng!");
        }

        System.out.println("👉 SIZE: " + list.size());

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        System.out.println("👉 TEST ID: " + test.getId());

        // 🔥 XÓA DATA CŨ
        repo.deleteByTestId(testId);
        System.out.println("🗑️ Deleted old data");

        // 🔥 SET TEST
        list.forEach(p -> p.setTest(test));

        // 🔥 SAVE
        List<Part6> saved = repo.saveAll(list);

        System.out.println("✅ SAVED: " + saved.size());

        // 🔥 UPDATE STATUS TEST
        testService.updateStatus(testId);

        System.out.println("====== DONE ======");

        return saved;
    }

    // ✅ DELETE
    public void deleteByTestId(Long testId) {
        repo.deleteByTestId(testId);
    }
}