package com.toeic.backend.service;

import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.*;

import org.springframework.stereotype.Service;

@Service
public class ToeicTestService {

    private final ToeicTestRepo testRepo;
    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7GroupRepo part7GroupRepo;

    public ToeicTestService(
            ToeicTestRepo testRepo,
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7GroupRepo part7GroupRepo) {
        this.testRepo = testRepo;
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7GroupRepo = part7GroupRepo;
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
        boolean has7 = part7GroupRepo.existsByTestId(testId);

        if (has5 && has6 && has7) {
            test.setStatus("READY");
            testRepo.save(test);
        }
    }
}