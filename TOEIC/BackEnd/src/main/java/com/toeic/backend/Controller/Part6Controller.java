package com.toeic.backend.controller;

import com.toeic.backend.entity.Part6;
import com.toeic.backend.service.Part6Service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/part6")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class Part6Controller {

    private final Part6Service service;

    public Part6Controller(Part6Service service) {
        this.service = service;
    }

    // SAVE
    @PostMapping("/save")
    public ResponseEntity<?> save(
            @RequestBody List<Part6> list,
            @RequestParam Long testId) {

        List<Part6> saved = service.saveAllWithTest(list, testId);
        return ResponseEntity.ok(saved);
    }

    // GET
    @GetMapping
    public ResponseEntity<List<Part6>> getByTestId(@RequestParam Long testId) {
        return ResponseEntity.ok(service.getByTestId(testId));
    }

    // DELETE
    @DeleteMapping
    public ResponseEntity<?> deleteByTestId(@RequestParam Long testId) {
        service.deleteByTestId(testId);
        return ResponseEntity.ok("Deleted");
    }
}