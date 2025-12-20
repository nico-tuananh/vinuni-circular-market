package com.vinuni.circularmarket.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class CategoryDTO {

    private Long categoryId;

    @NotBlank(message = "Category name is required")
    @Size(max = 120, message = "Category name must not exceed 120 characters")
    private String name;

    @Size(max = 255, message = "Category description must not exceed 255 characters")
    private String description;

    private Long listingCount;

    // Default constructor
    public CategoryDTO() {}

    // Constructor with all fields
    public CategoryDTO(Long categoryId, String name, String description, Long listingCount) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
        this.listingCount = listingCount;
    }

    // Constructor for basic category info
    public CategoryDTO(Long categoryId, String name, String description) {
        this.categoryId = categoryId;
        this.name = name;
        this.description = description;
    }

    // Getters and setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getListingCount() {
        return listingCount;
    }

    public void setListingCount(Long listingCount) {
        this.listingCount = listingCount;
    }
}