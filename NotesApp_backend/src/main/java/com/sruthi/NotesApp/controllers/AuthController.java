package com.sruthi.NotesApp.controllers;

import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/register")           // POST requests like /api/auth/register to this method
    public String registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return "Error: Email already exists!";
        }
        // encrypt password before saving
        user.setPassword(encryptPassword(user.getPassword()));

        userRepository.save(user);
        return "User registered successfully!";
    }

    private String encryptPassword(String password) {
        // use any encryption library like BCrypt
        return password;    // no real encryption yet
    }
}
