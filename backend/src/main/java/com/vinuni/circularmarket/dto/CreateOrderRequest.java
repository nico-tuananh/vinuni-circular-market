package com.vinuni.circularmarket.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

public class CreateOrderRequest {

    @NotNull(message = "Listing ID is required")
    private Long listingId;

    @NotNull(message = "Offer price is required")
    @DecimalMin(value = "0.00", message = "Offer price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Offer price must have at most 8 integer digits and 2 decimal places")
    private BigDecimal offerPrice;

    // Default constructor
    public CreateOrderRequest() {}

    // Constructor with required fields
    public CreateOrderRequest(Long listingId, BigDecimal offerPrice) {
        this.listingId = listingId;
        this.offerPrice = offerPrice;
    }

    // Getters and setters
    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public BigDecimal getOfferPrice() {
        return offerPrice;
    }

    public void setOfferPrice(BigDecimal offerPrice) {
        this.offerPrice = offerPrice;
    }
}