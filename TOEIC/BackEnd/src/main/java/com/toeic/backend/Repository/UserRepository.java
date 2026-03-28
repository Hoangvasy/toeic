package com.toeic.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.toeic.backend.Entity.User;

public interface UserRepository extends JpaRepository<User, Long> {

    User findByEmail(String email);

}