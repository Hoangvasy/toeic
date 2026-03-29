package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.entity.PasswordResetToken;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByToken(String token);

}
