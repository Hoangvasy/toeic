package com.toeic.backend.controller;

import com.toeic.backend.entity.ExamAnswer;
import com.toeic.backend.entity.ExamSession;
import com.toeic.backend.service.ExamService;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exam")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;

    public ExamController(
            ExamService examService
    ) {
        this.examService = examService;
    }

    // ================= START EXAM =================
    @PostMapping("/start")
public ExamSession startExam(
        @RequestBody Map<String, Object> body,
        jakarta.servlet.http.HttpSession session
) {

    Long userId = (Long) session.getAttribute("userId");

    if (userId == null) {
        throw new RuntimeException("NOT LOGGED IN");
    }

    Long testId = Long.valueOf(body.get("testId").toString());
    String parts = body.get("parts").toString();
    Integer totalQuestions = Integer.valueOf(body.get("totalQuestions").toString());

    return examService.startExam(
            userId,
            testId,
            parts,
            totalQuestions
    );
}

    // ================= SUBMIT ANSWER =================
    @PostMapping("/answer")
    public ExamAnswer submitAnswer(
            @RequestBody Map<String, Object> body
    ) {

        Long sessionId =
                Long.valueOf(
                        body.get("sessionId")
                                .toString()
                );

        Long questionId =
                Long.valueOf(
                        body.get("questionId")
                                .toString()
                );

        Integer part =
                Integer.valueOf(
                        body.get("part")
                                .toString()
                );

        Integer questionNumber =
                Integer.valueOf(
                        body.get("questionNumber")
                                .toString()
                );

        String userAnswer =
                body.get("userAnswer")
                        .toString();

        String correctAnswer =
                body.get("correctAnswer")
                        .toString();

        Integer timeSpent =
                Integer.valueOf(
                        body.get("timeSpent")
                                .toString()
                );

        return examService.submitAnswer(
                sessionId,
                questionId,
                part,
                questionNumber,
                userAnswer,
                correctAnswer,
                timeSpent
        );
    }

    // ================= FINISH EXAM =================
    // ================= FINISH EXAM =================
@PostMapping("/finish/{sessionId}")
public ExamSession finishExam(
        @PathVariable Long sessionId,
        @RequestBody List<Map<String, Object>> allQuestions
) {

    return examService.finishExam(
            sessionId,
            allQuestions
    );
}

    // ================= HISTORY =================
    @GetMapping("/history/{userId}")
    public List<ExamSession> getHistory(
            @PathVariable Long userId
    ) {

        return examService
                .getUserHistory(userId);
    }

    // ================= REVIEW ANSWERS =================
    @GetMapping("/review/{sessionId}")
public List<Map<String, Object>> getReview(
        @PathVariable Long sessionId
) {

    return examService
            .getAnswers(sessionId);
}

    // ================= UNFINISHED =================
    @GetMapping("/unfinished/{userId}")
    public List<ExamSession> getUnfinished(
            @PathVariable Long userId
    ) {

        return examService
                .getUnfinishedExams(userId);
    }
}