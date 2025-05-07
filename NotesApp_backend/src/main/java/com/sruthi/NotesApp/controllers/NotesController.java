package com.sruthi.NotesApp.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/notes")
public class NotesController {
    @GetMapping
    public ResponseEntity<String> getNotes(){
        return ResponseEntity.ok("JWT is working fine. Notes fetched");
    }
}
