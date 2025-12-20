package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.CategoryDTO;
import com.vinuni.circularmarket.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    /**
     * Get all categories (public endpoint)
     * @return list of all categories
     */
    @GetMapping
    public ResponseEntity<?> getAllCategories() {
        try {
            List<CategoryDTO> categories = categoryService.getAllCategories();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve categories");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get categories with pagination (public endpoint)
     * @param page page number (0-based)
     * @param size page size
     * @param sortBy sort field
     * @param sortDir sort direction
     * @return paginated categories
     */
    @GetMapping("/paged")
    public ResponseEntity<?> getCategoriesPaged(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "name") String sortBy,
            @RequestParam(defaultValue = "asc") String sortDir) {

        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("desc") ? Sort.Direction.DESC : Sort.Direction.ASC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<CategoryDTO> categoriesPage = categoryService.getAllCategories(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("categories", categoriesPage.getContent());
            response.put("currentPage", categoriesPage.getNumber());
            response.put("totalItems", categoriesPage.getTotalElements());
            response.put("totalPages", categoriesPage.getTotalPages());
            response.put("pageSize", categoriesPage.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve categories");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get category by ID (public endpoint)
     * @param categoryId the category ID
     * @return category data or error
     */
    @GetMapping("/{categoryId}")
    public ResponseEntity<?> getCategoryById(@PathVariable Long categoryId) {
        try {
            Optional<CategoryDTO> category = categoryService.getCategoryById(categoryId);
            if (category.isPresent()) {
                return ResponseEntity.ok(category.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Category not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve category");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Search categories by name (public endpoint)
     * @param query search query
     * @return matching categories
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchCategories(@RequestParam String query) {
        try {
            if (query == null || query.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Search query is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            List<CategoryDTO> categories = categoryService.searchCategories(query.trim());
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Search failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Create a new category (admin only)
     * @param categoryDTO the category data
     * @return created category or error
     */
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO createdCategory = categoryService.createCategory(categoryDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdCategory);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to create category");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update an existing category (admin only)
     * @param categoryId the category ID
     * @param categoryDTO the updated category data
     * @return updated category or error
     */
    @PutMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateCategory(@PathVariable Long categoryId, @Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            CategoryDTO updatedCategory = categoryService.updateCategory(categoryId, categoryDTO);
            return ResponseEntity.ok(updatedCategory);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update category");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Delete a category (admin only)
     * @param categoryId the category ID
     * @return success message or error
     */
    @DeleteMapping("/{categoryId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteCategory(@PathVariable Long categoryId) {
        try {
            categoryService.deleteCategory(categoryId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "Category deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to delete category");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get categories with listing counts (public endpoint)
     * @return categories with listing counts
     */
    @GetMapping("/with-counts")
    public ResponseEntity<?> getCategoriesWithListingCounts() {
        try {
            List<CategoryDTO> categories = categoryService.getCategoriesWithListingCount();
            return ResponseEntity.ok(categories);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve categories with counts");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}