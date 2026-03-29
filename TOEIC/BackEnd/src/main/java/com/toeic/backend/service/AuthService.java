package com.toeic.backend.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.toeic.backend.entity.User;
import com.toeic.backend.repository.UserRepository;
import com.toeic.backend.security.JwtUtil;

@Service
public class AuthService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    JwtUtil jwtUtil;

    public String login(String username, String password) {

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }

        return jwtUtil.generateToken(username);
    }
}
