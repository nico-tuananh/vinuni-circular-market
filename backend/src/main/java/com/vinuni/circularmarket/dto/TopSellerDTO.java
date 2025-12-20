package com.vinuni.circularmarket.dto;

import java.math.BigDecimal;

public class TopSellerDTO {

    private Long userId;
    private String fullName;
    private String email;
    private long totalListings;
    private long completedOrders;
    private BigDecimal totalRevenue;
    private double averageRating;
    private long reviewCount;

    // Default constructor
    public TopSellerDTO() {}

    // Constructor with all fields
    public TopSellerDTO(Long userId, String fullName, String email, long totalListings,
                       long completedOrders, BigDecimal totalRevenue, double averageRating, long reviewCount) {
        this.userId = userId;
        this.fullName = fullName;
        this.email = email;
        this.totalListings = totalListings;
        this.completedOrders = completedOrders;
        this.totalRevenue = totalRevenue;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
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

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(long reviewCount) {
        this.reviewCount = reviewCount;
    }
}