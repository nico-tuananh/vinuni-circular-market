package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.CreateReviewRequest;
import com.vinuni.circularmarket.dto.ReviewDTO;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010", "https://leon-uninterdicted-traci.ngrok-free.dev"})
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    /**
     * Create a review for a completed order (authenticated endpoint)
     * @param orderId the order ID
     * @param request the review creation request
     * @return created review or error
     */
    @PostMapping("/orders/{orderId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createReview(@PathVariable Long orderId, @Valid @RequestBody CreateReviewRequest request) {
        try {
            Long buyerId = getCurrentUserId();
            ReviewDTO createdReview = reviewService.createReview(buyerId, orderId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdReview);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create review");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get review by order ID (public endpoint)
     * @param orderId the order ID
     * @return review data or error
     */
    @GetMapping("/orders/{orderId}")
    public ResponseEntity<?> getReviewByOrderId(@PathVariable Long orderId) {
        try {
            Optional<ReviewDTO> review = reviewService.getReviewByOrderId(orderId);
            if (review.isPresent()) {
                return ResponseEntity.ok(review.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Review not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve review");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get reviews for a listing (public endpoint)
     * @param listingId the listing ID
     * @param page page number
     * @param size page size
     * @return paginated reviews for the listing
     */
    @GetMapping("/listings/{listingId}")
    public ResponseEntity<?> getReviewsByListingId(
            @PathVariable Long listingId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ReviewDTO> reviewsPage = reviewService.getReviewsByListingId(listingId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("reviews", reviewsPage.getContent());
            response.put("currentPage", reviewsPage.getNumber());
            response.put("totalItems", reviewsPage.getTotalElements());
            response.put("totalPages", reviewsPage.getTotalPages());
            response.put("averageRating", reviewService.getAverageRatingForListing(listingId));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve reviews");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get reviews by buyer (authenticated endpoint - user's own reviews)
     * @return list of buyer's reviews
     */
    @GetMapping("/my-reviews")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyReviews() {
        try {
            Long buyerId = getCurrentUserId();
            List<ReviewDTO> reviews = reviewService.getReviewsByBuyerId(buyerId);
            return ResponseEntity.ok(reviews);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve your reviews");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get average rating for a listing (public endpoint)
     * @param listingId the listing ID
     * @return average rating
     */
    @GetMapping("/listings/{listingId}/average-rating")
    public ResponseEntity<?> getAverageRatingForListing(@PathVariable Long listingId) {
        try {
            Double averageRating = reviewService.getAverageRatingForListing(listingId);
            Map<String, Object> response = new HashMap<>();
            response.put("listingId", listingId);
            response.put("averageRating", averageRating);
            response.put("reviewCount", reviewService.getReviewCountForListing(listingId));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to calculate average rating");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get average rating for a seller (authenticated endpoint)
     * @param sellerId the seller ID
     * @return average rating
     */
    @GetMapping("/sellers/{sellerId}/average-rating")
    public ResponseEntity<?> getAverageRatingForSeller(@PathVariable Long sellerId) {
        try {
            Double averageRating = reviewService.getAverageRatingForSeller(sellerId);
            Map<String, Object> response = new HashMap<>();
            response.put("sellerId", sellerId);
            response.put("averageRating", averageRating);
            response.put("reviewCount", reviewService.getReviewCountForSeller(sellerId));
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to calculate seller rating");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update a review (authenticated endpoint - owner only)
     * @param reviewId the review ID
     * @param request the updated review data
     * @return updated review or error
     */
    @PutMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateReview(@PathVariable Long reviewId, @Valid @RequestBody CreateReviewRequest request) {
        try {
            Long buyerId = getCurrentUserId();
            ReviewDTO updatedReview = reviewService.updateReview(reviewId, buyerId, request);
            return ResponseEntity.ok(updatedReview);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update review");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete a review (authenticated endpoint - owner only)
     * @param reviewId the review ID
     * @return success message or error
     */
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteReview(@PathVariable Long reviewId) {
        try {
            Long buyerId = getCurrentUserId();
            reviewService.deleteReview(reviewId, buyerId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Review deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete review");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Helper method to get current user ID from security context
     * Extracts user ID from the authenticated User entity in SecurityContext
     */
    private Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() != null) {
            if (authentication.getPrincipal() instanceof User) {
                User user = (User) authentication.getPrincipal();
                return user.getUserId();
            }
        }
        throw new IllegalStateException("User not authenticated");
    }
}