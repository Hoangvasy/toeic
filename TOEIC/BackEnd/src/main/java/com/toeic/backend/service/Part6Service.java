package com.toeic.backend.service;

import com.toeic.backend.Entity.Part6;
import com.toeic.backend.Entity.ToeicTest;
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
            ToeicTestService testService
    ) {
        this.repo = repo;
        this.testRepo = testRepo;
        this.testService = testService;
    }

    public List<Part6> saveAllWithTest(List<Part6> list, Long testId) {

        // 🔥 check test tồn tại
        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        // 🔥 tránh duplicate khi upload lại
        repo.deleteByTestId(testId);

        // 🔥 gán test cho từng câu
        list.forEach(p -> p.setTest(test));

        // 🔥 save
        List<Part6> saved = repo.saveAll(list);

        // 🔥 update trạng thái test
        testService.updateStatus(testId);

        return saved;
    }
}