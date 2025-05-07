package com.sruthi.NotesApp.services;

import com.sruthi.NotesApp.repositories.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {
    // implementation of the UserDetailsService interface - which Spring Security uses to authenticate users

    // When a user attempts to log in,
    // Spring will call this service to load the user details based on the provided username

    // For every request with the JWT token,
    // Spring will use the username in the token with loadUserByUsername() to
    // verify the token and extract the user's details from DB

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // loads user details based on the username
        // this is called automatically by Spring when validating JWT or logging in

        return (UserDetails) userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
}
