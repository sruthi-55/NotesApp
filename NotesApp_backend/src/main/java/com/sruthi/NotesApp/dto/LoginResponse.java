package com.sruthi.NotesApp.dto;

public class LoginResponse {
    private String message;
    private Long userId;
    private String userName;
    private String email;

    // Constructors
    public LoginResponse() {}

    public LoginResponse(String message, Long userId, String userName, String email) {
        this.message = message;
        this.userId = userId;
        this.userName = userName;
        this.email = email;
    }

    // Getters and setters
    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
