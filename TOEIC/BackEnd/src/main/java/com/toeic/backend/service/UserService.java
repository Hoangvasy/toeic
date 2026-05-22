package com.toeic.backend.service;

import com.toeic.backend.dto.ProfileUpdateRequest;
import com.toeic.backend.entity.User;
import com.toeic.backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;

@Service
public class UserService {

        private final UserRepository userRepository;

        public UserService(
                        UserRepository userRepository) {

                this.userRepository = userRepository;
        }

        public User getProfile(
                        Long userId) {

                return userRepository
                                .findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));
        }

        public User updateProfile(

                        Long userId,

                        ProfileUpdateRequest request) {

                User user = userRepository.findById(userId)
                                .orElseThrow(
                                                () -> new RuntimeException(
                                                                "User not found"));

                user.setUsername(
                                request.getUsername());

                user.setEmail(
                                request.getEmail());

                user.setTargetScore(
                                request.getTargetScore());

                user.setStudyTime(
                                request.getStudyTime());

                return userRepository.save(user);
        }

        public void updateStreak(User user) {

                LocalDate today = LocalDate.now(
                                ZoneId.of("Asia/Ho_Chi_Minh"));

                LocalDate lastStudyDate = user.getLastStudyDate();

                if (lastStudyDate == null) {

                        user.setStreakDays(1);

                        user.setLongestStreak(1);

                        user.setLastStudyDate(today);

                        userRepository.save(user);

                        return;
                }

                // tránh tăng nhiều lần trong 1 ngày
                if (lastStudyDate.equals(today)) {

                        return;
                }

                if (lastStudyDate
                                .plusDays(1)
                                .equals(today)) {

                        user.setStreakDays(
                                        user.getStreakDays() + 1);
                }

                else {

                        user.setStreakDays(1);
                }

                if (user.getStreakDays() > user.getLongestStreak()) {

                        user.setLongestStreak(
                                        user.getStreakDays());
                }

                user.setLastStudyDate(today);

                userRepository.save(user);
        }

        public void validateStreak(User user) {

                LocalDate today = LocalDate.now(
                                ZoneId.of("Asia/Ho_Chi_Minh"));

                LocalDate lastStudyDate = user.getLastStudyDate();

                if (lastStudyDate == null) {
                        return;
                }

                long daysBetween = ChronoUnit.DAYS.between(
                                lastStudyDate,
                                today);

                if (daysBetween > 1) {

                        user.setStreakDays(0);

                        userRepository.save(user);
                }
        }
}