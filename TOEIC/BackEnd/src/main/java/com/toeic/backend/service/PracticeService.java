package com.toeic.backend.service;

import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.PracticeAnswer;
import com.toeic.backend.entity.PracticeSession;
import com.toeic.backend.entity.StudySession;
import com.toeic.backend.entity.User;

import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.PracticeAnswerRepo;
import com.toeic.backend.repository.PracticeSessionRepo;
import com.toeic.backend.repository.StudySessionRepo;
import com.toeic.backend.repository.UserRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;

import java.util.List;

@Service
public class PracticeService {

        private final Part5Repo part5Repo;

        private final PracticeSessionRepo sessionRepo;

        private final PracticeAnswerRepo answerRepo;

        private final UserRepository userRepo;

        private final StudySessionRepo studySessionRepo;

        private final UserService userService;

        public PracticeService(

                        PracticeSessionRepo sessionRepo,

                        PracticeAnswerRepo answerRepo,

                        Part5Repo part5Repo,

                        UserRepository userRepo,

                        StudySessionRepo studySessionRepo,

                        UserService userService) {

                this.sessionRepo = sessionRepo;

                this.answerRepo = answerRepo;

                this.part5Repo = part5Repo;

                this.userRepo = userRepo;

                this.studySessionRepo = studySessionRepo;

                this.userService = userService;
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

                session.setTotalQuestions(
                                questionCount);

                session.setCorrectAnswers(0);

                session.setStartTime(
                                LocalDateTime.now());

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

                answer.setCorrectAnswer(
                                correctAnswer);

                boolean isCorrect = correctAnswer != null
                                && correctAnswer.equals(
                                                userAnswer);

                answer.setIsCorrect(isCorrect);

                answer.setTimeSpent(timeSpent);

                return answerRepo.save(answer);
        }

        public PracticeSession endSession(

                        Long sessionId,

                        Integer correctAnswers,

                        Integer durationSeconds,

                        Integer answeredQuestions) {

                PracticeSession session = sessionRepo.findById(
                                sessionId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "Practice session not found"));

                session.setCorrectAnswers(
                                correctAnswers);

                session.setEndTime(
                                LocalDateTime.now());

                sessionRepo.save(session);

                StudySession study = new StudySession();

                study.setUserId(
                                session.getUserId());

                study.setDate(
                                LocalDate.now());

                study.setType(

                                "PRACTICE_PART"

                                                + session.getPart()

                                                + "_"

                                                + session.getTopic()
                                                                .toUpperCase());

                study.setDuration(
                                durationSeconds);

                studySessionRepo.save(
                                study);

                // chống farm streak
                if (durationSeconds >= 120 || answeredQuestions >= 5) {

                        User user = userRepo.findById(session.getUserId()).orElseThrow();

                        userService.updateStreak(user);
                }

                return session;
        }

        public List<Part5> getRandomPart5Questions(

                        String label,

                        int limit) {

                return part5Repo.getRandomQuestions(

                                label,

                                PageRequest.of(0, limit));
        }
}