package com.toeic.backend.Controller;

import com.toeic.backend.Entity.ToeicTest;
import com.toeic.backend.Repository.ToeicTestRepo;
import com.toeic.backend.Repository.Part5Repo;
import com.toeic.backend.Repository.Part6Repo;
import com.toeic.backend.Repository.Part7Repo;
import com.toeic.backend.service.ToeicTestService;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/tests")
@CrossOrigin
public class ToeicTestController {

    private final ToeicTestService service;
    private final ToeicTestRepo testRepo;
    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7Repo part7Repo;

    public ToeicTestController(
            ToeicTestService service,
            ToeicTestRepo testRepo,
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7Repo part7Repo) {
        this.service = service;
        this.testRepo = testRepo;
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7Repo = part7Repo;
    }

    // 🔥 tạo đề
    @PostMapping
    public ToeicTest create(@RequestBody ToeicTest test) {
        return service.createTest(test);
    }

    // 🔥 lấy danh sách đề
    @GetMapping
    public List<ToeicTest> getAll() {
        return testRepo.findAll();
    }

    // 🔥 lấy full đề (chỉ khi READY)
    @GetMapping("/{id}")
    public ResponseEntity<?> getFull(@PathVariable Long id) {

        ToeicTest test = testRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Test không tồn tại"));

        if (!"READY".equals(test.getStatus())) {
            return ResponseEntity.badRequest().body("Đề chưa đủ part");
        }

        return ResponseEntity.ok(Map.of(
                "part5", part5Repo.findByTestId(id),
                "part6", part6Repo.findByTestId(id),
                "part7", part7Repo.findByTestId(id)));
    }
}