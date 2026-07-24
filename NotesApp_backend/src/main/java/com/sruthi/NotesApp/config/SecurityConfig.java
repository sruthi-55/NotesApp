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

    public SecurityConfig(CustomUserDetailsService userDetailsService,
                          JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.userDetailsService = userDetailsService;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    //builds filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http
                // Enable cross-origin requests
                // without this browser blocks React (5173) -> Backend (8080) talk
                .cors(Customizer.withDefaults())

                // Disable CSRF (protection for session cookies)
                // because we’re using JWT (stateless). So no cookies, sessions or CSRF needed
                .csrf(csrf -> csrf.disable())


                // stateless session (JWT)
                // do not create http sessions. do NOT store user in memory.
                // every request must carry JWT
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))


                // Authorization rules - Authorize requests
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()   // allow auth endpoints
                        .anyRequest().authenticated()                  // all others require JWT
                )

                // Disable default login form & HTTP basic
                // spring by default gives - HTML login page, browser popup
                .formLogin(form -> form.disable())
                .httpBasic(basic -> basic.disable())

                // Authentication provider (username/password check)
                // when someone logs in with username/password, use THIS logic.
                .authenticationProvider(authenticationProvider())

                // JWT filter before default username/password filter
                // run your JWT filter BEFORE spring’s login filter
                .addFilterBefore(jwtAuthenticationFilter,
                        org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter.class);


        return http.build();
    }


    // creates BCrypt hasher
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
        // passwords are stored as: $2a$10$XyZ....
        // not plain text
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // used in login controller
        // spring uses this to verify credentials
        return config.getAuthenticationManager();
    }


    // defines: how username/password is verified
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);     // load user from DB
        provider.setPasswordEncoder(passwordEncoder());         // get hashed password, compare with BCrypt
        return provider;
    }
}
