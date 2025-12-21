package com.vinuni.circularmarket.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Entity
@Table(name = "Listing")
@EntityListeners(AuditingEntityListener.class)
public class Listing {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "listing_id")
    private Long listingId;

    @NotNull(message = "Seller is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "seller_id", nullable = false)
    private User seller;

    @NotNull(message = "Category is required")
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @NotBlank(message = "Title is required")
    @Size(max = 200, message = "Title must not exceed 200 characters")
    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Size(max = 5000, message = "Description must not exceed 5000 characters")
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @NotNull(message = "Condition is required")
    @Column(name = "condition", nullable = false, columnDefinition = "ENUM('new','like_new','used') NOT NULL")
    private ListingCondition condition;

    @NotNull(message = "Listing type is required")
    @Column(name = "listing_type", nullable = false)
    private ListingType listingType;

    @NotNull(message = "List price is required")
    @DecimalMin(value = "0.00", message = "List price must be non-negative")
    @Digits(integer = 8, fraction = 2, message = "List price must have at most 8 integer digits and 2 decimal places")
    @Column(name = "list_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal listPrice;

    @NotNull(message = "Status is required")
    @Column(name = "status", nullable = false)
    private ListingStatus status = ListingStatus.AVAILABLE;

    @CreatedDate
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    // One-to-many relationships
    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    @OneToMany(mappedBy = "listing", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Comment> comments = new ArrayList<>();

    // Default constructor
    public Listing() {}

    // Constructor with required fields
    public Listing(User seller, Category category, String title, String description,
                   ListingCondition condition, ListingType listingType, BigDecimal listPrice) {
        this.seller = seller;
        this.category = category;
        this.title = title;
        this.description = description;
        this.condition = condition;
        this.listingType = listingType;
        this.listPrice = listPrice;
        this.status = ListingStatus.AVAILABLE;
    }

    // Getters and setters
    public Long getListingId() {
        return listingId;
    }

    public void setListingId(Long listingId) {
        this.listingId = listingId;
    }

    public User getSeller() {
        return seller;
    }

    public void setSeller(User seller) {
        this.seller = seller;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
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

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }

    public List<Comment> getComments() {
        return comments;
    }

    public void setComments(List<Comment> comments) {
        this.comments = comments;
    }

    @Override
    public String toString() {
        return "Listing{" +
                "listingId=" + listingId +
                ", title='" + title + '\'' +
                ", condition=" + condition +
                ", listingType=" + listingType +
                ", listPrice=" + listPrice +
                ", status=" + status +
                ", createdAt=" + createdAt +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Listing listing = (Listing) o;
        return listingId != null && listingId.equals(listing.listingId);
    }

    @Override
    public int hashCode() {
        return getClass().hashCode();
    }
}