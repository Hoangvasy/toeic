
package com.toeic.backend.repository;

import com.toeic.backend.entity.UserSkillAbility;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserSkillAbilityRepo extends JpaRepository<UserSkillAbility, Long> {

    Optional<UserSkillAbility> findByUserIdAndSkill(Long userId, String skill);

    List<UserSkillAbility> findByUserId(Long userId);
}