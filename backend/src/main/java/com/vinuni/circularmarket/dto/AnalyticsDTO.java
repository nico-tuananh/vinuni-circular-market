package com.vinuni.circularmarket.dto;

import java.math.BigDecimal;

public class AnalyticsDTO {

    // User statistics
    private long totalUsers;
    private long activeUsers;
    private long inactiveUsers;
    private long adminUsers;
    private long studentUsers;

    // Listing statistics
    private long totalListings;
    private long activeListings;
    private long reservedListings;
    private long soldListings;
    private long borrowedListings;

    // Order statistics
    private long totalOrders;
    private long pendingOrders;
    private long confirmedOrders;
    private long completedOrders;
    private long cancelledOrders;

    // Revenue statistics
    private BigDecimal totalRevenue;
    private BigDecimal monthlyRevenue;
    private BigDecimal averageOrderValue;

    // Review statistics
    private long totalReviews;
    private double averageRating;

    // Comment statistics
    private long totalComments;

    // Top sellers data
    private java.util.List<TopSellerDTO> topSellers;

    // Recent activity
    private java.util.List<RecentActivityDTO> recentActivities;

    // Default constructor
    public AnalyticsDTO() {
        this.topSellers = new java.util.ArrayList<>();
        this.recentActivities = new java.util.ArrayList<>();
    }

    // Getters and setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getActiveUsers() {
        return activeUsers;
    }

    public void setActiveUsers(long activeUsers) {
        this.activeUsers = activeUsers;
    }

    public long getInactiveUsers() {
        return inactiveUsers;
    }

    public void setInactiveUsers(long inactiveUsers) {
        this.inactiveUsers = inactiveUsers;
    }

    public long getAdminUsers() {
        return adminUsers;
    }

    public void setAdminUsers(long adminUsers) {
        this.adminUsers = adminUsers;
    }

    public long getStudentUsers() {
        return studentUsers;
    }

    public void setStudentUsers(long studentUsers) {
        this.studentUsers = studentUsers;
    }

    public long getTotalListings() {
        return totalListings;
    }

    public void setTotalListings(long totalListings) {
        this.totalListings = totalListings;
    }

    public long getActiveListings() {
        return activeListings;
    }

    public void setActiveListings(long activeListings) {
        this.activeListings = activeListings;
    }

    public long getReservedListings() {
        return reservedListings;
    }

    public void setReservedListings(long reservedListings) {
        this.reservedListings = reservedListings;
    }

    public long getSoldListings() {
        return soldListings;
    }

    public void setSoldListings(long soldListings) {
        this.soldListings = soldListings;
    }

    public long getBorrowedListings() {
        return borrowedListings;
    }

    public void setBorrowedListings(long borrowedListings) {
        this.borrowedListings = borrowedListings;
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getConfirmedOrders() {
        return confirmedOrders;
    }

    public void setConfirmedOrders(long confirmedOrders) {
        this.confirmedOrders = confirmedOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public long getCancelledOrders() {
        return cancelledOrders;
    }

    public void setCancelledOrders(long cancelledOrders) {
        this.cancelledOrders = cancelledOrders;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public BigDecimal getMonthlyRevenue() {
        return monthlyRevenue;
    }

    public void setMonthlyRevenue(BigDecimal monthlyRevenue) {
        this.monthlyRevenue = monthlyRevenue;
    }

    public BigDecimal getAverageOrderValue() {
        return averageOrderValue;
    }

    public void setAverageOrderValue(BigDecimal averageOrderValue) {
        this.averageOrderValue = averageOrderValue;
    }

    public long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(double averageRating) {
        this.averageRating = averageRating;
    }

    public long getTotalComments() {
        return totalComments;
    }

    public void setTotalComments(long totalComments) {
        this.totalComments = totalComments;
    }

    public java.util.List<TopSellerDTO> getTopSellers() {
        return topSellers;
    }

    public void setTopSellers(java.util.List<TopSellerDTO> topSellers) {
        this.topSellers = topSellers;
    }

    public java.util.List<RecentActivityDTO> getRecentActivities() {
        return recentActivities;
    }

    public void setRecentActivities(java.util.List<RecentActivityDTO> recentActivities) {
        this.recentActivities = recentActivities;
    }
}