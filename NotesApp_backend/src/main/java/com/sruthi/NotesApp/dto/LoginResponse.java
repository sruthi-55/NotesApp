package com.sruthi.NotesApp.dto;

public class LoginResponse {
    private String token;

    // Constructors
    public LoginResponse() {}


    public LoginResponse(String token){
        this.token = token;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
