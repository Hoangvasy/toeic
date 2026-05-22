package com.toeic.backend.controller;

import com.toeic.backend.entity.Part7Group;
import com.toeic.backend.service.Part7Service;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part7")
@CrossOrigin
public class Part7Controller {

    private final Part7Service service;

    public Part7Controller(Part7Service service) {
        this.service = service;
    }

    // ✅ SAVE FULL GROUP + QUESTIONS
    @PostMapping("/save")
    public List<Part7Group> save(
            @RequestBody List<Part7Group> groups,
            @RequestParam Long testId) {

        return service.saveAll(groups, testId);
    }

    // ✅ GET BY TEST
    @GetMapping
    public List<Part7Group> get(@RequestParam Long testId) {
        return service.getByTestId(testId);
    }

    // ✅ DELETE ALL BY TEST
    @DeleteMapping
    public void delete(@RequestParam Long testId) {
        service.deleteByTestId(testId);
    }
}