package com.sruthi.NotesApp.config;

import com.sruthi.NotesApp.security.JwtAuthenticationFilter;
import com.sruthi.NotesApp.services.CustomUserDetailsService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(CustomUserDetailsService userDetailsService, JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        // customizes how incoming HTTP requests are handled
        // defines the entire security behavior for incoming requests

        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())       // disable CSRF protection
                // mainly used in browser-based apps with sessions
                // Since we're using JWTs and no session, can disable

                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // <- ADDED THIS
                // tells Spring Security not to use session - critical for stateless JWT auth

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()    // Allow all requests to /api/auth/
                        .anyRequest().authenticated()       // any other request must be authenticated via JWT
                )
                .formLogin(form -> form.disable())      // disable default login form
                .httpBasic(basic -> basic.disable())    // disable browser's basic auth popup

                .authenticationProvider(authenticationProvider())
                // Here’s how to verify username & password when someone logs in

                .addFilterBefore(jwtAuthenticationFilter, org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);
        // Before doing your default username/password check, first run my filter that checks for JWT tokens
        // 'cause when' user is already logged in, they won’t send username/password again.
        // Instead, they send a JWT token in the Authorization header

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // tells Spring - Hey, whenever we want to hash or verify passwords, use BCrypt.
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Spring uses this to verify username/password during login
        return config.getAuthenticationManager();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        // Auth provider connects Spring Security with your user + password checking logic

        // This provider connects:
        // - User lookup from DB → CustomUserDetailsService
        // - Password check → BCryptPasswordEncoder

        // Spring uses this to authenticate the user during login by checking username + password.

        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);   // User fetch
        provider.setPasswordEncoder(passwordEncoder());     // password check
        return provider;
    }
}
