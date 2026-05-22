package com.toeic.backend.service;

import com.toeic.backend.entity.AttemptDetail;
import com.toeic.backend.entity.Part5;
import com.toeic.backend.entity.UserQuestionState;
import com.toeic.backend.entity.UserSkillAbility;
import com.toeic.backend.repository.Part5Repo;
import com.toeic.backend.repository.UserQuestionStateRepo;
import com.toeic.backend.repository.UserSkillAbilityRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class DifficultyUpdateService {

    private final Part5Repo part5Repo;
    private final UserQuestionStateRepo stateRepo;
    private final UserSkillAbilityRepo abilityRepo;

    public DifficultyUpdateService(
            Part5Repo part5Repo,
            UserQuestionStateRepo stateRepo,
            UserSkillAbilityRepo abilityRepo) {
        this.part5Repo = part5Repo;
        this.stateRepo = stateRepo;
        this.abilityRepo = abilityRepo;
    }

    // ================= MAIN =================
    @Transactional
public void updateFromAttempt(Long userId, List<AttemptDetail> details) {

    for (AttemptDetail d : details) {

        if (!"part5".equals(d.getQuestionType()))
            continue;

        Long questionId = d.getQuestionId();

        // ================= CHECK FIRST ATTEMPT =================
        UserQuestionState state = stateRepo
                .findByUserIdAndQuestionId(userId, questionId)
                .orElse(null);

        if (state == null) {
            continue;
        }

        // chỉ update lần đầu
        if (state.getTotalAttempts() != null
        && state.getTotalAttempts() > 1) {
    continue;
}

        part5Repo.findById(questionId).ifPresent(question -> {

            Float current = question.getDifficulty();
            if (current == null) current = 0.5f;

            boolean correct = Boolean.TRUE.equals(d.getIsCorrect());

            // ================= GET ABILITY =================
            float ability = getAbility(userId, d.getLabel());

            // ================= ERROR =================
            float userScore = correct ? 1f : 0f;
            float error = userScore - ability;

            // ================= FILTER NOISE =================
            float weight = Math.abs(error);

            if (weight < 0.3f) return;

            // ================= UPDATE RULE (IRT-LITE STYLE) =================
            float delta = -0.1f * error * weight;

            // giới hạn thay đổi để tránh drift
            delta = Math.max(-0.15f, Math.min(0.15f, delta));

            float newDifficulty = clamp(current + delta);

            question.setDifficulty(newDifficulty);

            part5Repo.save(question);

        });
    }
}
private float getAbility(Long userId, String label) {

    String skill = "part5_" + label;

    return abilityRepo
            .findByUserIdAndSkill(userId, skill)
            .map(UserSkillAbility::getAbility)
            .orElse(0.5f);
}
    // ================= HELPER =================
    private float clamp(float v) {
        return Math.max(0f, Math.min(1f, v));
    }
}