package com.toeic.backend.Controller;

import com.toeic.backend.Entity.Part6;
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

    @PostMapping("/save")
    public List<Part6> save(
            @RequestBody List<Part6> list,
            @RequestParam Long testId
    ) {
        return service.saveAllWithTest(list, testId);
    }
}