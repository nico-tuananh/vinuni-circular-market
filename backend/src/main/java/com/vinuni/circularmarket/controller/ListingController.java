package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.CreateListingRequest;
import com.vinuni.circularmarket.dto.ListingDTO;
import com.vinuni.circularmarket.dto.UpdateListingRequest;
import com.vinuni.circularmarket.model.ListingStatus;
import com.vinuni.circularmarket.model.ListingCondition;
import com.vinuni.circularmarket.model.ListingType;
import com.vinuni.circularmarket.service.ListingService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/listings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class ListingController {

    private final ListingService listingService;

    public ListingController(ListingService listingService) {
        this.listingService = listingService;
    }

    /**
     * Get all available listings with pagination (public endpoint)
     * @param page page number (0-based)
     * @param size page size
     * @param sortBy sort field
     * @param sortDir sort direction
     * @return paginated available listings
     */
    @GetMapping
    public ResponseEntity<?> getAvailableListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<ListingDTO> listingsPage = listingService.getAvailableListings(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());
            response.put("pageSize", listingsPage.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve listings");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get listing by ID (public endpoint)
     * @param listingId the listing ID
     * @return listing data or error
     */
    @GetMapping("/{listingId}")
    public ResponseEntity<?> getListingById(@PathVariable Long listingId) {
        try {
            Optional<ListingDTO> listing = listingService.getListingById(listingId);
            if (listing.isPresent()) {
                return ResponseEntity.ok(listing.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Listing not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve listing");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Search listings by title and description (public endpoint)
     * @param query search query
     * @param page page number
     * @param size page size
     * @return paginated search results
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchListings(
            @RequestParam String query,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        try {
            if (query == null || query.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Search query is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.searchListings(query.trim(), pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());
            response.put("query", query);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Search failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Filter listings with advanced criteria (public endpoint)
     * @param categoryId category filter
     * @param minPrice minimum price
     * @param maxPrice maximum price
     * @param condition condition filter
     * @param listingType type filter
     * @param page page number
     * @param size page size
     * @return filtered listings
     */
    @GetMapping("/filter")
    public ResponseEntity<?> filterListings(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) ListingCondition condition,
            @RequestParam(required = false) ListingType listingType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.filterListings(categoryId, minPrice, maxPrice,
                                                                         condition, listingType, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Filter failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get recent listings (public endpoint)
     * @param page page number
     * @param size page size
     * @return recent listings
     */
    @GetMapping("/recent")
    public ResponseEntity<?> getRecentListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.getRecentListings(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve recent listings");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get listings by category (public endpoint)
     * @param categoryId the category ID
     * @param page page number
     * @param size page size
     * @return listings in category
     */
    @GetMapping("/category/{categoryId}")
    public ResponseEntity<?> getListingsByCategory(
            @PathVariable Long categoryId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "12") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.getListingsByCategory(categoryId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());
            response.put("categoryId", categoryId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve listings by category");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get user's own listings (authenticated endpoint)
     * @param page page number
     * @param size page size
     * @return user's listings
     */
    @GetMapping("/my-listings")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> getMyListings(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        try {
            // In real implementation, get user ID from security context
            Long userId = getCurrentUserId();

            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.getListingsBySeller(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve your listings");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Create a new listing (authenticated endpoint)
     * @param request the listing creation request
     * @return created listing or error
     */
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> createListing(@Valid @RequestBody CreateListingRequest request) {
        try {
            // In real implementation, get user ID from security context
            Long userId = getCurrentUserId();

            ListingDTO createdListing = listingService.createListing(userId, request);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdListing);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create listing");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update an existing listing (authenticated endpoint - owner only)
     * @param listingId the listing ID
     * @param request the listing update request
     * @return updated listing or error
     */
    @PutMapping("/{listingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateListing(@PathVariable Long listingId, @Valid @RequestBody UpdateListingRequest request) {
        try {
            // In real implementation, get user ID from security context
            Long userId = getCurrentUserId();

            ListingDTO updatedListing = listingService.updateListing(listingId, userId, request);
            return ResponseEntity.ok(updatedListing);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update listing");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete a listing (authenticated endpoint - owner only)
     * @param listingId the listing ID
     * @return success message or error
     */
    @DeleteMapping("/{listingId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> deleteListing(@PathVariable Long listingId) {
        try {
            // In real implementation, get user ID from security context
            Long userId = getCurrentUserId();

            listingService.deleteListing(listingId, userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Listing deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete listing");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to get all listings with pagination (for moderation)
     * @param page page number
     * @param size page size
     * @param status filter by status (optional)
     * @return paginated listings for moderation
     */
    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllListingsForModeration(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) ListingStatus status) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage;

            if (status != null) {
                listingsPage = listingService.getListingsByStatus(status, pageable);
            } else {
                listingsPage = listingService.getAllListingsPaginated(pageable);
            }

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve listings for moderation");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to force update listing status (moderation)
     * @param listingId the listing ID
     * @param requestBody containing new status
     * @return updated listing or error
     */
    @PutMapping("/admin/{listingId}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateListingStatusAsAdmin(@PathVariable Long listingId, @RequestBody Map<String, String> requestBody) {
        try {
            String statusStr = requestBody.get("status");
            if (statusStr == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            ListingStatus status;
            try {
                status = ListingStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid status. Must be AVAILABLE, RESERVED, SOLD, or BORROWED");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            ListingDTO updatedListing = listingService.updateListingStatusAsAdmin(listingId, status);
            return ResponseEntity.ok(updatedListing);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update listing status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to force delete any listing (moderation)
     * @param listingId the listing ID
     * @return success message or error
     */
    @DeleteMapping("/admin/{listingId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteListingAsAdmin(@PathVariable Long listingId) {
        try {
            listingService.deleteListingAsAdmin(listingId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Listing deleted successfully by admin");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete listing");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Admin endpoint to get listings by user (for investigating user behavior)
     * @param userId the user ID
     * @param page page number
     * @param size page size
     * @return user's listings
     */
    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUserListingsForModeration(
            @PathVariable Long userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {

        try {
            Pageable pageable = PageRequest.of(page, size);
            Page<ListingDTO> listingsPage = listingService.getListingsBySeller(userId, pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("listings", listingsPage.getContent());
            response.put("currentPage", listingsPage.getNumber());
            response.put("totalItems", listingsPage.getTotalElements());
            response.put("totalPages", listingsPage.getTotalPages());
            response.put("userId", userId);

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve user listings");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Helper method to get current user ID from security context
     * In real implementation, this would extract user ID from JWT token
     */
    private Long getCurrentUserId() {
        // Placeholder - in real implementation, extract from JWT token
        // Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        // This would need to be implemented based on your JWT token structure
        return 1L; // Placeholder
    }
}