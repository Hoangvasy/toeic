package com.toeic.backend.Controller;

import jakarta.servlet.http.HttpSession;

import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.toeic.backend.Entity.PasswordResetToken;
import com.toeic.backend.Entity.User;
import com.toeic.backend.Repository.PasswordResetTokenRepository;
import com.toeic.backend.Repository.UserRepository;
import com.toeic.backend.service.EmailService;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository tokenRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Forgot Password

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

        return ResponseEntity.ok("Reset link sent to email");
    }

    // Reset Password

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> request) {

        String token = request.get("token");
        String newPassword = request.get("password");

        PasswordResetToken resetToken = tokenRepository.findByToken(token);

        if (resetToken == null) {
            return ResponseEntity.badRequest().body("Invalid token");
        }

        User user = resetToken.getUser();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        tokenRepository.delete(resetToken);

        return ResponseEntity.ok("Password updated");
    }

    // Register

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("Register success");
    }

    // Login

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request, HttpSession session) {

        User user = userRepository.findByEmail(request.getEmail());

        if (user != null &&
                passwordEncoder.matches(request.getPassword(), user.getPassword())) {

            session.setAttribute("USER_ID", user.getId());

            return ResponseEntity.ok("Login success");
        }

        return ResponseEntity.badRequest().body("Invalid email or password");
    }

    // Profile

    @GetMapping("/profile")
    public ResponseEntity<?> profile(HttpSession session) {

        Long id = (Long) session.getAttribute("USER_ID");

        if (id == null) {
            return ResponseEntity.status(401).body("Not logged in");
        }

        return ResponseEntity.ok(userRepository.findById(id).orElse(null));
    }

    // Logout

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {

        session.invalidate();

        return ResponseEntity.ok("Logout success");
    }

}
