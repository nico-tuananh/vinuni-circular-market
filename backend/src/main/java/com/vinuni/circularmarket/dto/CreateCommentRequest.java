package com.vinuni.circularmarket.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCommentRequest {

    @NotBlank(message = "Content is required")
    private String content;

    private Long parentId; // Optional, for replies

    // Default constructor
    public CreateCommentRequest() {}

    // Constructor with required fields
    public CreateCommentRequest(String content) {
        this.content = content;
    }

    // Constructor with all fields
    public CreateCommentRequest(String content, Long parentId) {
        this.content = content;
        this.parentId = parentId;
    }

    // Getters and setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }
}