package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.toeic.backend.Entity.PasswordResetToken;

public interface PasswordResetTokenRepository
        extends JpaRepository<PasswordResetToken, Long> {

    PasswordResetToken findByToken(String token);

}
