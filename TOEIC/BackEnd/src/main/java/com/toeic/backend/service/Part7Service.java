package com.toeic.backend.service;

import com.toeic.backend.entity.Part7;
import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.Part7Repo;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class Part7Service {

    private final Part7Repo repo;
    private final ToeicTestRepo testRepo;
    private final ToeicTestService testService;

    public Part7Service(
            Part7Repo repo,
            ToeicTestRepo testRepo,
            ToeicTestService testService) {
        this.repo = repo;
        this.testRepo = testRepo;
        this.testService = testService;
    }

    // ✅ GET DATA theo testId
    public List<Part7> getByTestId(Long testId) {
        return repo.findByTestId(testId);
    }

    // ✅ SAVE / UPLOAD
    public List<Part7> saveAllWithTest(List<Part7> list, Long testId) {

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("List rỗng!");
        }

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        // 🔥 XÓA DATA CŨ
        repo.deleteByTestId(testId);

        // 🔥 SET TEST
        list.forEach(p -> p.setTest(test));

        // 🔥 SAVE
        List<Part7> saved = repo.saveAll(list);

        // 🔥 UPDATE STATUS TEST
        testService.updateStatus(testId);

        return saved;
    }

    // ✅ DELETE DATA theo testId
    public void deleteByTestId(Long testId) {
        repo.deleteByTestId(testId);
    }
}