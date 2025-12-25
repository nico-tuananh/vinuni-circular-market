package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.CreateReviewRequest;
import com.vinuni.circularmarket.dto.ListingDTO;
import com.vinuni.circularmarket.dto.ReviewDTO;
import com.vinuni.circularmarket.dto.UserDTO;
import com.vinuni.circularmarket.model.Order;
import com.vinuni.circularmarket.model.OrderStatus;
import com.vinuni.circularmarket.model.Review;
import com.vinuni.circularmarket.repository.OrderRepository;
import com.vinuni.circularmarket.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final OrderRepository orderRepository;

    public ReviewService(ReviewRepository reviewRepository, OrderRepository orderRepository) {
        this.reviewRepository = reviewRepository;
        this.orderRepository = orderRepository;
    }

    /**
     * Create a review for a completed order
     * @param buyerId the buyer ID
     * @param orderId the order ID
     * @param request the review creation request
     * @return created review DTO
     */
    @Transactional
    public ReviewDTO createReview(Long buyerId, Long orderId, CreateReviewRequest request) {
        // Find the order and validate it can be reviewed
        Optional<Order> orderOpt = orderRepository.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new IllegalArgumentException("Order not found with id: " + orderId);
        }

        Order order = orderOpt.get();

        // Verify buyer owns the order
        if (!order.getBuyer().getUserId().equals(buyerId)) {
            throw new IllegalArgumentException("You are not authorized to review this order");
        }

        // Check if order is completed
        if (order.getStatus() != OrderStatus.COMPLETED) {
            throw new IllegalArgumentException("Order must be completed before it can be reviewed");
        }

        // Check if review already exists
        if (reviewRepository.existsByOrder_OrderId(orderId)) {
            throw new IllegalArgumentException("Review already exists for this order");
        }

        // Create the review
        Review review = new Review(order, request.getRating(), request.getComment());
        Review savedReview = reviewRepository.save(review);

        // Update seller's average rating (simplified - in real implementation, this would be more sophisticated)
        updateSellerAverageRating(order.getListing().getSeller().getUserId());

        return convertToDTO(savedReview);
    }

    /**
     * Get review by order ID
     * @param orderId the order ID
     * @return optional review DTO
     */
    @Transactional(readOnly = true)
    public Optional<ReviewDTO> getReviewByOrderId(Long orderId) {
        return reviewRepository.findByOrder_OrderId(orderId).map(this::convertToDTO);
    }

    /**
     * Get reviews for a listing
     * @param listingId the listing ID
     * @return list of reviews for the listing
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByListingId(Long listingId) {
        return reviewRepository.findByListingId(listingId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get reviews for a listing with pagination
     * @param listingId the listing ID
     * @param pageable pagination information
     * @return page of reviews for the listing
     */
    @Transactional(readOnly = true)
    public Page<ReviewDTO> getReviewsByListingId(Long listingId, Pageable pageable) {
        try {
            Page<Review> reviewsPage = reviewRepository.findByListingId(listingId, pageable);
            
            // Convert to DTOs, handling potential lazy loading issues
            List<ReviewDTO> reviewDTOs = reviewsPage.getContent().stream()
                .map(review -> {
                    try {
                        return convertToDTO(review);
                    } catch (Exception e) {
                        // If conversion fails due to lazy loading, return minimal DTO
                        ReviewDTO dto = new ReviewDTO();
                        dto.setReviewId(review.getReviewId());
                        dto.setRating(review.getRating());
                        dto.setComment(review.getComment());
                        dto.setCreatedAt(review.getCreatedAt());
                        return dto;
                    }
                })
                .collect(Collectors.toList());
            
            return new PageImpl<>(reviewDTOs, pageable, reviewsPage.getTotalElements());
        } catch (Exception e) {
            // Return empty page if query fails
            return Page.empty(pageable);
        }
    }

    /**
     * Get reviews by seller
     * @param sellerId the seller ID
     * @return list of reviews for the seller's listings
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsBySellerId(Long sellerId) {
        return reviewRepository.findBySellerId(sellerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get reviews by buyer
     * @param buyerId the buyer ID
     * @return list of reviews written by the buyer
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByBuyerId(Long buyerId) {
        return reviewRepository.findByBuyerId(buyerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get average rating for a listing
     * @param listingId the listing ID
     * @return average rating
     */
    @Transactional(readOnly = true)
    public Double getAverageRatingForListing(Long listingId) {
        return reviewRepository.findAverageRatingByListingId(listingId);
    }

    /**
     * Get average rating for a seller
     * @param sellerId the seller ID
     * @return average rating
     */
    @Transactional(readOnly = true)
    public Double getAverageRatingForSeller(Long sellerId) {
        return reviewRepository.findAverageRatingBySellerId(sellerId);
    }

    /**
     * Get review count for a listing
     * @param listingId the listing ID
     * @return number of reviews
     */
    @Transactional(readOnly = true)
    public long getReviewCountForListing(Long listingId) {
        return reviewRepository.countByListingId(listingId);
    }

    /**
     * Get review count for a seller
     * @param sellerId the seller ID
     * @return number of reviews
     */
    @Transactional(readOnly = true)
    public long getReviewCountForSeller(Long sellerId) {
        return reviewRepository.countBySellerId(sellerId);
    }

    /**
     * Update a review
     * @param reviewId the review ID
     * @param buyerId the buyer ID (for authorization)
     * @param request the updated review data
     * @return updated review DTO
     */
    @Transactional
    public ReviewDTO updateReview(Long reviewId, Long buyerId, CreateReviewRequest request) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));

        // Verify buyer owns the review (through order)
        if (!review.getOrder().getBuyer().getUserId().equals(buyerId)) {
            throw new IllegalArgumentException("You are not authorized to update this review");
        }

        // Only allow updates within a reasonable time frame (e.g., 24 hours)
        if (review.getCreatedAt().isBefore(java.time.LocalDateTime.now().minusHours(24))) {
            throw new IllegalArgumentException("Reviews can only be edited within 24 hours of creation");
        }

        // Update the review
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        Review savedReview = reviewRepository.save(review);

        // Update seller's average rating
        updateSellerAverageRating(review.getOrder().getListing().getSeller().getUserId());

        return convertToDTO(savedReview);
    }

    /**
     * Delete a review
     * @param reviewId the review ID
     * @param buyerId the buyer ID (for authorization)
     */
    @Transactional
    public void deleteReview(Long reviewId, Long buyerId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new IllegalArgumentException("Review not found with id: " + reviewId));

        // Verify buyer owns the review (through order)
        if (!review.getOrder().getBuyer().getUserId().equals(buyerId)) {
            throw new IllegalArgumentException("You are not authorized to delete this review");
        }

        // Only allow deletion within a reasonable time frame (e.g., 24 hours)
        if (review.getCreatedAt().isBefore(java.time.LocalDateTime.now().minusHours(24))) {
            throw new IllegalArgumentException("Reviews can only be deleted within 24 hours of creation");
        }

        Long sellerId = review.getOrder().getListing().getSeller().getUserId();

        reviewRepository.delete(review);

        // Update seller's average rating after deletion
        updateSellerAverageRating(sellerId);
    }

    /**
     * Update seller's average rating (simplified implementation)
     * @param sellerId the seller ID
     */
    @Transactional
    private void updateSellerAverageRating(Long sellerId) {
        Double averageRating = reviewRepository.findAverageRatingBySellerId(sellerId);
        if (averageRating != null) {
            // In a real implementation, you would update the user's avg_rating field
            // For now, we'll just calculate it when needed
        }
    }

    /**
     * Convert Review entity to ReviewDTO
     * @param review the review entity
     * @return ReviewDTO
     */
    private ReviewDTO convertToDTO(Review review) {
        ReviewDTO dto = new ReviewDTO();
        dto.setReviewId(review.getReviewId());
        dto.setOrderId(review.getOrder().getOrderId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt());

        // Convert buyer
        if (review.getOrder().getBuyer() != null) {
            UserDTO buyerDTO = new UserDTO();
            buyerDTO.setUserId(review.getOrder().getBuyer().getUserId());
            buyerDTO.setFullName(review.getOrder().getBuyer().getFullName());
            dto.setBuyer(buyerDTO);
        }

        // Convert listing
        if (review.getOrder().getListing() != null) {
            ListingDTO listingDTO = new ListingDTO();
            listingDTO.setListingId(review.getOrder().getListing().getListingId());
            listingDTO.setTitle(review.getOrder().getListing().getTitle());

            // Convert seller
            if (review.getOrder().getListing().getSeller() != null) {
                UserDTO sellerDTO = new UserDTO();
                sellerDTO.setUserId(review.getOrder().getListing().getSeller().getUserId());
                sellerDTO.setFullName(review.getOrder().getListing().getSeller().getFullName());
                listingDTO.setSeller(sellerDTO);
            }

            dto.setListing(listingDTO);
        }

        return dto;
    }
}