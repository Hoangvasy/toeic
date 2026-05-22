package com.toeic.backend.controller;

import com.toeic.backend.dto.ProfileUpdateRequest;
import com.toeic.backend.entity.User;
import com.toeic.backend.repository.UserRepository;
import com.toeic.backend.service.UserService;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.util.UUID;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    private final UserRepository userRepository;

    public UserController(
            UserService userService,
            UserRepository userRepository) {

        this.userService = userService;
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {

        return userService.getProfile(id);
    }

    @PutMapping("/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody ProfileUpdateRequest request) {

        return userService.updateProfile(id, request);
    }

    @PostMapping(value = "/upload-avatar/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public User uploadAvatar(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file) throws IOException {

        System.out.println("UPLOAD API HIT");

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!file.getContentType().startsWith("image/")) {

            throw new RuntimeException("File phải là ảnh");
        }

        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

        String uploadDir = System.getProperty("user.dir")
                + "/uploads/";

        File dir = new File(uploadDir);

        if (!dir.exists()) {

            dir.mkdirs();
        }

        File destination = new File(uploadDir + fileName);

        file.transferTo(destination);

        user.setAvatar("/uploads/" + fileName);

        return userRepository.save(user);
    }

}