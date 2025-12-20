package com.vinuni.circularmarket.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "`Order`") // Order is a reserved keyword in SQL
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "order_id")
    private Long orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "listing_id", nullable = false)
    private Listing listing;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "buyer_id", nullable = false)
    private User buyer;

    @DecimalMin(value = "0.00", message = "Offer price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Offer price must have at most 8 integer digits and 2 decimal places")
    @Column(name = "offer_price", precision = 10, scale = 2)
    private BigDecimal offerPrice;

    @DecimalMin(value = "0.00", message = "Final price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "Final price must have at most 8 integer digits and 2 decimal places")
    @Column(name = "final_price", precision = 10, scale = 2)
    private BigDecimal finalPrice;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.REQUESTED;

    @Column(name = "order_date", nullable = false)
    private LocalDateTime orderDate = LocalDateTime.now();

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "borrow_due_date")
    private LocalDateTime borrowDueDate;

    @Column(name = "returned_at")
    private LocalDateTime returnedAt;

    // One-to-one relationship with Review
    @OneToOne(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private Review review;

    // Default constructor
    public Order() {}

    // Constructor with required fields
    public Order(Listing listing, User buyer, BigDecimal offerPrice) {
        this.listing = listing;
        this.buyer = buyer;
        this.offerPrice = offerPrice;
        this.status = OrderStatus.REQUESTED;
        this.orderDate = LocalDateTime.now();
    }

    // Getters and setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Listing getListing() {
        return listing;
    }

    public void setListing(Listing listing) {
        this.listing = listing;
    }

    public User getBuyer() {
        return buyer;
    }

    public void setBuyer(User buyer) {
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

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    @Override
    public String toString() {
        return "Order{" +
                "orderId=" + orderId +
                ", listingId=" + (listing != null ? listing.getListingId() : null) +
                ", buyerId=" + (buyer != null ? buyer.getUserId() : null) +
                ", offerPrice=" + offerPrice +
                ", finalPrice=" + finalPrice +
                ", status=" + status +
                ", orderDate=" + orderDate +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Order order = (Order) o;
        return orderId != null && orderId.equals(order.orderId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}