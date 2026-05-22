package com.toeic.backend.service;

import com.toeic.backend.entity.Part7Group;
import com.toeic.backend.entity.Part7Question;
import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.repository.Part7GroupRepo;
import com.toeic.backend.repository.ToeicTestRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;

@Service
public class Part7Service {

    private final Part7GroupRepo groupRepo;
    private final ToeicTestRepo testRepo;

    public Part7Service(
            Part7GroupRepo groupRepo,
            ToeicTestRepo testRepo) {
        this.groupRepo = groupRepo;
        this.testRepo = testRepo;
    }

    // ================= SAVE =================
    @Transactional
    public List<Part7Group> saveAll(List<Part7Group> groups, Long testId) {

        if (groups == null || groups.isEmpty()) {
            throw new RuntimeException("List rỗng!");
        }

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        groupRepo.deleteByTestId(testId);

        for (Part7Group group : groups) {

            group.setTest(test);
            group.setStructureType(detectStructureType(group));

            if (group.getQuestions() != null) {
                for (Part7Question q : group.getQuestions()) {
                    q.setGroup(group);
                }
            }
        }

        return groupRepo.saveAll(groups);
    }

    private String detectStructureType(Part7Group group) {
        if (group.getQuestions() == null || group.getQuestions().isEmpty()) {
            return "SINGLE";
        }

        int min = group.getQuestions().stream()
                .mapToInt(Part7Question::getQuestionNumber)
                .min()
                .orElse(146);

        int max = group.getQuestions().stream()
                .mapToInt(Part7Question::getQuestionNumber)
                .max()
                .orElse(146);

        // 👉 dùng max để tránh lệch
        if (max <= 175)
            return "SINGLE";
        if (max <= 185)
            return "DOUBLE";
        return "TRIPLE";
    }

    // ================= GET =================
    public List<Part7Group> getByTestId(Long testId) {
        return groupRepo.findByTestId(testId);
    }

    // ================= DELETE =================
    public void deleteByTestId(Long testId) {
        groupRepo.deleteByTestId(testId);
    }

    // ================= PRACTICE (FIXED) =================
    public List<Part7Group> getPracticeQuestions(String type) {

        List<Part7Group> allGroups = groupRepo.findAll();

        List<Part7Group> filtered = allGroups.stream()
                .filter(g -> g.getQuestions() != null &&
                        g.getQuestions().stream()
                                .anyMatch(q -> type.equalsIgnoreCase(q.getLabel())))
                .toList();

        if (filtered.isEmpty()) {
            throw new RuntimeException("No questions for type: " + type);
        }

        // random 1 group
        Part7Group random = filtered.get((int) (Math.random() * filtered.size()));

        return List.of(random);
    }

    public Part7Group getRandomByType(String type) {

        List<Part7Group> groups = groupRepo.findByTypeWithQuestions(type);

        if (groups.isEmpty()) {
            return null;
        }

        Random random = new Random();

        return groups.get(
                random.nextInt(groups.size()));
    }
}