package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.UserRole;

public class AuthResponse {

    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private User user;

    // Default constructor
    public AuthResponse() {}

    // Constructor with parameters
    public AuthResponse(String token, String refreshToken, Long userId, String email, String fullName, UserRole role) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = new User(userId, email, fullName, role);
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getRefreshToken() {
        return refreshToken;
    }

    public void setRefreshToken(String refreshToken) {
        this.refreshToken = refreshToken;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    // Delegate methods for backward compatibility
    public Long getUserId() {
        return user != null ? user.getUserId() : null;
    }

    public void setUserId(Long userId) {
        if (user != null) {
            user.setUserId(userId);
        }
    }

    public String getEmail() {
        return user != null ? user.getEmail() : null;
    }

    public void setEmail(String email) {
        if (user != null) {
            user.setEmail(email);
        }
    }

    public String getFullName() {
        return user != null ? user.getFullName() : null;
    }

    public void setFullName(String fullName) {
        if (user != null) {
            user.setFullName(fullName);
        }
    }

    public UserRole getRole() {
        return user != null ? user.getRole() : null;
    }

    public void setRole(UserRole role) {
        if (user != null) {
            user.setRole(role);
        }
    }

    // Nested User class
    public static class User {
        private Long userId;
        private String email;
        private String fullName;
        private UserRole role;

        public User() {}

        public User(Long userId, String email, String fullName, UserRole role) {
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
        }

        // Getters and setters
        public Long getUserId() { return userId; }
        public void setUserId(Long userId) { this.userId = userId; }

        public String getEmail() { return email; }
        public void setEmail(String email) { this.email = email; }

        public String getFullName() { return fullName; }
        public void setFullName(String fullName) { this.fullName = fullName; }

        public UserRole getRole() { return role; }
        public void setRole(UserRole role) { this.role = role; }
    }
}