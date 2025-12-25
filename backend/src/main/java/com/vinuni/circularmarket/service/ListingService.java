package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.*;
import com.vinuni.circularmarket.model.*;
import com.vinuni.circularmarket.repository.CategoryRepository;
import com.vinuni.circularmarket.repository.CommentRepository;
import com.vinuni.circularmarket.repository.ListingRepository;
import com.vinuni.circularmarket.repository.OrderRepository;
import com.vinuni.circularmarket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ListingService {

    private static final Logger logger = LoggerFactory.getLogger(ListingService.class);

    private final ListingRepository listingRepository;
    private final CategoryRepository categoryRepository;
    private final CommentRepository commentRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public ListingService(ListingRepository listingRepository,
                         CategoryRepository categoryRepository,
                         CommentRepository commentRepository,
                         OrderRepository orderRepository,
                         UserRepository userRepository) {
        this.listingRepository = listingRepository;
        this.categoryRepository = categoryRepository;
        this.commentRepository = commentRepository;
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
    }

    /**
     * Get all available listings with pagination
     * @param pageable pagination information
     * @return page of available listings
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getAvailableListings(Pageable pageable) {
        logger.debug("Getting available listings with pageable: {}", pageable);

        var listingPage = listingRepository.findByStatus(ListingStatus.AVAILABLE, pageable);
        logger.debug("Found {} listings from repository", listingPage.getTotalElements());

        var dtoPage = listingPage.map(this::convertToDTO);
        logger.debug("Converted {} listings to DTOs", dtoPage.getContent().size());

        return dtoPage;
    }

    /**
     * Get listing by ID
     * @param listingId the listing ID
     * @return optional listing DTO
     */
    @Transactional(readOnly = true)
    public Optional<ListingDTO> getListingById(Long listingId) {
        return listingRepository.findById(listingId).map(this::convertToDTO);
    }

    /**
     * Get listings by seller ID
     * @param sellerId the seller ID
     * @return list of listings by seller
     */
    @Transactional(readOnly = true)
    public List<ListingDTO> getListingsBySeller(Long sellerId) {
        return listingRepository.findBySeller_UserId(sellerId).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get listings by seller ID with pagination
     * @param sellerId the seller ID
     * @param pageable pagination information
     * @return page of listings by seller
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getListingsBySeller(Long sellerId, Pageable pageable) {
        return listingRepository.findBySeller_UserId(sellerId, pageable).map(this::convertToDTO);
    }

    /**
     * Get listings by category
     * @param categoryId the category ID
     * @param pageable pagination information
     * @return page of listings in category
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getListingsByCategory(Long categoryId, Pageable pageable) {
        return listingRepository.findByCategory_CategoryIdAndStatus(categoryId, ListingStatus.AVAILABLE, pageable)
                .map(this::convertToDTO);
    }

    /**
     * Create a new listing
     * @param sellerId the seller ID
     * @param request the listing creation request
     * @return created listing DTO
     */
    @Transactional
    public ListingDTO createListing(Long sellerId, CreateListingRequest request) {
        logger.info("CREATE OPERATION: Creating new listing - Seller ID: {}, Title: {}, Category ID: {}, Price: {}",
                   sellerId, request.getTitle(), request.getCategoryId(), request.getListPrice());

        try {
            // Validate category exists
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + request.getCategoryId()));

            // Fetch seller from database
            User seller = userRepository.findById(sellerId)
                    .orElseThrow(() -> new IllegalArgumentException("Seller not found with id: " + sellerId));

            Listing listing = new Listing(seller, category, request.getTitle(),
                                        request.getDescription(), request.getCondition(),
                                        request.getListingType(), request.getListPrice());

            // Fallback (if JPA auditing doesn't work): Ensure timestamps are set
            if (listing.getCreatedAt() == null) {
                listing.setCreatedAt(LocalDateTime.now());
            }
            if (listing.getUpdatedAt() == null) {
                listing.setUpdatedAt(LocalDateTime.now());
            }

            Listing savedListing = listingRepository.save(listing);
            logger.info("CREATE OPERATION SUCCESS: Listing created - Listing ID: {}, Seller ID: {}, Title: {}",
                       savedListing.getListingId(), sellerId, savedListing.getTitle());
            return convertToDTO(savedListing);
        } catch (Exception e) {
            logger.error("CREATE OPERATION FAILED: Failed to create listing - Seller ID: {}, Title: {}, Error: {}",
                        sellerId, request.getTitle(), e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Update an existing listing
     * @param listingId the listing ID
     * @param sellerId the seller ID (for authorization)
     * @param request the listing update request
     * @return updated listing DTO
     */
    @Transactional
    public ListingDTO updateListing(Long listingId, Long sellerId, UpdateListingRequest request) {
        // Find listing and verify ownership and status
        Listing listing = listingRepository.findUpdatableListing(listingId, sellerId);
        if (listing == null) {
            throw new IllegalArgumentException("Listing not found or not updatable");
        }

        // Update category if provided
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + request.getCategoryId()));
            listing.setCategory(category);
        }

        // Update other fields if provided
        if (request.getTitle() != null && !request.getTitle().trim().isEmpty()) {
            listing.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            listing.setDescription(request.getDescription());
        }
        if (request.getCondition() != null) {
            listing.setCondition(request.getCondition());
        }
        if (request.getListingType() != null) {
            listing.setListingType(request.getListingType());
        }
        if (request.getListPrice() != null) {
            listing.setListPrice(request.getListPrice());
        }

        Listing savedListing = listingRepository.save(listing);
        return convertToDTO(savedListing);
    }

    /**
     * Delete a listing
     * @param listingId the listing ID
     * @param sellerId the seller ID (for authorization)
     */
    @Transactional
    public void deleteListing(Long listingId, Long sellerId) {
        Listing listing = listingRepository.findDeletableListing(listingId, sellerId);
        if (listing == null) {
            throw new IllegalArgumentException("Listing not found or not deletable");
        }

        listingRepository.delete(listing);
    }

    /**
     * Search listings by title and description
     * @param searchTerm the search term
     * @param pageable pagination information
     * @return page of matching listings
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> searchListings(String searchTerm, Pageable pageable) {
        return listingRepository.searchListings(searchTerm, pageable).map(this::convertToDTO);
    }

    /**
     * Advanced filtering with multiple criteria
     * @param categoryId category filter
     * @param minPrice minimum price filter
     * @param maxPrice maximum price filter
     * @param condition condition filter
     * @param listingType type filter
     * @param pageable pagination information
     * @return page of filtered listings
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> filterListings(Long categoryId, BigDecimal minPrice, BigDecimal maxPrice,
                                         ListingCondition condition, ListingType listingType, Pageable pageable) {
        return listingRepository.findListingsWithFilters(categoryId, minPrice, maxPrice, condition, listingType, pageable)
                .map(this::convertToDTO);
    }

    /**
     * Get recent listings (last 30 days)
     * @param pageable pagination information
     * @return page of recent listings
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getRecentListings(Pageable pageable) {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        return listingRepository.findRecentListings(thirtyDaysAgo, pageable).map(this::convertToDTO);
    }

    /**
     * Update listing status (used by order service)
     * @param listingId the listing ID
     * @param status the new status
     */
    @Transactional
    public void updateListingStatus(Long listingId, ListingStatus status) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));
        listing.setStatus(status);
        listingRepository.save(listing);
    }

    /**
     * Convert Listing entity to ListingDTO
     * @param listing the listing entity
     * @return ListingDTO
     */
    private ListingDTO convertToDTO(Listing listing) {
        logger.debug("Converting listing {} to DTO", listing.getListingId());

        ListingDTO dto = new ListingDTO();
        dto.setListingId(listing.getListingId());

        // Convert seller - force initialization
        try {
            User seller = listing.getSeller();
            if (seller != null) {
                logger.debug("Seller found for listing {}", listing.getListingId());
            UserDTO sellerDTO = new UserDTO();
                sellerDTO.setUserId(seller.getUserId());
                sellerDTO.setFullName(seller.getFullName());
                sellerDTO.setEmail(seller.getEmail());
            dto.setSeller(sellerDTO);
            } else {
                logger.warn("No seller found for listing {}", listing.getListingId());
            }
        } catch (Exception e) {
            logger.error("Error accessing seller for listing {}: {}", listing.getListingId(), e.getMessage());
        }

        // Convert category - force initialization
        try {
            Category category = listing.getCategory();
            if (category != null) {
                logger.debug("Category found for listing {}", listing.getListingId());
            CategoryDTO categoryDTO = new CategoryDTO();
                categoryDTO.setCategoryId(category.getCategoryId());
                categoryDTO.setName(category.getName());
                categoryDTO.setDescription(category.getDescription());
            dto.setCategory(categoryDTO);
            } else {
                logger.warn("No category found for listing {}", listing.getListingId());
            }
        } catch (Exception e) {
            logger.error("Error accessing category for listing {}: {}", listing.getListingId(), e.getMessage());
        }

        dto.setTitle(listing.getTitle());
        dto.setDescription(listing.getDescription());

        dto.setCondition(listing.getCondition());
        dto.setListingType(listing.getListingType());

        dto.setListPrice(listing.getListPrice());
        dto.setStatus(listing.getStatus());
        dto.setCreatedAt(listing.getCreatedAt());
        dto.setUpdatedAt(listing.getUpdatedAt());

        // Count comments
        long commentCount = commentRepository.countByListing_ListingId(listing.getListingId());
        dto.setCommentCount(commentCount);

        logger.debug("Successfully converted listing {} to DTO", listing.getListingId());
        return dto;
    }

    /**
     * Get all listings with pagination for admin moderation
     * @param pageable pagination information
     * @return page of all listings
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getAllListingsPaginated(Pageable pageable) {
        return listingRepository.findAll(pageable).map(this::convertToDTO);
    }

    /**
     * Get listings by status for admin moderation
     * @param status listing status
     * @param pageable pagination information
     * @return page of listings with specified status
     */
    @Transactional(readOnly = true)
    public Page<ListingDTO> getListingsByStatus(ListingStatus status, Pageable pageable) {
        return listingRepository.findByStatus(status).stream()
                .skip(pageable.getOffset())
                .limit(pageable.getPageSize())
                .collect(java.util.stream.Collectors.collectingAndThen(
                    java.util.stream.Collectors.toList(),
                    list -> new org.springframework.data.domain.PageImpl<>(list, pageable, listingRepository.countByStatus(status))
                ))
                .map(this::convertToDTO);
    }

    /**
     * Update listing status as admin (bypasses business rules)
     * @param listingId the listing ID
     * @param status the new status
     * @return updated listing DTO
     */
    @Transactional
    public ListingDTO updateListingStatusAsAdmin(Long listingId, ListingStatus status) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));
        listing.setStatus(status);
        Listing savedListing = listingRepository.save(listing);
        return convertToDTO(savedListing);
    }

    /**
     * Delete listing as admin (bypasses ownership checks)
     * @param listingId the listing ID
     */
    @Transactional
    public void deleteListingAsAdmin(Long listingId) {
        Listing listing = listingRepository.findById(listingId)
                .orElseThrow(() -> new IllegalArgumentException("Listing not found with id: " + listingId));

        // Check if listing has active orders
        long activeOrders = orderRepository.countByListing_ListingIdAndStatusIn(
            listingId, List.of(OrderStatus.REQUESTED, OrderStatus.CONFIRMED));
        if (activeOrders > 0) {
            throw new IllegalStateException("Cannot delete listing with active orders. Cancel orders first.");
        }

        listingRepository.delete(listing);
    }
}