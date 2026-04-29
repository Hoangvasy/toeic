package com.toeic.backend.controller;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.toeic.backend.entity.PasswordResetToken;
import com.toeic.backend.entity.User;
import com.toeic.backend.repository.PasswordResetTokenRepository;
import com.toeic.backend.repository.UserRepository;
import com.toeic.backend.service.EmailService;

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

    // REGISTER

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("Register success");
    }

    // LOGIN
    @PostMapping("/login")
    public ResponseEntity<?> login(
            @RequestBody User request,
            HttpServletRequest httpRequest,
            HttpSession session) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user != null &&
                passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            session.invalidate();
            session = httpRequest.getSession(true);

            session.setAttribute("userId", user.getId());
            session.setAttribute("role", user.getRole());

            return ResponseEntity.ok(Map.of(
                    "email", user.getEmail(),
                    "role", user.getRole()));
        }

        return ResponseEntity.badRequest().body("Invalid email or password");
    }

    // PROFILE
    @GetMapping("/profile")
    public ResponseEntity<?> profile(HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");

        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        User user = userRepository.findById(userId).orElse(null);

        if (user == null) {
            return ResponseEntity.status(404).body("User not found");
        }

        return ResponseEntity.ok(user);
    }

    // FORGOT PASSWORD

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> request) {

        String email = request.get("email");

        User user = userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.badRequest().body("Email not found");
        }

        String token = UUID.randomUUID().toString();

        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);

        tokenRepository.save(resetToken);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;

        emailService.sendResetPasswordEmail(email, resetLink);

        return ResponseEntity.ok("Reset link sent");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("Logout success");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(HttpSession session) {

        Long userId = (Long) session.getAttribute("userId");
        String role = (String) session.getAttribute("role");

        if (userId == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        return ResponseEntity.ok(Map.of(
                "userId", userId,
                "role", role));
    }

}