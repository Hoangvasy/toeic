package com.toeic.backend.controller;

import com.toeic.backend.entity.Part7;
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

    // ✅ SAVE / UPLOAD PART7
    @PostMapping("/save")
    public List<Part7> save(
            @RequestBody List<Part7> list,
            @RequestParam Long testId) {
        return service.saveAllWithTest(list, testId);
    }

    // ✅ GET PART7 theo testId
    @GetMapping
    public List<Part7> getByTestId(@RequestParam Long testId) {
        return service.getByTestId(testId);
    }

    // ✅ DELETE PART7 theo testId (optional, rất hữu ích)
    @DeleteMapping
    public void deleteByTestId(@RequestParam Long testId) {
        service.deleteByTestId(testId);
    }
}