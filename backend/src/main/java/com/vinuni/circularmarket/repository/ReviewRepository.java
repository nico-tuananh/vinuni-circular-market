package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    /**
     * Find review by order ID
     * @param orderId the order ID
     * @return optional review for the order
     */
    Optional<Review> findByOrder_OrderId(Long orderId);

    /**
     * Find reviews by listing ID (through order)
     * @param listingId the listing ID
     * @return list of reviews for the listing
     */
    @Query("SELECT r FROM Review r WHERE r.order.listing.listingId = :listingId ORDER BY r.createdAt DESC")
    List<Review> findByListingId(@Param("listingId") Long listingId);

    /**
     * Find reviews by listing ID with pagination
     * @param listingId the listing ID
     * @param pageable pagination information
     * @return page of reviews for the listing
     */
    @Query("SELECT r FROM Review r WHERE r.order.listing.listingId = :listingId ORDER BY r.createdAt DESC")
    Page<Review> findByListingId(@Param("listingId") Long listingId, Pageable pageable);

    /**
     * Find reviews by seller ID (reviews for seller's listings)
     * @param sellerId the seller ID
     * @return list of reviews for the seller's listings
     */
    @Query("SELECT r FROM Review r WHERE r.order.listing.seller.userId = :sellerId ORDER BY r.createdAt DESC")
    List<Review> findBySellerId(@Param("sellerId") Long sellerId);

    /**
     * Find reviews by seller ID with pagination
     * @param sellerId the seller ID
     * @param pageable pagination information
     * @return page of reviews for the seller's listings
     */
    @Query("SELECT r FROM Review r WHERE r.order.listing.seller.userId = :sellerId ORDER BY r.createdAt DESC")
    Page<Review> findBySellerId(@Param("sellerId") Long sellerId, Pageable pageable);

    /**
     * Find reviews by buyer ID (reviews written by buyer)
     * @param buyerId the buyer ID
     * @return list of reviews written by the buyer
     */
    @Query("SELECT r FROM Review r WHERE r.order.buyer.userId = :buyerId ORDER BY r.createdAt DESC")
    List<Review> findByBuyerId(@Param("buyerId") Long buyerId);

    /**
     * Find reviews by rating
     * @param rating the rating value
     * @return list of reviews with the specified rating
     */
    List<Review> findByRating(Integer rating);

    /**
     * Find reviews by rating range
     * @param minRating minimum rating
     * @param maxRating maximum rating
     * @return list of reviews within the rating range
     */
    List<Review> findByRatingBetween(Integer minRating, Integer maxRating);

    /**
     * Calculate average rating for a listing
     * @param listingId the listing ID
     * @return average rating for the listing
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.order.listing.listingId = :listingId")
    Double findAverageRatingByListingId(@Param("listingId") Long listingId);

    /**
     * Calculate average rating for a seller
     * @param sellerId the seller ID
     * @return average rating for the seller
     */
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.order.listing.seller.userId = :sellerId")
    Double findAverageRatingBySellerId(@Param("sellerId") Long sellerId);

    /**
     * Count reviews for a listing
     * @param listingId the listing ID
     * @return number of reviews for the listing
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.order.listing.listingId = :listingId")
    long countByListingId(@Param("listingId") Long listingId);

    /**
     * Count reviews for a seller
     * @param sellerId the seller ID
     * @return number of reviews for the seller
     */
    @Query("SELECT COUNT(r) FROM Review r WHERE r.order.listing.seller.userId = :sellerId")
    long countBySellerId(@Param("sellerId") Long sellerId);

    /**
     * Check if review exists for order
     * @param orderId the order ID
     * @return true if review exists, false otherwise
     */
    boolean existsByOrder_OrderId(Long orderId);

    /**
     * Find recent reviews (last N reviews)
     * @param limit the maximum number of reviews to return
     * @return list of recent reviews
     */
    @Query("SELECT r FROM Review r ORDER BY r.createdAt DESC")
    List<Review> findRecentReviews(Pageable pageable);
}