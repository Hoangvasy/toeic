package com.toeic.backend.service;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.Part6;
import com.toeic.backend.entity.Part7Group;
import com.toeic.backend.entity.Part7Question;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.Part6Repo;
import com.toeic.backend.repository.Part7GroupRepo;
import com.toeic.backend.repository.Part7QuestionRepo;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class PracticeExamService {

    private final Part5Repo part5Repo;
    private final Part6Repo part6Repo;
    private final Part7GroupRepo part7GroupRepo;
    private final Part7QuestionRepo part7QuestionRepo;

    public PracticeExamService(
            Part5Repo part5Repo,
            Part6Repo part6Repo,
            Part7GroupRepo part7GroupRepo,
            Part7QuestionRepo part7QuestionRepo
    ) {
        this.part5Repo = part5Repo;
        this.part6Repo = part6Repo;
        this.part7GroupRepo = part7GroupRepo;
        this.part7QuestionRepo = part7QuestionRepo;
    }

    // ================= MAIN =================
    public List<Map<String, Object>> getExam(Long testId, List<Integer> parts) {

        List<Map<String, Object>> result = new ArrayList<>();

        // ================= PART 5 =================
        if (parts.contains(5)) {
            List<Part5> part5List = part5Repo.findByTestId(testId);

            for (Part5 q : part5List) {
                Map<String, Object> obj = new HashMap<>();
                obj.put("type", "part5");
                obj.put("id", q.getId());
                obj.put("questionNumber", q.getQuestionNumber());
                obj.put("question", q.getQuestion());
                obj.put("optionA", q.getOptionA());
                obj.put("optionB", q.getOptionB());
                obj.put("optionC", q.getOptionC());
                obj.put("optionD", q.getOptionD());
                obj.put("answer", q.getAnswer());
obj.put("label", q.getLabel());
obj.put("difficulty", q.getDifficulty());

                result.add(obj);
            }
        }

        // ================= PART 6 =================
     // ================= PART 6 =================
if (parts.contains(6)) {

    List<Part6> part6List = part6Repo.findByTestId(testId);

    // group theo groupId
    Map<Integer, List<Part6>> grouped = new HashMap<>();

    for (Part6 q : part6List) {
        grouped
            .computeIfAbsent(q.getGroupId(), k -> new ArrayList<>())
            .add(q);
    }

    for (Map.Entry<Integer, List<Part6>> entry : grouped.entrySet()) {

        List<Part6> questions = entry.getValue();
        Part6 first = questions.get(0); // lấy passage chung

        Map<String, Object> groupObj = new HashMap<>();
        groupObj.put("type", "part6");
        groupObj.put("groupId", entry.getKey());
        groupObj.put("passage", first.getPassage());
        groupObj.put("questions", questions);

        result.add(groupObj);
    }
}

        // ================= PART 7 =================
// ================= PART 7 =================
if (parts.contains(7)) {

    List<Part7Group> groups =
            part7GroupRepo.findByTestIdOrderByIdAsc(testId);

    for (Part7Group group : groups) {

        List<Part7Question> questions =
                part7QuestionRepo.findByGroupId(group.getId());

        Map<String, Object> groupObj = new HashMap<>();
        groupObj.put("type", "part7");
        groupObj.put("id", group.getId());
        groupObj.put("passage", group.getPassage());
        groupObj.put("header", group.getHeader());
        groupObj.put("questions", questions);

        result.add(groupObj);
    }
}

        return result;
    }
}