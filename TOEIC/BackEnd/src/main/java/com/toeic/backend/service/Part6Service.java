package com.toeic.backend.service;

import com.toeic.backend.dto.Part6TestDTO;
import com.toeic.backend.entity.Part6;
import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.Part6Repo;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
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

    // ================= GET DATA =================
    public List<Part6> getByTestId(Long testId) {
        return repo.findByTestId(testId);
    }

    // ================= SAVE =================
    public List<Part6> saveAllWithTest(List<Part6> list, Long testId) {

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("Part6 list empty");
        }

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test not found: " + testId));

        list.forEach(p -> {

            if (p.getQuestionNumber() == null) {
                throw new RuntimeException("Question number missing");
            }

            if (p.getExplanation() == null || p.getExplanation().trim().isEmpty()) {
                p.setExplanation("No explanation");
            }

            if (p.getAnswer() == null || p.getAnswer().isEmpty()) {
                throw new RuntimeException(
                        "Answer missing for question " + p.getQuestionNumber());
            }

            p.setTest(test);
        });

        // delete old data
        repo.deleteByTestId(testId);

        List<Part6> saved = repo.saveAll(list);

        // update test status
        testService.updateStatus(testId);

        return saved;
    }

    // ================= DELETE =================
    public void deleteByTestId(Long testId) {
        repo.deleteByTestId(testId);
    }

    // ================= PRACTICE =================

    public List<Part6TestDTO> getPart6Tests() {

        List<Object[]> rows = repo.getAvailablePart6Tests();

        List<Part6TestDTO> result = new ArrayList<>();

        for (Object[] r : rows) {

            Long id = (Long) r[0];
            String title = (String) r[1];

            result.add(new Part6TestDTO(id, title));
        }

        return result;
    }

    public List<Part6> getQuestionsByTest(Long testId) {

        return repo.findByTestId(testId);
    }
}