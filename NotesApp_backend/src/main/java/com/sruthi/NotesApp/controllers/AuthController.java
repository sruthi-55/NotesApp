package com.sruthi.NotesApp.controllers;

import com.sruthi.NotesApp.dto.RegisterRequest;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")           // POST requests like /api/auth/register to this method
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {
        // Duplicate email check
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }

        // Duplicate username check
        if (userRepository.findByUserName(registerRequest.getUserName()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username already exists!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setUserName(registerRequest.getUserName());
        user.setPassword(registerRequest.getPassword());

        // encrypt password before saving
        user.setPassword(encryptPassword(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    private String encryptPassword(String password) {
        // use any encryption library like BCrypt
        return password;    // no real encryption yet
    }
}
