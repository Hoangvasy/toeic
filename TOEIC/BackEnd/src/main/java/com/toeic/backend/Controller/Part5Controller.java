package com.toeic.backend.controller;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.service.Part5Service;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part5")
@CrossOrigin
public class Part5Controller {

    private final Part5Service service;

    public Part5Controller(Part5Service service) {
        this.service = service;
    }

    // ✅ SAVE
    @PostMapping("/save")
    public List<Part5> save(
            @RequestBody List<Part5> list,
            @RequestParam Long testId) {
        return service.saveAllWithTest(list, testId);
    }

    // ✅ GET DATA FROM DB
    @GetMapping
    public List<Part5> getByTestId(@RequestParam Long testId) {
        return service.getByTestId(testId);
    }
}