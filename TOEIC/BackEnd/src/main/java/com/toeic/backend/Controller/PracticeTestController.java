
package com.toeic.backend.controller;

import com.toeic.backend.entity.ToeicTest;
import com.toeic.backend.service.PracticeTestService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/practice-tests")
@CrossOrigin(origins = "http://localhost:5173")
public class PracticeTestController {

    private final PracticeTestService service;

    public PracticeTestController(
            PracticeTestService service
    ) {
        this.service = service;
    }

    // ================= GET ALL TESTS =================
    @GetMapping
    public List<ToeicTest> getAllTests() {
        return service.getAllTests();
    }

    // ================= GET TEST DETAIL =================
    @GetMapping("/{id}")
    public ToeicTest getTestById(
            @PathVariable Long id
    ) {
        return service.getTestById(id);
    }

    // ================= CREATE TEST =================
    @PostMapping
    public ToeicTest createTest(
            @RequestBody ToeicTest test
    ) {
        return service.createTest(test);
    }

    // ================= DELETE TEST =================
    @DeleteMapping("/{id}")
    public void deleteTest(
            @PathVariable Long id
    ) {
        service.deleteTest(id);
    }
}
