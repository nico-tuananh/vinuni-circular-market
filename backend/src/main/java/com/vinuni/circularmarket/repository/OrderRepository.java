package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.Order;
import com.vinuni.circularmarket.model.OrderStatus;

import java.math.BigDecimal;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {

    /**
     * Find orders by buyer ID
     * @param buyerId the buyer ID
     * @return list of orders by the buyer
     */
    List<Order> findByBuyer_UserId(Long buyerId);

    /**
     * Find orders by buyer ID with pagination
     * @param buyerId the buyer ID
     * @param pageable pagination information
     * @return page of orders by the buyer
     */
    Page<Order> findByBuyer_UserId(Long buyerId, Pageable pageable);

    /**
     * Find orders by listing ID
     * @param listingId the listing ID
     * @return list of orders for the listing
     */
    List<Order> findByListing_ListingId(Long listingId);

    /**
     * Find orders by seller ID (through listing)
     * @param sellerId the seller ID
     * @return list of orders for listings by the seller
     */
    @Query("SELECT o FROM Order o WHERE o.listing.seller.userId = :sellerId")
    List<Order> findBySeller_UserId(@Param("sellerId") Long sellerId);

    /**
     * Find orders by seller ID with pagination
     * @param sellerId the seller ID
     * @param pageable pagination information
     * @return page of orders for listings by the seller
     */
    @Query("SELECT o FROM Order o WHERE o.listing.seller.userId = :sellerId")
    Page<Order> findBySeller_UserId(@Param("sellerId") Long sellerId, Pageable pageable);

    /**
     * Find orders by status
     * @param status the order status
     * @return list of orders with the specified status
     */
    List<Order> findByStatus(OrderStatus status);

    /**
     * Find orders by status with pagination
     * @param status the order status
     * @param pageable pagination information
     * @return page of orders with the specified status
     */
    Page<Order> findByStatus(OrderStatus status, Pageable pageable);

    /**
     * Find orders by buyer ID and status
     * @param buyerId the buyer ID
     * @param status the order status
     * @return list of orders by buyer with specified status
     */
    List<Order> findByBuyer_UserIdAndStatus(Long buyerId, OrderStatus status);

    /**
     * Find orders by seller ID and status
     * @param sellerId the seller ID
     * @param status the order status
     * @return list of orders for seller's listings with specified status
     */
    @Query("SELECT o FROM Order o WHERE o.listing.seller.userId = :sellerId AND o.status = :status")
    List<Order> findBySeller_UserIdAndStatus(@Param("sellerId") Long sellerId, @Param("status") OrderStatus status);

    /**
     * Find active orders for a listing (requested or confirmed)
     * @param listingId the listing ID
     * @return list of active orders for the listing
     */
    @Query("SELECT o FROM Order o WHERE o.listing.listingId = :listingId AND o.status IN ('REQUESTED', 'CONFIRMED')")
    List<Order> findActiveOrdersByListingId(@Param("listingId") Long listingId);

    /**
     * Find orders that are overdue for return (borrowing)
     * @param currentDate the current date
     * @return list of overdue orders
     */
    @Query("SELECT o FROM Order o WHERE o.status = 'CONFIRMED' AND o.listing.listingType = 'LEND' AND o.borrowDueDate < :currentDate")
    List<Order> findOverdueBorrowOrders(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Find completed orders that can be reviewed
     * @param buyerId the buyer ID
     * @param listingId the listing ID
     * @return optional order that can be reviewed
     */
    @Query("SELECT o FROM Order o WHERE o.buyer.userId = :buyerId AND o.listing.listingId = :listingId AND o.status = 'COMPLETED' AND o.review IS NULL")
    Optional<Order> findReviewableOrder(@Param("buyerId") Long buyerId, @Param("listingId") Long listingId);

    /**
     * Count orders by buyer
     * @param buyerId the buyer ID
     * @return number of orders by the buyer
     */
    long countByBuyer_UserId(Long buyerId);

    /**
     * Count orders by seller
     * @param sellerId the seller ID
     * @return number of orders for the seller's listings
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.listing.seller.userId = :sellerId")
    long countBySeller_UserId(@Param("sellerId") Long sellerId);

    /**
     * Count orders by status
     * @param status the order status
     * @return number of orders with the specified status
     */
    long countByStatus(OrderStatus status);

    /**
     * Find orders by date range
     * @param startDate the start date
     * @param endDate the end date
     * @return list of orders in the date range
     */
    List<Order> findByOrderDateBetween(LocalDateTime startDate, LocalDateTime endDate);

    /**
     * Find borrow orders that need to be automatically completed (past due date and not returned)
     * @param currentDate the current date
     * @return list of orders to auto-complete
     */
    @Query("SELECT o FROM Order o WHERE o.status = 'CONFIRMED' AND o.listing.listingType = 'LEND' AND o.borrowDueDate < :currentDate AND o.returnedAt IS NULL")
    List<Order> findAutoCompletableBorrowOrders(@Param("currentDate") LocalDateTime currentDate);

    /**
     * Count orders by seller ID and status
     * @param sellerId the seller ID
     * @param status the order status
     * @return number of orders
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.listing.seller.userId = :sellerId AND o.status = :status")
    long countBySeller_UserIdAndStatus(@Param("sellerId") Long sellerId, @Param("status") OrderStatus status);

    /**
     * Count orders by listing ID and status in list
     * @param listingId the listing ID
     * @param statuses list of order statuses
     * @return number of orders
     */
    @Query("SELECT COUNT(o) FROM Order o WHERE o.listing.listingId = :listingId AND o.status IN :statuses")
    long countByListing_ListingIdAndStatusIn(@Param("listingId") Long listingId, @Param("statuses") java.util.List<OrderStatus> statuses);

    /**
     * Calculate total revenue from completed orders
     * @return total revenue
     */
    @Query("SELECT COALESCE(SUM(o.finalPrice), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal calculateTotalRevenue();

    /**
     * Calculate revenue for a specific date range
     * @param startDate start date
     * @param endDate end date
     * @return revenue for the period
     */
    @Query("SELECT COALESCE(SUM(o.finalPrice), 0) FROM Order o WHERE o.status = 'COMPLETED' AND o.completedAt BETWEEN :startDate AND :endDate")
    BigDecimal calculateRevenueForPeriod(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Calculate average order value
     * @return average order value
     */
    @Query("SELECT COALESCE(AVG(o.finalPrice), 0) FROM Order o WHERE o.status = 'COMPLETED'")
    BigDecimal calculateAverageOrderValue();

    /**
     * Get order statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return list of daily order statistics
     */
    @Query("SELECT DATE(o.orderDate) as date, COUNT(o) as count FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate GROUP BY DATE(o.orderDate) ORDER BY DATE(o.orderDate)")
    List<Object[]> getOrderStatsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    /**
     * Get revenue statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return list of daily revenue statistics
     */
    @Query("SELECT DATE(o.completedAt) as date, COALESCE(SUM(o.finalPrice), 0) as revenue FROM Order o WHERE o.status = 'COMPLETED' AND o.completedAt BETWEEN :startDate AND :endDate GROUP BY DATE(o.completedAt) ORDER BY DATE(o.completedAt)")
    List<Object[]> getRevenueStatsByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}