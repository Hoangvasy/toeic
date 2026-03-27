package com.toeic.backend.service;

import com.toeic.backend.Entity.ToeicTest;
import com.toeic.backend.Repository.*;
import org.springframework.stereotype.Service;

@Service
public class ToeicTestService {

    private final ToeicTestRepo testRepo;
    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7Repo part7Repo;

    public ToeicTestService(
            ToeicTestRepo testRepo,
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7Repo part7Repo) {
        this.testRepo = testRepo;
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7Repo = part7Repo;
    }

    public ToeicTest createTest(ToeicTest test) {
        test.setStatus("DRAFT");
        return testRepo.save(test);
    }

    public void updateStatus(Long testId) {

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        boolean has5 = part5Repo.existsByTestId(testId);
        boolean has6 = part6Repo.existsByTestId(testId);
        boolean has7 = part7Repo.existsByTestId(testId);

        if (has5 && has6 && has7) {
            test.setStatus("READY");
            testRepo.save(test);
        }
    }
}