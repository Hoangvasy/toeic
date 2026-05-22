package com.toeic.backend.controller;

import java.time.LocalDateTime;
import java.util.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.toeic.backend.entity.PasswordResetToken;
import com.toeic.backend.entity.User;
import com.toeic.backend.repository.PasswordResetTokenRepository;
import com.toeic.backend.repository.UserRepository;
import com.toeic.backend.service.EmailService;
import com.toeic.backend.service.UserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AuthController {

        @Autowired
        private UserRepository userRepository;
        @Autowired
        private PasswordResetTokenRepository tokenRepository;
        @Autowired
        private EmailService emailService;
        @Autowired
        private PasswordEncoder passwordEncoder;
        @Autowired
        private UserService userService;

        @PostMapping("/register")
        public ResponseEntity<?> register(@RequestBody User user) {

                if (user.getUsername() == null || user.getEmail() == null || user.getPassword() == null)
                        return ResponseEntity.badRequest().body("Please fill all fields");

                user.setUsername(user.getUsername().trim());
                user.setEmail(user.getEmail().trim());

                if (userRepository.findByEmail(user.getEmail()) != null)
                        return ResponseEntity.badRequest().body("Email already exists");

                user.setPassword(passwordEncoder.encode(user.getPassword()));
                userRepository.save(user);

                return ResponseEntity.ok("Register success");
        }

        @PostMapping("/login")
        public ResponseEntity<?> login(
                        @RequestBody User request,
                        HttpServletRequest httpRequest,
                        HttpSession session) {

                if (request.getEmail() == null || request.getPassword() == null)
                        return ResponseEntity.badRequest().body("Email and password required");

                User user = userRepository.findByEmail(request.getEmail().trim());

                if (user == null ||
                                !passwordEncoder.matches(request.getPassword(), user.getPassword()))
                        return ResponseEntity.badRequest().body("Invalid email or password");

                userService.validateStreak(user);

                session.invalidate();
                session = httpRequest.getSession(true);

                session.setAttribute("userId", user.getId());
                session.setAttribute("role", user.getRole());

                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getUsername());
                response.put("role", user.getRole());
                response.put("avatar", user.getAvatar());
                response.put("streakDays", user.getStreakDays());
                response.put("longestStreak", user.getLongestStreak());

                return ResponseEntity.ok(response);
        }

        @GetMapping("/profile")
        public ResponseEntity<?> profile(HttpSession session) {

                Long userId = (Long) session.getAttribute("userId");

                if (userId == null)
                        return ResponseEntity.status(401).body("Not logged in");

                User user = userRepository.findById(userId).orElse(null);

                if (user == null)
                        return ResponseEntity.status(404).body("User not found");

                Map<String, Object> response = new HashMap<>();
                response.put("id", user.getId());
                response.put("username", user.getUsername());
                response.put("email", user.getEmail());
                response.put("role", user.getRole());
                response.put("avatar", user.getAvatar());

                return ResponseEntity.ok(response);
        }

        @GetMapping("/me")
        public ResponseEntity<?> getCurrentUser(HttpSession session) {

                Long userId = (Long) session.getAttribute("userId");
                String role = (String) session.getAttribute("role");

                if (userId == null)
                        return ResponseEntity.status(401).body("Not logged in");

                User user = userRepository.findById(userId).orElse(null);

                if (user == null)
                        return ResponseEntity.status(404).body("User not found");

                Map<String, Object> response = new HashMap<>();
                response.put("userId", user.getId());
                response.put("email", user.getEmail());
                response.put("name", user.getUsername());
                response.put("role", role);
                response.put("avatar", user.getAvatar());

                return ResponseEntity.ok(response);
        }

        @PostMapping("/forgot-password")
        public ResponseEntity<?> forgotPassword(
                        @RequestBody Map<String, String> request) {

                String email = request.get("email");

                if (email == null || email.isBlank())
                        return ResponseEntity.badRequest().body("Email is required");

                User user = userRepository.findByEmail(email.trim());

                if (user == null)
                        return ResponseEntity.ok(
                                        "If the email exists, a reset link has been sent");

                PasswordResetToken resetToken = tokenRepository.findByUser(user)
                                .orElse(new PasswordResetToken());

                resetToken.setUser(user);
                resetToken.setToken(UUID.randomUUID().toString());
                resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(15));

                tokenRepository.save(resetToken);

                String resetLink = "http://localhost:5173/reset-password?token="
                                + resetToken.getToken();

                emailService.sendResetPasswordEmail(email, resetLink);

                return ResponseEntity.ok("Reset link sent");
        }

        @PostMapping("/reset-password")
        public ResponseEntity<?> resetPassword(
                        @RequestBody Map<String, String> request) {

                String token = request.get("token");
                String newPassword = request.get("newPassword");

                if (token == null || newPassword == null || newPassword.isBlank())
                        return ResponseEntity.badRequest().body("Invalid request");

                if (newPassword.length() < 6)
                        return ResponseEntity.badRequest()
                                        .body("Password must be at least 6 characters");

                PasswordResetToken resetToken = tokenRepository.findByToken(token).orElse(null);

                if (resetToken == null)
                        return ResponseEntity.badRequest().body("Invalid token");

                if (resetToken.getExpiryDate() == null ||
                                resetToken.getExpiryDate().isBefore(LocalDateTime.now())) {

                        tokenRepository.delete(resetToken);

                        return ResponseEntity.badRequest().body("Token expired");
                }

                User user = resetToken.getUser();

                user.setPassword(passwordEncoder.encode(newPassword));

                userRepository.save(user);

                tokenRepository.delete(resetToken);

                return ResponseEntity.ok("Password reset success");
        }

        @PostMapping("/logout")
        public ResponseEntity<?> logout(HttpSession session) {

                session.invalidate();

                return ResponseEntity.ok("Logout success");
        }
}