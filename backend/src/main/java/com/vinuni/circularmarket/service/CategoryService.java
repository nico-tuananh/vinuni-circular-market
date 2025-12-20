package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.CategoryDTO;
import com.vinuni.circularmarket.model.Category;
import com.vinuni.circularmarket.repository.CategoryRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    /**
     * Get all categories
     * @return list of all categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getAllCategories() {
        return categoryRepository.findAllByOrderByNameAsc().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get all categories with pagination
     * @param pageable pagination information
     * @return page of categories
     */
    @Transactional(readOnly = true)
    public Page<CategoryDTO> getAllCategories(Pageable pageable) {
        return categoryRepository.findAll(pageable).map(this::convertToDTO);
    }

    /**
     * Get category by ID
     * @param categoryId the category ID
     * @return optional category DTO
     */
    @Transactional(readOnly = true)
    public Optional<CategoryDTO> getCategoryById(Long categoryId) {
        return categoryRepository.findById(categoryId).map(this::convertToDTO);
    }

    /**
     * Get category by name
     * @param name the category name
     * @return optional category DTO
     */
    @Transactional(readOnly = true)
    public Optional<CategoryDTO> getCategoryByName(String name) {
        return categoryRepository.findByNameIgnoreCase(name).map(this::convertToDTO);
    }

    /**
     * Create a new category
     * @param categoryDTO the category data
     * @return created category DTO
     */
    @Transactional
    public CategoryDTO createCategory(CategoryDTO categoryDTO) {
        // Check if category name already exists
        if (categoryRepository.existsByNameIgnoreCase(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category name already exists: " + categoryDTO.getName());
        }

        Category category = new Category();
        category.setName(categoryDTO.getName().trim());
        category.setDescription(categoryDTO.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    /**
     * Update an existing category
     * @param categoryId the category ID
     * @param categoryDTO the updated category data
     * @return updated category DTO
     */
    @Transactional
    public CategoryDTO updateCategory(Long categoryId, CategoryDTO categoryDTO) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + categoryId));

        // Check if name is being changed and if it conflicts with existing category
        if (!category.getName().equalsIgnoreCase(categoryDTO.getName()) &&
            categoryRepository.existsByNameIgnoreCase(categoryDTO.getName())) {
            throw new IllegalArgumentException("Category name already exists: " + categoryDTO.getName());
        }

        category.setName(categoryDTO.getName().trim());
        category.setDescription(categoryDTO.getDescription());

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    /**
     * Delete a category
     * @param categoryId the category ID
     */
    @Transactional
    public void deleteCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Category not found with id: " + categoryId));

        // Check if category has listings
        long listingCount = categoryRepository.countListingsByCategoryId(categoryId);
        if (listingCount > 0) {
            throw new IllegalStateException("Cannot delete category with existing listings. Category has " + listingCount + " listings.");
        }

        categoryRepository.delete(category);
    }

    /**
     * Search categories by name
     * @param searchTerm the search term
     * @return list of matching categories
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> searchCategories(String searchTerm) {
        return categoryRepository.findByNameContainingIgnoreCase(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get categories with listing counts
     * @return list of categories with listing counts
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesWithListingCount() {
        return categoryRepository.findAllWithListingCount().stream()
                .map(category -> {
                    CategoryDTO dto = convertToDTO(category);
                    dto.setListingCount(categoryRepository.countListingsByCategoryId(category.getCategoryId()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    /**
     * Get categories that have active listings
     * @return list of categories with active listings
     */
    @Transactional(readOnly = true)
    public List<CategoryDTO> getCategoriesWithActiveListings() {
        return categoryRepository.findCategoriesWithActiveListings().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Convert Category entity to CategoryDTO
     * @param category the category entity
     * @return CategoryDTO
     */
    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        return dto;
    }
}