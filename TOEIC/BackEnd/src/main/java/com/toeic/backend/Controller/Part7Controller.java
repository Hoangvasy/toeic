package com.toeic.backend.Controller;

import com.toeic.backend.Entity.Part7;
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

    // 🔥 upload part7
    @PostMapping("/save")
    public List<Part7> save(
            @RequestBody List<Part7> list,
            @RequestParam Long testId
    ) {
        return service.saveAllWithTest(list, testId);
    }
}