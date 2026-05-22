
package com.toeic.backend.service;

import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PracticeTestService {

    private final ToeicTestRepo repo;

    public PracticeTestService(
            ToeicTestRepo repo
    ) {
        this.repo = repo;
    }

    // ================= GET ALL =================
    public List<ToeicTest> getAllTests() {
        return repo.findAll();
    }

    // ================= GET BY ID =================
    public ToeicTest getTestById(Long id) {

        return repo.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Test not found"
                        ));
    }

    // ================= CREATE =================
    public ToeicTest createTest(
            ToeicTest test
    ) {
        return repo.save(test);
    }

    // ================= DELETE =================
    public void deleteTest(Long id) {
        repo.deleteById(id);
    }
}
