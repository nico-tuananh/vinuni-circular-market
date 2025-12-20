package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.Listing;
import com.vinuni.circularmarket.model.ListingCondition;
import com.vinuni.circularmarket.model.ListingStatus;
import com.vinuni.circularmarket.model.ListingType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ListingRepository extends JpaRepository<Listing, Long> {

    /**
     * Find listings by seller ID
     * @param sellerId the seller ID
     * @return list of listings by the seller
     */
    List<Listing> findBySeller_UserId(Long sellerId);

    /**
     * Find listings by seller ID with pagination
     * @param sellerId the seller ID
     * @param pageable pagination information
     * @return page of listings by the seller
     */
    Page<Listing> findBySeller_UserId(Long sellerId, Pageable pageable);

    /**
     * Find listings by category ID
     * @param categoryId the category ID
     * @return list of listings in the category
     */
    List<Listing> findByCategory_CategoryId(Long categoryId);

    /**
     * Find listings by status
     * @param status the listing status
     * @return list of listings with the specified status
     */
    List<Listing> findByStatus(ListingStatus status);

    /**
     * Find listings by seller ID and status
     * @param sellerId the seller ID
     * @param status the listing status
     * @return list of listings by seller with specified status
     */
    List<Listing> findBySeller_UserIdAndStatus(Long sellerId, ListingStatus status);

    /**
     * Find available listings (for public browsing)
     * @param pageable pagination information
     * @return page of available listings
     */
    Page<Listing> findByStatusOrderByCreatedAtDesc(ListingStatus status, Pageable pageable);

    /**
     * Full-text search on title and description
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of matching listings
     */
    @Query("SELECT l FROM Listing l WHERE l.status = 'AVAILABLE' AND " +
           "(LOWER(l.title) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
           "LOWER(l.description) LIKE LOWER(CONCAT('%', :searchTerm, '%')))")
    Page<Listing> searchListings(@Param("searchTerm") String searchTerm, Pageable pageable);

    /**
     * Advanced filtering with multiple criteria
     * @param categoryId category filter (optional)
     * @param minPrice minimum price filter (optional)
     * @param maxPrice maximum price filter (optional)
     * @param condition condition filter (optional)
     * @param listingType type filter (optional)
     * @param pageable pagination information
     * @return page of filtered listings
     */
    @Query("SELECT l FROM Listing l WHERE l.status = 'AVAILABLE' " +
           "AND (:categoryId IS NULL OR l.category.categoryId = :categoryId) " +
           "AND (:minPrice IS NULL OR l.listPrice >= :minPrice) " +
           "AND (:maxPrice IS NULL OR l.listPrice <= :maxPrice) " +
           "AND (:condition IS NULL OR l.condition = :condition) " +
           "AND (:listingType IS NULL OR l.listingType = :listingType)")
    Page<Listing> findListingsWithFilters(@Param("categoryId") Long categoryId,
                                         @Param("minPrice") BigDecimal minPrice,
                                         @Param("maxPrice") BigDecimal maxPrice,
                                         @Param("condition") ListingCondition condition,
                                         @Param("listingType") ListingType listingType,
                                         Pageable pageable);

    /**
     * Find listings by category with pagination
     * @param categoryId the category ID
     * @param pageable pagination information
     * @return page of listings in the category
     */
    Page<Listing> findByCategory_CategoryIdAndStatus(Long categoryId, ListingStatus status, Pageable pageable);

    /**
     * Count listings by seller
     * @param sellerId the seller ID
     * @return number of listings by the seller
     */
    long countBySeller_UserId(Long sellerId);

    /**
     * Count available listings by seller
     * @param sellerId the seller ID
     * @return number of available listings by the seller
     */
    long countBySeller_UserIdAndStatus(Long sellerId, ListingStatus status);

    /**
     * Find listings that can be updated (only available listings)
     * @param listingId the listing ID
     * @param sellerId the seller ID
     * @return the listing if it can be updated
     */
    @Query("SELECT l FROM Listing l WHERE l.listingId = :listingId AND l.seller.userId = :sellerId AND l.status = 'AVAILABLE'")
    Listing findUpdatableListing(@Param("listingId") Long listingId, @Param("sellerId") Long sellerId);

    /**
     * Find listings that can be deleted (only available listings)
     * @param listingId the listing ID
     * @param sellerId the seller ID
     * @return the listing if it can be deleted
     */
    @Query("SELECT l FROM Listing l WHERE l.listingId = :listingId AND l.seller.userId = :sellerId AND l.status = 'AVAILABLE'")
    Listing findDeletableListing(@Param("listingId") Long listingId, @Param("sellerId") Long sellerId);

    /**
     * Find recently created listings (last 30 days)
     * @param pageable pagination information
     * @return page of recent listings
     */
    @Query("SELECT l FROM Listing l WHERE l.status = 'AVAILABLE' AND l.createdAt >= :thirtyDaysAgo ORDER BY l.createdAt DESC")
    Page<Listing> findRecentListings(@Param("thirtyDaysAgo") java.time.LocalDateTime thirtyDaysAgo, Pageable pageable);

    /**
     * Count listings by status
     * @param status the listing status
     * @return number of listings with the specified status
     */
    long countByStatus(ListingStatus status);
}