package com.vinuni.circularmarket.dto;

import java.time.LocalDateTime;

public class RecentActivityDTO {

    private Long id;
    private String activityType; // "USER_REGISTERED", "LISTING_CREATED", "ORDER_COMPLETED", etc.
    private String description;
    private String userName;
    private LocalDateTime timestamp;
    private String details; // Additional details in JSON format

    // Default constructor
    public RecentActivityDTO() {}

    // Constructor with all fields
    public RecentActivityDTO(Long id, String activityType, String description,
                           String userName, LocalDateTime timestamp, String details) {
        this.id = id;
        this.activityType = activityType;
        this.description = description;
        this.userName = userName;
        this.timestamp = timestamp;
        this.details = details;
    }

    // Getters and setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }
}