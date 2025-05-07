package com.sruthi.NotesApp.repositories;


import com.sruthi.NotesApp.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
// all basic methods without writing any SQL manually

    Optional<User> findByEmail(String email);       // Custom query

    Optional<Object> findByUsername(String username);
    // Spring Data JPA - creates queries by just seeing the method name
}
