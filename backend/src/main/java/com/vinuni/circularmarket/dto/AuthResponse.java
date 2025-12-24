package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.UserRole;
import com.vinuni.circularmarket.model.UserStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class AuthResponse {

    private String token;
    private String refreshToken;
    private String type = "Bearer";
    private User user;

    // Default constructor
    public AuthResponse() {}

    // Constructor with parameters
    public AuthResponse(String token, String refreshToken, Long userId, String email, String fullName, UserRole role,
                       LocalDateTime createdAt, String phone, String address, UserStatus status,
                       BigDecimal avgRating, Integer ratingCount) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.user = new User(userId, email, fullName, role, createdAt, phone, address, status, avgRating, ratingCount);
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
        private LocalDateTime createdAt;
        private String phone;
        private String address;
        private UserStatus status;
        private BigDecimal avgRating;
        private Integer ratingCount;

        public User() {}

        public User(Long userId, String email, String fullName, UserRole role, LocalDateTime createdAt,
                   String phone, String address, UserStatus status, BigDecimal avgRating, Integer ratingCount) {
            this.userId = userId;
            this.email = email;
            this.fullName = fullName;
            this.role = role;
            this.createdAt = createdAt;
            this.phone = phone;
            this.address = address;
            this.status = status;
            this.avgRating = avgRating;
            this.ratingCount = ratingCount;
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

        public LocalDateTime getCreatedAt() { return createdAt; }
        public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

        public String getPhone() { return phone; }
        public void setPhone(String phone) { this.phone = phone; }

        public String getAddress() { return address; }
        public void setAddress(String address) { this.address = address; }

        public UserStatus getStatus() { return status; }
        public void setStatus(UserStatus status) { this.status = status; }

        public BigDecimal getAvgRating() { return avgRating; }
        public void setAvgRating(BigDecimal avgRating) { this.avgRating = avgRating; }

        public Integer getRatingCount() { return ratingCount; }
        public void setRatingCount(Integer ratingCount) { this.ratingCount = ratingCount; }
    }
}