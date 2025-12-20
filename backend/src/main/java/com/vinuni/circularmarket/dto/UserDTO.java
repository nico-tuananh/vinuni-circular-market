package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.UserRole;
import com.vinuni.circularmarket.model.UserStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class UserDTO {

    private Long userId;
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private UserRole role;
    private UserStatus status;
    private LocalDateTime createdAt;
    private BigDecimal avgRating;
    private Integer ratingCount;

    // Default constructor
    public UserDTO() {}

    // Constructor with all parameters
    public UserDTO(Long userId, String fullName, String email, String phone, String address,
                   UserRole role, UserStatus status, LocalDateTime createdAt,
                   BigDecimal avgRating, Integer ratingCount) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.address = address;
        this.role = role;
        this.status = status;
        this.createdAt = createdAt;
        this.avgRating = avgRating;
        this.ratingCount = ratingCount;
    }

    // Getters and setters
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }

    public UserStatus getStatus() {
        return status;
    }

    public void setStatus(UserStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public BigDecimal getAvgRating() {
        return avgRating;
    }

    public void setAvgRating(BigDecimal avgRating) {
        this.avgRating = avgRating;
    }

    public Integer getRatingCount() {
        return ratingCount;
    }

    public void setRatingCount(Integer ratingCount) {
        this.ratingCount = ratingCount;
    }
}