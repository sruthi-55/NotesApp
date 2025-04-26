package com.sruthi.NotesApp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // customizes how incoming HTTP requests are handled

        http
                .csrf(csrf -> csrf.disable())       // disable CSRF protection
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()    // Allow all requests to /api/auth/
                        .anyRequest().permitAll()
                )
                .formLogin(form -> form.disable())      // disable default login
                .httpBasic(basic -> basic.disable());   // disable basic auth popup

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // tells Spring - Hey, whenever we want to hash or verify passwords, use BCrypt.
        return new BCryptPasswordEncoder();
    }

}



