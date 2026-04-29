package com.toeic.backend.service;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.repository.PracticeSessionRepo;
import com.toeic.backend.repository.PracticeAnswerRepo;

@Service
public class PracticeSessionService {

    private final PracticeSessionRepo sessionRepo;
    private final PracticeAnswerRepo answerRepo;

    public PracticeSessionService(
            PracticeSessionRepo sessionRepo,
            PracticeAnswerRepo answerRepo) {

        this.sessionRepo = sessionRepo;
        this.answerRepo = answerRepo;
    }

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

        boolean isCorrect = correctAnswer != null &&
                correctAnswer.equals(userAnswer);

        answer.setIsCorrect(isCorrect);
        answer.setTimeSpent(timeSpent);

        return answerRepo.save(answer);
    }

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
}