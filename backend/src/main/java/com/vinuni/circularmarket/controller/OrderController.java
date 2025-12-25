package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.CreateOrderRequest;
import com.vinuni.circularmarket.dto.OrderDTO;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.service.OrderService;
import jakarta.validation.Valid;
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
@RequestMapping("/api/orders")
@PreAuthorize("isAuthenticated()")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    /**
     * Create a new order request
     * @param request the order creation request
     * @return created order or error
     */
    @PostMapping
    public ResponseEntity<?> createOrder(@Valid @RequestBody CreateOrderRequest request) {
        try {
            Long buyerId = getCurrentUserId();

            OrderDTO createdOrder = orderService.createOrder(buyerId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdOrder);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            // Log the actual error for debugging
            System.err.println("ERROR creating order: " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create order: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get order by ID (authorized users only)
     * @param orderId the order ID
     * @return order data or error
     */
    @GetMapping("/{orderId}")
    public ResponseEntity<?> getOrderById(@PathVariable Long orderId) {
        try {
            Long userId = getCurrentUserId();

            Optional<OrderDTO> order = orderService.getOrderById(orderId, userId);
            if (order.isPresent()) {
                return ResponseEntity.ok(order.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Order not found or access denied");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get buyer's orders
     * @return list of buyer's orders
     */
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders() {
        try {
            Long buyerId = getCurrentUserId();
            List<OrderDTO> orders = orderService.getOrdersByBuyer(buyerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve your orders");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get seller's orders (orders for their listings)
     * @return list of orders for seller's listings
     */
    @GetMapping("/sales")
    public ResponseEntity<?> getMySales() {
        try {
            Long sellerId = getCurrentUserId();
            List<OrderDTO> orders = orderService.getOrdersBySeller(sellerId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve your sales");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Confirm an order (seller action)
     * @param orderId the order ID
     * @return updated order or error
     */
    @PutMapping("/{orderId}/confirm")
    public ResponseEntity<?> confirmOrder(@PathVariable Long orderId) {
        try {
            Long sellerId = getCurrentUserId();
            OrderDTO updatedOrder = orderService.confirmOrder(orderId, sellerId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to confirm order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Reject an order (seller action)
     * @param orderId the order ID
     * @return updated order or error
     */
    @PutMapping("/{orderId}/reject")
    public ResponseEntity<?> rejectOrder(@PathVariable Long orderId) {
        try {
            Long sellerId = getCurrentUserId();
            OrderDTO updatedOrder = orderService.rejectOrder(orderId, sellerId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to reject order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Cancel an order (buyer action)
     * @param orderId the order ID
     * @return updated order or error
     */
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<?> cancelOrder(@PathVariable Long orderId) {
        try {
            Long buyerId = getCurrentUserId();
            OrderDTO updatedOrder = orderService.cancelOrder(orderId, buyerId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to cancel order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Complete an order (seller for sales, buyer for returns)
     * @param orderId the order ID
     * @return updated order or error
     */
    @PutMapping("/{orderId}/complete")
    public ResponseEntity<?> completeOrder(@PathVariable Long orderId) {
        try {
            Long userId = getCurrentUserId();
            OrderDTO updatedOrder = orderService.completeOrder(orderId, userId);
            return ResponseEntity.ok(updatedOrder);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to complete order");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Process overdue borrow orders (admin/system endpoint)
     * @return success message
     */
    @PostMapping("/process-overdue")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> processOverdueOrders() {
        try {
            orderService.processOverdueBorrowOrders();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Overdue orders processed successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to process overdue orders");
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