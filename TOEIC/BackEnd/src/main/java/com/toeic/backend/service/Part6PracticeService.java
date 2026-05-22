package com.toeic.backend.service;

import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;

import com.toeic.backend.dto.Part6TestDTO;
import com.toeic.backend.entity.Part6;
import com.toeic.backend.repository.Part6Repo;

@Service
public class Part6PracticeService {

    private final Part6Repo part6Repo;

    public Part6PracticeService(Part6Repo part6Repo) {
        this.part6Repo = part6Repo;
    }

    public List<Part6TestDTO> getPart6Tests() {

        List<Object[]> rows = part6Repo.getAvailablePart6Tests();

        List<Part6TestDTO> result = new ArrayList<>();

        for (Object[] r : rows) {
            Long id = (Long) r[0];
            String title = (String) r[1];

            result.add(new Part6TestDTO(id, title));
        }

        return result;
    }

    public List<Part6> getQuestionsByTest(Long testId) {

        return part6Repo.findByTestId(testId);
    }
}