package com.toeic.backend.controller;

import org.springframework.web.bind.annotation.*;

import com.toeic.backend.dto.VocabularyDTO;
import com.toeic.backend.service.VocabularyService;

@RestController
@RequestMapping("/api/vocab")
@CrossOrigin
public class VocabularyController {

    private final VocabularyService service;

    public VocabularyController(VocabularyService service) {
        this.service = service;
    }

    @GetMapping("/detail")
    public VocabularyDTO getWordDetail(
            @RequestParam String word) {

        return service.getWordDetail(word);
    }
}