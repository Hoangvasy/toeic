package com.toeic.backend.service;

import com.toeic.backend.entity.*;
import com.toeic.backend.repository.*;
import com.toeic.backend.service.learningengine.updater.AbilityUpdater;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class AttemptService {

    private final UserAttemptRepo userAttemptRepo;
    private final AttemptDetailRepo attemptDetailRepo;
    private final UserQuestionStateRepo stateRepo;
    private final AbilityUpdater abilityUpdater;
    private final UserRepository userRepository;
    private final HttpSession session;
    private final Part5Repo part5Repo;

    public AttemptService(
            UserAttemptRepo userAttemptRepo,
            AttemptDetailRepo attemptDetailRepo,
            UserQuestionStateRepo stateRepo,
            AbilityUpdater abilityUpdater,
            UserRepository userRepository,
            HttpSession session,
            Part5Repo part5Repo
    ) {
        this.userAttemptRepo = userAttemptRepo;
        this.attemptDetailRepo = attemptDetailRepo;
        this.stateRepo = stateRepo;
        this.abilityUpdater = abilityUpdater;
        this.userRepository = userRepository;
        this.session = session;
        this.part5Repo = part5Repo;
    }

    // ================= USER =================
    private User getCurrentUser() {
        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            throw new RuntimeException("NOT LOGGED IN (NO USERID)");
        }

        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("USER NOT FOUND"));
    }

    // ================= MAIN =================
    @Transactional
public void saveAttempt(Map<String, Object> body) {

    User user = getCurrentUser();

    Integer score = ((Number) body.get("score")).intValue();
    Integer total = ((Number) body.get("total")).intValue();
    Integer correct = ((Number) body.get("correct")).intValue();

    Map<String, String> answers = (Map<String, String>) body.get("answers");
    List<Map<String, Object>> questions = (List<Map<String, Object>>) body.get("questions");

    // ================= SAVE ATTEMPT =================
    UserAttempt attempt = new UserAttempt();
    attempt.setUser(user);
    attempt.setScore(score);
    attempt.setTotalQuestions(total);
    attempt.setCorrectAnswers(correct);
    attempt = userAttemptRepo.save(attempt);

    // ================= BUILD DETAILS (FULL ALL QUESTIONS) =================
    List<AttemptDetail> details = new ArrayList<>();

    for (int i = 0; i < questions.size(); i++) {

        Map<String, Object> q = questions.get(i);
        String type = (String) q.get("type");

        if ("part5".equals(type)) {

            Long qId = ((Number) q.get("id")).longValue();
            String qIdStr = String.valueOf(qId);

            String userAns = answers.get(qIdStr); // null nếu không làm

            details.add(buildDetail(attempt, q, userAns, "part5"));
        }

        else if ("part6".equals(type) || "part7".equals(type)) {

            List<Map<String, Object>> subs =
                    (List<Map<String, Object>>) q.get("questions");

            for (int j = 0; j < subs.size(); j++) {

                Map<String, Object> subQ = subs.get(j);
                String key = i + "-" + j;

                String userAns = answers.get(key); // null nếu bỏ trống

                details.add(buildDetail(attempt, subQ, userAns, type));
            }
        }
    }

    // ================= SAVE =================
    if (!details.isEmpty()) {

        attemptDetailRepo.saveAll(details);

        updateUserQuestionState(user.getId(), details);
        abilityUpdater.update(user.getId(), details);
        updateQuestionDifficulty(details);
    }
}

    // ================= DETAIL =================
    private AttemptDetail buildDetail(
            UserAttempt attempt,
            Map<String, Object> q,
            String userAns,
            String type
    ) {

        AttemptDetail d = new AttemptDetail();

        d.setAttempt(attempt);
        d.setQuestionId(((Number) q.get("id")).longValue());
        d.setUserAnswer(userAns);

        String correctAnswer = (String) q.get("answer");
        d.setCorrectAnswer(correctAnswer);
        d.setIsCorrect(isCorrect(userAns, correctAnswer));
        d.setQuestionType(type);
        d.setLabel((String) q.get("label"));

        return d;
    }

    // ================= SRS =================
    private void updateUserQuestionState(
            Long userId,
            List<AttemptDetail> details
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow();

        for (AttemptDetail d : details) {

            UserQuestionState state = stateRepo
                    .findByUserIdAndQuestionId(userId, d.getQuestionId())
                    .orElseGet(() -> {
                        UserQuestionState s = new UserQuestionState();
                        s.setUser(user);
                        s.setQuestionId(d.getQuestionId());
                        s.setTotalAttempts(0);
                        s.setCorrectCount(0);
                        s.setWrongCount(0);
                        s.setStreak(0);
                        s.setMasteryLevel(0);
                        s.setEaseFactor(2.5f);
                        s.setReviewInterval(1);
                        return s;
                    });

            boolean correct = Boolean.TRUE.equals(d.getIsCorrect());

            // total attempts
            state.setTotalAttempts(state.getTotalAttempts() + 1);

            // correct / wrong
            if (correct) {
                state.setCorrectCount(state.getCorrectCount() + 1);
                state.setStreak(state.getStreak() + 1);
            } else {
                state.setWrongCount(state.getWrongCount() + 1);
                state.setStreak(0);
            }

            // mastery level (0-10)
            int mastery = state.getMasteryLevel();
            state.setMasteryLevel(correct ? Math.min(10, mastery + 1) : Math.max(0, mastery - 1));

            // SM-2 algorithm
            float ease = state.getEaseFactor();
            int interval = state.getReviewInterval();

            if (correct) {
                ease = Math.max(1.3f, ease + 0.1f);
                interval = (int) Math.ceil(interval * ease);
            } else {
                ease = Math.max(1.3f, ease - 0.2f);
                interval = 1;
            }

            state.setEaseFactor(ease);
            state.setReviewInterval(interval);

            LocalDateTime now = LocalDateTime.now();
            state.setLastSeen(now);
            state.setNextReview(now.plusDays(interval));
            state.setLastResult(correct);

            stateRepo.save(state);
        }
    }

    // ================= QUESTION DIFFICULTY (chỉ Part5) =================
    private void updateQuestionDifficulty(List<AttemptDetail> details) {

        for (AttemptDetail d : details) {

            // chỉ Part5 mới update difficulty
            if (!"part5".equals(d.getQuestionType())) {
                continue;
            }

            Part5 question = part5Repo.findById(d.getQuestionId()).orElse(null);
            if (question == null) {
                continue;
            }

            float difficulty = question.getDifficulty() == null ? 0.5f : question.getDifficulty();
            boolean correct = Boolean.TRUE.equals(d.getIsCorrect());

            // đúng → dễ hơn (giảm difficulty), sai → khó hơn (tăng difficulty)
            float delta = correct ? -0.03f : 0.05f;
            float newDifficulty = clamp(difficulty + delta);

            question.setDifficulty(newDifficulty);
            part5Repo.save(question);

            System.out.println("Updated difficulty Q" + question.getId() + ": " + difficulty + " -> " + newDifficulty);
        }
    }

    // ================= HELPER =================
    private boolean isCorrect(String userAns, String correctAns) {
        if (userAns == null || userAns.trim().isEmpty()) {
            return false;
        }
        return correctAns != null && correctAns.equalsIgnoreCase(userAns.trim());
    }

    private float clamp(float value) {
        return Math.max(0f, Math.min(1f, value));
    }
}