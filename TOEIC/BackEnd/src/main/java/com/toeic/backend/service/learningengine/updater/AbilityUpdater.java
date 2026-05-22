package com.toeic.backend.service.learningengine.updater;

import com.toeic.backend.entity.AttemptDetail;
import com.toeic.backend.entity.User;
import com.toeic.backend.entity.UserSkillAbility;
import com.toeic.backend.repository.UserRepository;
import com.toeic.backend.repository.UserSkillAbilityRepo;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Component
public class AbilityUpdater {

    private final UserSkillAbilityRepo abilityRepo;
    private final UserRepository userRepo;

    public AbilityUpdater(
            UserSkillAbilityRepo abilityRepo,
            UserRepository userRepo
    ) {
        this.abilityRepo = abilityRepo;
        this.userRepo = userRepo;
    }

    public void update(Long userId, List<AttemptDetail> details) {

        User user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // load all ability của user
        Map<String, UserSkillAbility> abilityMap =
                abilityRepo.findByUserId(userId)
                        .stream()
                        .collect(Collectors.toMap(
                                UserSkillAbility::getSkill,
                                a -> a
                        ));

        for (AttemptDetail d : details) {

            String skill = normalizeSkill(d.getLabel());
            boolean correct = Boolean.TRUE.equals(d.getIsCorrect());

            UserSkillAbility ability = abilityMap.get(skill);

            // ================= CREATE NEW =================
            if (ability == null) {
                ability = new UserSkillAbility();
                ability.setUser(user);
                ability.setSkill(skill);
                ability.setAbility(0.5f);
                ability.setTotalAttempts(0);
                ability.setCorrectAttempts(0);
                ability.setStreak(0);
            }

            // ================= UPDATE STATS =================
            ability.setTotalAttempts(
                    ability.getTotalAttempts() + 1
            );

            if (correct) {
                ability.setCorrectAttempts(
                        ability.getCorrectAttempts() + 1
                );

                ability.setStreak(ability.getStreak() + 1);

                // tăng ability (nhẹ)
                ability.setAbility(
                        clamp(ability.getAbility() + 0.03f)
                );

            } else {
                ability.setStreak(0);

                // giảm ability (nặng hơn tăng)
                ability.setAbility(
                        clamp(ability.getAbility() - 0.05f)
                );
            }

            // ================= META =================
            ability.setLastResult(correct);
            ability.setLastSeenAt(LocalDateTime.now());

            // optional: next review logic đơn giản
            int baseDays = correct ? 3 : 1;
            ability.setNextReviewAt(
                    LocalDateTime.now().plusDays(baseDays)
            );

            abilityMap.put(skill, ability);
            abilityRepo.save(ability);
        }
    }

    // ================= NORMALIZE LABEL =================
    private String normalizeSkill(String label) {

        if (label == null) return "general";

        label = label.trim().toLowerCase();

        // tránh unknown
        if (label.isBlank() || label.equals("unknown")) {
            return "general";
        }

        return label;
    }

    // ================= CLAMP =================
    private float clamp(float value) {
        return Math.max(0f, Math.min(1f, value));
    }
}