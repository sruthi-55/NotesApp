package com.sruthi.NotesApp.security;

import com.sruthi.NotesApp.services.JwtService;
import com.sruthi.NotesApp.services.CustomUserDetailsService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    // runs once for every HTTP request
    // ensures only users with valid tokens can access secured endpoints

    // - extracts JWT from the authorization header
    // - validates it
    // If valid, authenticates the user in the Spring Security context

    @Autowired
    private JwtService jwtService;      // to parse and validate JWTs

    @Autowired
    private CustomUserDetailsService userDetailsService;        // fetches user details from DB

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {


        String path = request.getRequestURI();
        // Allow unauthenticated access to login and register only
        if (path.matches("^/api/auth/(login|register).*")) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");
        String token = null;
        String username = null;

        // Validate JWT header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
            try {
                username = jwtService.extractUsername(token);
            } catch (Exception e) {
                System.out.println("Invalid JWT: " + e.getMessage());
            }
        }

        // Authenticate if username is found and not already set
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            if (jwtService.isTokenValid(token, userDetails.getUsername())) {
                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                // WebAuthenticationDetailsSource builds an object containing metadata about the request
                // like IP address, session ID - maybe useful later for audits or login tracking
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request));

                // storage of security data
                // holds your Authentication object for the current request/thread
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // Continue with filter chain
        filterChain.doFilter(request, response);
    }
}
