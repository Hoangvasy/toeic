package com.toeic.backend.service;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.Part7Repo;
import com.toeic.backend.repository.PracticeAnswerRepo;
import com.toeic.backend.repository.PracticeSessionRepo;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PracticeService {

    // repository truy cập database
    private final Part5Repo part5Repo;
    private final PracticeSessionRepo sessionRepo;
    private final PracticeAnswerRepo answerRepo;

    // constructor inject dependency
    public PracticeService(
            PracticeSessionRepo sessionRepo,
            PracticeAnswerRepo answerRepo,
            Part5Repo part5Repo,
            Part7Repo part7Repo) {

        this.sessionRepo = sessionRepo;
        this.answerRepo = answerRepo;
        this.part5Repo = part5Repo;
    }

    // tạo session luyện tập mới
    public PracticeSession startSession(
            Long userId,
            Integer part,
            String topic,
            Integer questionCount) {

        PracticeSession session = new PracticeSession();

        session.setUserId(userId);
        session.setPart(part);
        session.setTopic(topic);
        session.setTotalQuestions(questionCount);
        session.setCorrectAnswers(0);
        session.setStartTime(LocalDateTime.now());

        return sessionRepo.save(session);
    }

    // lưu câu trả lời của người dùng
    public PracticeAnswer submitAnswer(
            Long sessionId,
            Long questionId,
            String userAnswer,
            String correctAnswer,
            Integer timeSpent) {

        PracticeAnswer answer = new PracticeAnswer();

        answer.setSessionId(sessionId);
        answer.setQuestionId(questionId);
        answer.setUserAnswer(userAnswer);
        answer.setCorrectAnswer(correctAnswer);

        // kiểm tra đúng/sai
        boolean isCorrect = correctAnswer != null &&
                correctAnswer.equals(userAnswer);

        answer.setIsCorrect(isCorrect);
        answer.setTimeSpent(timeSpent);

        return answerRepo.save(answer);
    }

    // kết thúc session
    public PracticeSession endSession(
            Long sessionId,
            Integer correctAnswers) {

        PracticeSession session = sessionRepo
                .findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Practice session not found"));

        session.setCorrectAnswers(correctAnswers);
        session.setEndTime(LocalDateTime.now());

        return sessionRepo.save(session);
    }

    // lấy danh sách câu hỏi part 5 ngẫu nhiên
    public List<Part5> getRandomPart5Questions(
            String label,
            int limit) {

        return part5Repo.getRandomQuestions(
                label,
                PageRequest.of(0, limit));
    }
}