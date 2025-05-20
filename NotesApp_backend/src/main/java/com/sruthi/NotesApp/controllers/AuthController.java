package com.sruthi.NotesApp.controllers;

import com.sruthi.NotesApp.dto.*;
import com.sruthi.NotesApp.entities.User;
import com.sruthi.NotesApp.repositories.UserRepository;
import com.sruthi.NotesApp.services.JwtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.Optional;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authManager;


    @PostMapping("/register")           // POST requests like /api/auth/register to this method
    public ResponseEntity<String> registerUser(@RequestBody RegisterRequest registerRequest) {

        // Duplicate email check
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email already exists!");
        }

        // Duplicate username check
        if (userRepository.findByUsername(registerRequest.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username already exists!");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        user.setUsername(registerRequest.getUsername());
        user.setPassword(registerRequest.getPassword());

        // encrypt password before saving
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);
        return ResponseEntity.ok("User registered successfully!");
    }



    // Login API - returns JWT token
    @CrossOrigin(origins = "http://localhost:5173")
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {

        // verifies the credentials against the database using AuthenticationManager
        Authentication auth = authManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        UserDetails user = (UserDetails) auth.getPrincipal();
        String token = jwtService.generateToken(user.getUsername());

        return ResponseEntity.ok(new LoginResponse(token));
    }

    // Logout endpoint
    @PostMapping("/logout")
    public String logout() {
        SecurityContextHolder.clearContext();  // Clears the current authentication context
        return "Logged out successfully!";
    }

    //  Get UserProfile - entire User obj
    //    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser1(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            System.out.println("No authenticated user found in security context");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // 401
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        System.out.println("Authenticated user: " + username);

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            System.out.println("User not found: " + username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  //or HttpStatus.UNAUTHORIZED
        }

        User user = optionalUser.get();

        return ResponseEntity.ok(user);
    }

    // Get UserProfile - UserProfileDto
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getCurrentUser(Authentication authentication) {
        if (authentication == null || authentication.getPrincipal() == null) {
            System.out.println("No authenticated user found in security context");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();  // 401
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String username = userDetails.getUsername();
        System.out.println("Authenticated user: " + username);

        Optional<User> optionalUser = userRepository.findByUsername(username);
        if (optionalUser.isEmpty()) {
            System.out.println("User not found: " + username);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();  // 404
        }

        User user = optionalUser.get();

        // Create UserDto from User entity
        UserProfileDto userDto = new UserProfileDto(user.getId(), user.getUsername(), user.getEmail());

        return ResponseEntity.ok(userDto);
    }


    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal User user,
                                                 @RequestBody ChangePasswordRequest request) {
        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body("Old password is incorrect.");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ResponseEntity.ok("Password changed successfully.");
    }

}
