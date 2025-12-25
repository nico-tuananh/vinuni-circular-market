package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.*;
import com.vinuni.circularmarket.model.*;
import com.vinuni.circularmarket.repository.ListingRepository;
import com.vinuni.circularmarket.repository.OrderRepository;
import com.vinuni.circularmarket.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final ListingRepository listingRepository;
    private final ListingService listingService;
    private final UserRepository userRepository;

    public OrderService(OrderRepository orderRepository,
                       ListingRepository listingRepository,
                       ListingService listingService,
                       UserRepository userRepository) {
        this.orderRepository = orderRepository;
        this.listingRepository = listingRepository;
        this.listingService = listingService;
        this.userRepository = userRepository;
    }

    /**
     * Create a new order request
     * @param buyerId the buyer ID
     * @param request the order creation request
     * @return created order DTO
     */
    @Transactional
    public OrderDTO createOrder(Long buyerId, CreateOrderRequest request) {
        try {
            System.out.println("OrderService.createOrder called - buyerId: " + buyerId + ", listingId: " + request.getListingId() + ", offerPrice: " + request.getOfferPrice());
            
        // Validate listing exists and is available
        Listing listing = listingRepository.findById(request.getListingId())
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + request.getListingId()));

            System.out.println("Listing found: " + listing.getListingId() + ", status: " + listing.getStatus());

        if (listing.getStatus() != ListingStatus.AVAILABLE) {
            throw new IllegalArgumentException("Listing is not available for ordering");
        }

            // Access seller to ensure it's loaded (LAZY loading)
            User seller = listing.getSeller();
            if (seller == null) {
                throw new IllegalArgumentException("Listing seller information is missing");
            }
            System.out.println("Seller found: " + seller.getUserId());

            // Prevent seller from ordering their own listing
            if (seller.getUserId().equals(buyerId)) {
                throw new IllegalArgumentException("You cannot order your own listing");
            }

        // Check if buyer already has an active order for this listing
        List<Order> activeOrders = orderRepository.findActiveOrdersByListingId(request.getListingId());
        boolean buyerHasActiveOrder = activeOrders.stream()
                    .anyMatch(order -> {
                        User orderBuyer = order.getBuyer();
                        return orderBuyer != null && orderBuyer.getUserId().equals(buyerId);
                    });

        if (buyerHasActiveOrder) {
            throw new IllegalArgumentException("You already have an active order for this listing");
        }

            // Fetch buyer from database
            User buyer = userRepository.findById(buyerId)
                    .orElseThrow(() -> new IllegalArgumentException("Buyer not found with id: " + buyerId));

            System.out.println("Buyer found: " + buyer.getUserId() + ", creating order...");

            // Validate offerPrice is not null
            if (request.getOfferPrice() == null) {
                throw new IllegalArgumentException("Offer price is required");
            }

        Order order = new Order(listing, buyer, request.getOfferPrice());
            System.out.println("Order created, saving...");
        Order savedOrder = orderRepository.save(order);
            System.out.println("Order saved successfully: " + savedOrder.getOrderId());

        return convertToDTO(savedOrder);
        } catch (IllegalArgumentException e) {
            System.err.println("OrderService IllegalArgumentException: " + e.getMessage());
            throw e;
        } catch (Exception e) {
            System.err.println("OrderService Exception: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to create order: " + e.getMessage(), e);
        }
    }

    /**
     * Confirm an order (seller action)
     * @param orderId the order ID
     * @param sellerId the seller ID (for authorization)
     * @return updated order DTO
     */
    @Transactional
    public OrderDTO confirmOrder(Long orderId, Long sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        // Verify seller owns the listing
        if (!order.getListing().getSeller().getUserId().equals(sellerId)) {
            throw new IllegalArgumentException("You are not authorized to confirm this order");
        }

        // Check order status
        if (order.getStatus() != OrderStatus.REQUESTED) {
            throw new IllegalArgumentException("Order cannot be confirmed. Current status: " + order.getStatus());
        }

        // Update order
        order.setStatus(OrderStatus.CONFIRMED);
        order.setConfirmedAt(LocalDateTime.now());
        order.setFinalPrice(order.getOfferPrice()); // For simplicity, use offer price as final price

        // Set borrow due date if it's a lend listing (7 days from now)
        if (order.getListing().getListingType() == ListingType.LEND) {
            order.setBorrowDueDate(LocalDateTime.now().plusDays(7));
        }

        // Update listing status
        ListingStatus newListingStatus = (order.getListing().getListingType() == ListingType.LEND) ?
                ListingStatus.BORROWED : ListingStatus.SOLD;
        listingService.updateListingStatus(order.getListing().getListingId(), newListingStatus);

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    /**
     * Reject an order (seller action)
     * @param orderId the order ID
     * @param sellerId the seller ID (for authorization)
     * @return updated order DTO
     */
    @Transactional
    public OrderDTO rejectOrder(Long orderId, Long sellerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        // Verify seller owns the listing
        if (!order.getListing().getSeller().getUserId().equals(sellerId)) {
            throw new IllegalArgumentException("You are not authorized to reject this order");
        }

        // Check order status
        if (order.getStatus() != OrderStatus.REQUESTED) {
            throw new IllegalArgumentException("Order cannot be rejected. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.REJECTED);
        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    /**
     * Cancel an order (buyer action)
     * @param orderId the order ID
     * @param buyerId the buyer ID (for authorization)
     * @return updated order DTO
     */
    @Transactional
    public OrderDTO cancelOrder(Long orderId, Long buyerId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        // Verify buyer owns the order
        if (!order.getBuyer().getUserId().equals(buyerId)) {
            throw new IllegalArgumentException("You are not authorized to cancel this order");
        }

        // Check order status - can only cancel requested or confirmed orders
        if (order.getStatus() != OrderStatus.REQUESTED && order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Order cannot be cancelled. Current status: " + order.getStatus());
        }

        order.setStatus(OrderStatus.CANCELLED);

        // If order was confirmed, restore listing to available
        if (order.getStatus() == OrderStatus.CONFIRMED) {
            listingService.updateListingStatus(order.getListing().getListingId(), ListingStatus.AVAILABLE);
        }

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    /**
     * Complete an order (seller action for sales, buyer action for returns)
     * @param orderId the order ID
     * @param userId the user ID (seller for sales, buyer for returns)
     * @return updated order DTO
     */
    @Transactional
    public OrderDTO completeOrder(Long orderId, Long userId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found with id: " + orderId));

        // Check order status
        if (order.getStatus() != OrderStatus.CONFIRMED) {
            throw new IllegalArgumentException("Order cannot be completed. Current status: " + order.getStatus());
        }

        // For lend orders, only buyer can complete (return)
        if (order.getListing().getListingType() == ListingType.LEND) {
            if (!order.getBuyer().getUserId().equals(userId)) {
                throw new IllegalArgumentException("Only the buyer can complete a lend order (return item)");
            }
            order.setReturnedAt(LocalDateTime.now());
            listingService.updateListingStatus(order.getListing().getListingId(), ListingStatus.AVAILABLE);
        } else {
            // For sell orders, only seller can complete
            if (!order.getListing().getSeller().getUserId().equals(userId)) {
                throw new IllegalArgumentException("Only the seller can complete a sell order");
            }
            listingService.updateListingStatus(order.getListing().getListingId(), ListingStatus.SOLD);
        }

        order.setStatus(OrderStatus.COMPLETED);
        order.setCompletedAt(LocalDateTime.now());

        Order savedOrder = orderRepository.save(order);
        return convertToDTO(savedOrder);
    }

    /**
     * Get orders by buyer
     * @param buyerId the buyer ID
     * @return list of orders by buyer
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersByBuyer(Long buyerId) {
        return orderRepository.findByBuyer_UserId(buyerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get orders by seller
     * @param sellerId the seller ID
     * @return list of orders for seller's listings
     */
    @Transactional(readOnly = true)
    public List<OrderDTO> getOrdersBySeller(Long sellerId) {
        return orderRepository.findBySeller_UserId(sellerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get order by ID with authorization check
     * @param orderId the order ID
     * @param userId the user ID (for authorization)
     * @return optional order DTO
     */
    @Transactional(readOnly = true)
    public Optional<OrderDTO> getOrderById(Long orderId, Long userId) {
        return orderRepository.findById(orderId)
                .filter(order -> order.getBuyer().getUserId().equals(userId) ||
                               order.getListing().getSeller().getUserId().equals(userId))
                .map(this::convertToDTO);
    }

    /**
     * Process overdue borrow orders (automatically complete them)
     */
    @Transactional
    public void processOverdueBorrowOrders() {
        LocalDateTime now = LocalDateTime.now();
        List<Order> overdueOrders = orderRepository.findAutoCompletableBorrowOrders(now);

        for (Order order : overdueOrders) {
            order.setStatus(OrderStatus.COMPLETED);
            order.setCompletedAt(now);
            listingService.updateListingStatus(order.getListing().getListingId(), ListingStatus.AVAILABLE);
        }

        if (!overdueOrders.isEmpty()) {
            orderRepository.saveAll(overdueOrders);
        }
    }

    /**
     * Convert Order entity to OrderDTO
     * @param order the order entity
     * @return OrderDTO
     */
    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());

        // Convert listing
        if (order.getListing() != null) {
            ListingDTO listingDTO = new ListingDTO();
            listingDTO.setListingId(order.getListing().getListingId());
            listingDTO.setTitle(order.getListing().getTitle());
            listingDTO.setListPrice(order.getListing().getListPrice());
            listingDTO.setListingType(order.getListing().getListingType());

            // Convert seller
            if (order.getListing().getSeller() != null) {
                UserDTO sellerDTO = new UserDTO();
                sellerDTO.setUserId(order.getListing().getSeller().getUserId());
                sellerDTO.setFullName(order.getListing().getSeller().getFullName());
                listingDTO.setSeller(sellerDTO);
            }

            dto.setListing(listingDTO);
        }

        // Convert buyer
        if (order.getBuyer() != null) {
            UserDTO buyerDTO = new UserDTO();
            buyerDTO.setUserId(order.getBuyer().getUserId());
            buyerDTO.setFullName(order.getBuyer().getFullName());
            dto.setBuyer(buyerDTO);
        }

        dto.setOfferPrice(order.getOfferPrice());
        dto.setFinalPrice(order.getFinalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderDate(order.getOrderDate());
        dto.setConfirmedAt(order.getConfirmedAt());
        dto.setCompletedAt(order.getCompletedAt());
        dto.setBorrowDueDate(order.getBorrowDueDate());
        dto.setReturnedAt(order.getReturnedAt());

        // Convert review if exists
        if (order.getReview() != null) {
            ReviewDTO reviewDTO = new ReviewDTO();
            reviewDTO.setReviewId(order.getReview().getReviewId());
            reviewDTO.setRating(order.getReview().getRating());
            reviewDTO.setComment(order.getReview().getComment());
            reviewDTO.setCreatedAt(order.getReview().getCreatedAt());
            dto.setReview(reviewDTO);
        }

        return dto;
    }
}