package com.vinuni.circularmarket.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.List;

public class CommentDTO {

    private Long commentId;

    private Long listingId;

    private UserDTO user;

    @NotBlank(message = "Content is required")
    private String content;

    private LocalDateTime createdAt;

    private Long parentId;

    private List<CommentDTO> replies;

    // Default constructor
    public CommentDTO() {}

    // Constructor with all fields
    public CommentDTO(Long commentId, Long listingId, UserDTO user, String content,
                     LocalDateTime createdAt, Long parentId, List<CommentDTO> replies) {
        this.commentId = commentId;
        this.listingId = listingId;
        this.user = user;
        this.content = content;
        this.createdAt = createdAt;
        this.parentId = parentId;
        this.replies = replies;
    }

    // Getters and setters
    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
    }

    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public UserDTO getUser() {
        return user;
    }

    public void setUser(UserDTO user) {
        this.user = user;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public List<CommentDTO> getReplies() {
        return replies;
    }

    public void setReplies(List<CommentDTO> replies) {
        this.replies = replies;
    }
}