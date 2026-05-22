package com.toeic.backend.service;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.repository.Part5Repo;

@Service
public class Part5PracticeService {

    private final Part5Repo part5Repo;

    public Part5PracticeService(Part5Repo part5Repo) {
        this.part5Repo = part5Repo;
    }

    public List<Part5> getRandomQuestions(
            String label,
            int limit) {

        return part5Repo.getRandomQuestions(
                label,
                PageRequest.of(0, limit));
    }
}