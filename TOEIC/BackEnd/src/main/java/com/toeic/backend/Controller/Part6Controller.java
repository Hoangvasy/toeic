package com.toeic.backend.controller;

import com.toeic.backend.entity.Part6;
import com.toeic.backend.service.Part6Service;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part6")
@CrossOrigin
public class Part6Controller {

    private final Part6Service service;

    public Part6Controller(Part6Service service) {
        this.service = service;
    }

    // ✅ SAVE
    @PostMapping("/save")
    public List<Part6> save(
            @RequestBody List<Part6> list,
            @RequestParam Long testId) {
        return service.saveAllWithTest(list, testId);
    }

    // ✅ GET (🔥 CÁI BẠN THIẾU)
    @GetMapping
    public List<Part6> getByTestId(@RequestParam Long testId) {
        return service.getByTestId(testId);
    }

    // ✅ DELETE (bonus - rất hữu ích)
    @DeleteMapping
    public void deleteByTestId(@RequestParam Long testId) {
        service.deleteByTestId(testId);
    }
}