package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.AnalyticsDTO;
import com.vinuni.circularmarket.dto.RecentActivityDTO;
import com.vinuni.circularmarket.dto.TopSellerDTO;
import com.vinuni.circularmarket.model.*;
import com.vinuni.circularmarket.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnalyticsService {

    private final UserRepository userRepository;
    private final ListingRepository listingRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final CommentRepository commentRepository;

    public AnalyticsService(UserRepository userRepository,
                           ListingRepository listingRepository,
                           OrderRepository orderRepository,
                           ReviewRepository reviewRepository,
                           CommentRepository commentRepository) {
        this.userRepository = userRepository;
        this.listingRepository = listingRepository;
        this.orderRepository = orderRepository;
        this.reviewRepository = reviewRepository;
        this.commentRepository = commentRepository;
    }

    /**
     * Get comprehensive analytics data for admin dashboard
     * @return AnalyticsDTO with all dashboard statistics
     */
    @Transactional(readOnly = true)
    public AnalyticsDTO getDashboardAnalytics() {
        AnalyticsDTO analytics = new AnalyticsDTO();

        // User statistics
        analytics.setTotalUsers(userRepository.count());
        analytics.setActiveUsers(userRepository.findByStatus(UserStatus.active).size());
        analytics.setInactiveUsers(userRepository.findByStatus(UserStatus.inactive).size());
        analytics.setAdminUsers(userRepository.countByRole(UserRole.admin));
        analytics.setStudentUsers(userRepository.countByRole(UserRole.student));

        // Listing statistics
        analytics.setTotalListings(listingRepository.count());
        analytics.setActiveListings(listingRepository.countByStatus(ListingStatus.AVAILABLE));
        analytics.setReservedListings(listingRepository.countByStatus(ListingStatus.RESERVED));
        analytics.setSoldListings(listingRepository.countByStatus(ListingStatus.SOLD));
        analytics.setBorrowedListings(listingRepository.countByStatus(ListingStatus.BORROWED));

        // Order statistics
        analytics.setTotalOrders(orderRepository.count());
        analytics.setPendingOrders(orderRepository.countByStatus(OrderStatus.REQUESTED));
        analytics.setConfirmedOrders(orderRepository.countByStatus(OrderStatus.CONFIRMED));
        analytics.setCompletedOrders(orderRepository.countByStatus(OrderStatus.COMPLETED));
        analytics.setCancelledOrders(orderRepository.countByStatus(OrderStatus.CANCELLED));

        // Revenue statistics
        analytics.setTotalRevenue(calculateTotalRevenue());
        analytics.setMonthlyRevenue(calculateMonthlyRevenue());
        analytics.setAverageOrderValue(calculateAverageOrderValue());

        // Review statistics
        analytics.setTotalReviews(reviewRepository.count());
        analytics.setAverageRating(calculateOverallAverageRating());

        // Comment statistics
        analytics.setTotalComments(commentRepository.count());

        // Top sellers
        analytics.setTopSellers(getTopSellers(10));

        // Recent activities
        analytics.setRecentActivities(getRecentActivities(20));

        return analytics;
    }

    /**
     * Calculate total revenue from completed orders
     * @return total revenue
     */
    @Transactional(readOnly = true)
    private BigDecimal calculateTotalRevenue() {
        return orderRepository.calculateTotalRevenue();
    }

    /**
     * Calculate monthly revenue (current month)
     * @return monthly revenue
     */
    @Transactional(readOnly = true)
    private BigDecimal calculateMonthlyRevenue() {
        LocalDateTime startOfMonth = LocalDateTime.now().withDayOfMonth(1).withHour(0).withMinute(0).withSecond(0);
        LocalDateTime endOfMonth = startOfMonth.plusMonths(1);
        return orderRepository.calculateRevenueForPeriod(startOfMonth, endOfMonth);
    }

    /**
     * Calculate average order value
     * @return average order value
     */
    @Transactional(readOnly = true)
    private BigDecimal calculateAverageOrderValue() {
        return orderRepository.calculateAverageOrderValue();
    }

    /**
     * Calculate overall average rating across all listings
     * @return overall average rating
     */
    @Transactional(readOnly = true)
    private double calculateOverallAverageRating() {
        // Calculate average rating across all reviews
        long totalReviews = reviewRepository.count();
        if (totalReviews == 0) {
            return 0.0;
        }

        // Get all listing IDs and calculate average across all listings
        List<Long> listingIds = listingRepository.findAll().stream()
                .map(listing -> listing.getListingId())
                .collect(Collectors.toList());

        double totalRating = 0.0;
        int ratedListings = 0;

        for (Long listingId : listingIds) {
            Double listingAvg = reviewRepository.findAverageRatingByListingId(listingId);
            if (listingAvg != null) {
                totalRating += listingAvg;
                ratedListings++;
            }
        }

        return ratedListings > 0 ? totalRating / ratedListings : 0.0;
    }

    /**
     * Get top sellers by completed orders
     * @param limit number of top sellers to return
     * @return list of top sellers
     */
    @Transactional(readOnly = true)
    private List<TopSellerDTO> getTopSellers(int limit) {
        // Query to get top sellers by completed orders
        // This is a simplified implementation - in a real scenario, you'd use a custom query
        List<User> allUsers = userRepository.findByRole(UserRole.student);

        return allUsers.stream()
                .map(user -> {
                    long totalOrders = orderRepository.countBySeller_UserId(user.getUserId());
                    long completedOrders = orderRepository.countBySeller_UserIdAndStatus(user.getUserId(), OrderStatus.COMPLETED);

                    // Calculate actual revenue from completed orders
                    List<Order> completedOrderList = orderRepository.findBySeller_UserIdAndStatus(user.getUserId(), OrderStatus.COMPLETED);
                    BigDecimal revenue = completedOrderList.stream()
                            .map(order -> {
                                // Use finalPrice if available, otherwise use offerPrice
                                return order.getFinalPrice() != null ? order.getFinalPrice() : 
                                       (order.getOfferPrice() != null ? order.getOfferPrice() : BigDecimal.ZERO);
                            })
                            .reduce(BigDecimal.ZERO, BigDecimal::add);

                    // Get seller rating
                    Double avgRating = reviewRepository.findAverageRatingBySellerId(user.getUserId());
                    long reviewCount = reviewRepository.countBySellerId(user.getUserId());

                    return new TopSellerDTO(
                        user.getUserId(),
                        user.getFullName(),
                        user.getEmail(),
                        totalOrders,
                        completedOrders,
                        revenue,
                        avgRating != null ? avgRating : 0.0,
                        reviewCount
                    );
                })
                .filter(dto -> dto.getCompletedOrders() > 0) // Only include users with completed orders
                .sorted((a, b) -> Long.compare(b.getCompletedOrders(), a.getCompletedOrders()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Get recent activities for dashboard
     * @param limit number of activities to return
     * @return list of recent activities
     */
    @Transactional(readOnly = true)
    private List<RecentActivityDTO> getRecentActivities(int limit) {
        List<RecentActivityDTO> activities = new java.util.ArrayList<>();

        // Get recent user registrations
        List<User> recentUsers = userRepository.findAll(org.springframework.data.domain.PageRequest.of(0, limit/3)).getContent();
        for (User user : recentUsers) {
            activities.add(new RecentActivityDTO(
                user.getUserId(),
                "USER_REGISTERED",
                "New user registered: " + user.getFullName(),
                user.getFullName(),
                user.getCreatedAt(),
                "{\"userId\": " + user.getUserId() + "}"
            ));
        }

        // Get recent listings
        List<Listing> recentListings = listingRepository.findAll(org.springframework.data.domain.PageRequest.of(0, limit/3)).getContent();
        for (Listing listing : recentListings) {
            activities.add(new RecentActivityDTO(
                listing.getListingId(),
                "LISTING_CREATED",
                "New listing created: " + listing.getTitle(),
                listing.getSeller().getFullName(),
                listing.getCreatedAt(),
                "{\"listingId\": " + listing.getListingId() + "}"
            ));
        }

        // Get recent orders
        List<Order> recentOrders = orderRepository.findAll(org.springframework.data.domain.PageRequest.of(0, limit/3)).getContent();
        for (Order order : recentOrders) {
            activities.add(new RecentActivityDTO(
                order.getOrderId(),
                "ORDER_" + order.getStatus().toString(),
                "Order " + order.getStatus().toString().toLowerCase() + " for: " + order.getListing().getTitle(),
                order.getBuyer().getFullName(),
                order.getOrderDate(),
                "{\"orderId\": " + order.getOrderId() + ", \"listingId\": " + order.getListing().getListingId() + "}"
            ));
        }

        // Sort by timestamp descending and limit
        return activities.stream()
                .sorted((a, b) -> b.getTimestamp().compareTo(a.getTimestamp()))
                .limit(limit)
                .collect(Collectors.toList());
    }

    /**
     * Get user registration statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return user registration statistics
     */
    @Transactional(readOnly = true)
    public List<Object[]> getUserRegistrationStats(LocalDateTime startDate, LocalDateTime endDate) {
        return userRepository.getRegistrationStatsByDateRange(startDate, endDate);
    }

    /**
     * Get order completion statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return order completion statistics
     */
    @Transactional(readOnly = true)
    public List<Object[]> getOrderStats(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getOrderStatsByDateRange(startDate, endDate);
    }

    /**
     * Get revenue statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return revenue statistics
     */
    @Transactional(readOnly = true)
    public List<Object[]> getRevenueStats(LocalDateTime startDate, LocalDateTime endDate) {
        return orderRepository.getRevenueStatsByDateRange(startDate, endDate);
    }
}
