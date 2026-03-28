package com.toeic.backend.service;

import com.toeic.backend.Entity.Part5;
import com.toeic.backend.Entity.ToeicTest;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.ToeicTestRepo;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class Part5Service {

    private final Part5Repo repo;
    private final ToeicTestRepo testRepo;
    private final ToeicTestService testService;

    public Part5Service(Part5Repo repo, ToeicTestRepo testRepo, ToeicTestService testService) {
        this.repo = repo;
        this.testRepo = testRepo;
        this.testService = testService;
    }

    public List<Part5> saveAllWithTest(List<Part5> list, Long testId) {

        System.out.println("========== START SAVE PART5 ==========");

        if (list == null || list.isEmpty()) {
            throw new RuntimeException("List rỗng!");
        }

        System.out.println("👉 LIST SIZE: " + list.size());

        // 🔥 LOG label để debug
        list.forEach(p -> {
            System.out.println("QUESTION: " + p.getQuestion());
            System.out.println("👉 LABEL NHẬN ĐƯỢC: " + p.getLabel());
        });

        ToeicTest test = testRepo.findById(testId)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        System.out.println("👉 TEST ID: " + test.getId());

        // 🔥 xoá dữ liệu cũ
        repo.deleteByTestId(testId);
        System.out.println("🗑️ DELETED OLD DATA");

        // 🔥 set test + fix label null
        list.forEach(p -> {
            p.setTest(test);

            // 🔥 FIX: nếu label null thì set tạm
            if (p.getLabel() == null) {
                System.out.println("⚠️ LABEL NULL → SET DEFAULT");
                p.setLabel("unknown");
            }
        });

        // 🔥 lưu
        List<Part5> saved = repo.saveAll(list);

        System.out.println("✅ SAVED SIZE: " + saved.size());

        saved.forEach(p -> {
            System.out.println("✔ ID: " + p.getId());
            System.out.println("✔ LABEL SAU SAVE: " + p.getLabel());
        });

        System.out.println("========== END SAVE ==========");

        return saved;
    }
}