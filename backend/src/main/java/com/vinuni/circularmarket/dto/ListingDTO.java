package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.ListingCondition;
import com.vinuni.circularmarket.model.ListingStatus;
import com.vinuni.circularmarket.model.ListingType;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

public class ListingDTO {

    private Long listingId;

    private UserDTO seller;

    private CategoryDTO category;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    @NotNull(message = "Condition is required")
    private ListingCondition condition;

    @NotNull(message = "Listing type is required")
    private ListingType listingType;

    @NotNull(message = "List price is required")
    @DecimalMin(value = "0.00", message = "List price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "List price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal listPrice;

    private ListingStatus status;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    private Long commentCount;

    // Default constructor
    public ListingDTO() {}

    // Constructor with all fields
    public ListingDTO(Long listingId, UserDTO seller, CategoryDTO category, String title,
                     String description, ListingCondition condition, ListingType listingType,
                     BigDecimal listPrice, ListingStatus status, LocalDateTime createdAt,
                     LocalDateTime updatedAt, Long commentCount) {
        this.listingId = listingId;
        this.seller = seller;
        this.category = category;
        this.title = title;
        this.description = description;
        this.condition = condition;
        this.listingType = listingType;
        this.listPrice = listPrice;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.commentCount = commentCount;
    }

    // Getters and setters
    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public UserDTO getSeller() {
        return seller;
    }

    public void setSeller(UserDTO seller) {
        this.seller = seller;
    }

    public CategoryDTO getCategory() {
        return category;
    }

    public void setCategory(CategoryDTO category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ListingCondition getCondition() {
        return condition;
    }

    public void setCondition(ListingCondition condition) {
        this.condition = condition;
    }

    public ListingType getListingType() {
        return listingType;
    }

    public void setListingType(ListingType listingType) {
        this.listingType = listingType;
    }

    public BigDecimal getListPrice() {
        return listPrice;
    }

    public void setListPrice(BigDecimal listPrice) {
        this.listPrice = listPrice;
    }

    public ListingStatus getStatus() {
        return status;
    }

    public void setStatus(ListingStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCommentCount() {
        return commentCount;
    }

    public void setCommentCount(Long commentCount) {
        this.commentCount = commentCount;
    }
}