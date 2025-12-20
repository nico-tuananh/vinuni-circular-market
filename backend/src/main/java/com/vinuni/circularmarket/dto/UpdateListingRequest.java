package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.ListingCondition;
import com.vinuni.circularmarket.model.ListingType;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public class UpdateListingRequest {

    private Long categoryId;

    @Size(max = 200, message = "Title must not exceed 200 characters")
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    private String description;

    private ListingCondition condition;

    private ListingType listingType;

    @DecimalMin(value = "0.00", message = "List price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "List price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal listPrice;

    // Default constructor
    public UpdateListingRequest() {}

    // Getters and setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
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
}