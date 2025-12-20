package com.vinuni.circularmarket.dto;

import com.vinuni.circularmarket.model.OrderStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class OrderDTO {

    private Long orderId;

    private ListingDTO listing;

    private UserDTO buyer;

    private BigDecimal offerPrice;

    private BigDecimal finalPrice;

    private OrderStatus status;

    private LocalDateTime orderDate;

    private LocalDateTime confirmedAt;

    private LocalDateTime completedAt;

    private LocalDateTime borrowDueDate;

    private LocalDateTime returnedAt;

    private ReviewDTO review;

    // Default constructor
    public OrderDTO() {}

    // Constructor with all fields
    public OrderDTO(Long orderId, ListingDTO listing, UserDTO buyer, BigDecimal offerPrice,
                   BigDecimal finalPrice, OrderStatus status, LocalDateTime orderDate,
                   LocalDateTime confirmedAt, LocalDateTime completedAt, LocalDateTime borrowDueDate,
                   LocalDateTime returnedAt, ReviewDTO review) {
        this.orderId = orderId;
        this.listing = listing;
        this.buyer = buyer;
        this.offerPrice = offerPrice;
        this.finalPrice = finalPrice;
        this.status = status;
        this.orderDate = orderDate;
        this.confirmedAt = confirmedAt;
        this.completedAt = completedAt;
        this.borrowDueDate = borrowDueDate;
        this.returnedAt = returnedAt;
        this.review = review;
    }

    // Getters and setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public ListingDTO getListing() {
        return listing;
    }

    public void setListing(ListingDTO listing) {
        this.listing = listing;
    }

    public UserDTO getBuyer() {
        return buyer;
    }

    public void setBuyer(UserDTO buyer) {
        this.buyer = buyer;
    }

    public BigDecimal getOfferPrice() {
        return offerPrice;
    }

    public void setOfferPrice(BigDecimal offerPrice) {
        this.offerPrice = offerPrice;
    }

    public BigDecimal getFinalPrice() {
        return finalPrice;
    }

    public void setFinalPrice(BigDecimal finalPrice) {
        this.finalPrice = finalPrice;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public LocalDateTime getConfirmedAt() {
        return confirmedAt;
    }

    public void setConfirmedAt(LocalDateTime confirmedAt) {
        this.confirmedAt = confirmedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getBorrowDueDate() {
        return borrowDueDate;
    }

    public void setBorrowDueDate(LocalDateTime borrowDueDate) {
        this.borrowDueDate = borrowDueDate;
    }

    public LocalDateTime getReturnedAt() {
        return returnedAt;
    }

    public void setReturnedAt(LocalDateTime returnedAt) {
        this.returnedAt = returnedAt;
    }

    public ReviewDTO getReview() {
        return review;
    }

    public void setReview(ReviewDTO review) {
        this.review = review;
    }
}