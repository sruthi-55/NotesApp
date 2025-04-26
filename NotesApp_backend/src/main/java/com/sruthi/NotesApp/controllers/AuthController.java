package com.sruthi.NotesApp.controllers;

import com.sruthi.NotesApp.dto.LoginRequest;
import com.sruthi.NotesApp.dto.LoginResponse;
import com.sruthi.NotesApp.dto.RegisterRequest;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;


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
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> loginUser(@RequestBody LoginRequest loginRequest) {
        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());

        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = optionalUser.get();

        if (!passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        // Create LoginResponse
        LoginResponse loginResponse = new LoginResponse(
                "Login successful",
                user.getId(),
                user.getUserName(),
                user.getEmail()
        );

        return ResponseEntity.ok(loginResponse);
    }

}
