package com.toeic.backend.service.learningengine;

import com.toeic.backend.entity.*;
import com.toeic.backend.repository.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class LearningEngineService {

    private final UserSkillAbilityRepo abilityRepo;
    private final UserQuestionStateRepo stateRepo;
    private final HttpSession session;

    public LearningEngineService(
            UserSkillAbilityRepo abilityRepo,
            UserQuestionStateRepo stateRepo,
            HttpSession session) {
        this.abilityRepo = abilityRepo;
        this.stateRepo = stateRepo;
        this.session = session;
    }

    // ================= USER =================
    private User getCurrentUser() {
        User user = (User) session.getAttribute("user");
        if (user == null)
            throw new RuntimeException("NOT LOGGED IN");
        return user;
    }

    // ================= MAIN ENGINE =================
    public List<Map<String, Object>> buildLearningPlan() {

        User user = getCurrentUser();

        List<Map<String, Object>> plan = new ArrayList<>();

        plan.addAll(buildReviewPriority(user));
        plan.addAll(buildWeakSkillPriority(user));
        plan.addAll(buildMasteryGapPriority(user));

        // sort toàn bộ theo priority
        return plan.stream()
                .sorted((a, b) -> Double.compare(
                        (Double) b.get("priority"),
                        (Double) a.get("priority")))
                .limit(30) // giới hạn plan mỗi ngày
                .collect(Collectors.toList());
    }

    // ================= 1. REVIEW PRIORITY (SRS) =================
    private List<Map<String, Object>> buildReviewPriority(User user) {

        return stateRepo.findByUserId(user.getId())
                .stream()
                .filter(s -> s.getNextReview() != null)
                .filter(s -> !s.getNextReview().isAfter(LocalDateTime.now()))
                .map(s -> {

                    Map<String, Object> m = new HashMap<>();

                    double priority = computeReviewScore(s);

                    m.put("type", "review");
                    m.put("questionId", s.getQuestionId());
                    m.put("priority", priority);

                    return m;
                })
                .collect(Collectors.toList());
    }

    // ================= 2. WEAK SKILL PRIORITY =================
    private List<Map<String, Object>> buildWeakSkillPriority(User user) {

        return abilityRepo.findByUserId(user.getId())
                .stream()
                .filter(a -> a.getSkill() != null)
                .map(a -> {

                    Map<String, Object> m = new HashMap<>();

                    double ability = a.getAbility() != null ? a.getAbility() : 0.5;

                    double priority = (1 - ability) * 0.6 +
                            forgettingBonus(a) * 0.3 +
                            (1.0 / (a.getStreak() + 1)) * 0.1;

                    m.put("type", "skill");
                    m.put("skill", a.getSkill());
                    m.put("priority", priority);

                    return m;
                })
                .collect(Collectors.toList());
    }

    // ================= 3. MASTERY GAP PRIORITY =================
    private List<Map<String, Object>> buildMasteryGapPriority(User user) {

        return stateRepo.findByUserId(user.getId())
                .stream()
                .map(s -> {

                    Map<String, Object> m = new HashMap<>();

                    double accuracy = s.getTotalAttempts() == 0
                            ? 0
                            : (double) s.getCorrectCount() / s.getTotalAttempts();

                    double masteryPenalty = 1.0 / (s.getMasteryLevel() + 1);

                    double priority = (1 - accuracy) * 0.5 +
                            masteryPenalty * 0.3 +
                            forgettingBonusState(s) * 0.2;

                    m.put("type", "mastery_gap");
                    m.put("questionId", s.getQuestionId());
                    m.put("priority", priority);

                    return m;
                })
                .collect(Collectors.toList());
    }

    // ================= SCORE FUNCTIONS =================

    private double computeReviewScore(UserQuestionState s) {

        double accuracy = s.getTotalAttempts() == 0
                ? 0
                : (double) s.getCorrectCount() / s.getTotalAttempts();

        double days = s.getLastSeen() == null
                ? 0
                : Duration.between(s.getLastSeen(), LocalDateTime.now()).toDays();

        double forgetting = 1 - Math.exp(-days / 3.0);

        return (1 - accuracy) * 0.4
                + forgetting * 0.4
                + (1.0 / (s.getMasteryLevel() + 1)) * 0.2;
    }

    private double forgettingBonus(UserSkillAbility a) {

        if (a.getLastSeenAt() == null)
            return 0.5;

        long days = Duration.between(a.getLastSeenAt(), LocalDateTime.now()).toDays();

        return 1 - Math.exp(-days / 5.0);
    }

    private double forgettingBonusState(UserQuestionState s) {

        if (s.getLastSeen() == null)
            return 0.5;

        long days = Duration.between(s.getLastSeen(), LocalDateTime.now()).toDays();

        return 1 - Math.exp(-days / 3.0);
    }
}