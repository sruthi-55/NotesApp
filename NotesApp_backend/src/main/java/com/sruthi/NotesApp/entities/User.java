package com.sruthi.NotesApp.entities;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.Collections;


@Entity
@Table(name = "Users")
//@Data       // Lombok annotation → automatically generates getters, setters, toString, equals, hashCode etc.
// don't know why using lombok getter and setters is giving errors - will check later
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;


    // UserDetails interface methods
    // essential for Spring Security to authenticate and authorize the user
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptyList();         // No roles for now
        // return roles like ROLE_USER, ROLE_ADMIN
    }

    @Override
    public String getUsername() {
        return username;        // unique login field
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;    // account expiry logic
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;    // lock logic
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;        // password expiration policies
    }

    @Override
    public boolean isEnabled() {
        return true;    // is user banned
    }


    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }



    public void setUsername(String username) {
        this.username = username;
    }


    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }


}
