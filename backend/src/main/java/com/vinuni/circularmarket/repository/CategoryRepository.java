package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    /**
     * Find category by name (case-insensitive)
     * @param name the category name
     * @return Optional containing the category if found
     */
    Optional<Category> findByNameIgnoreCase(String name);

    /**
     * Check if category exists by name (case-insensitive)
     * @param name the category name
     * @return true if category exists, false otherwise
     */
    boolean existsByNameIgnoreCase(String name);

    /**
     * Find categories by name containing (case-insensitive)
     * @param name the name to search for
     * @return list of matching categories
     */
    List<Category> findByNameContainingIgnoreCase(String name);

    /**
     * Find all categories ordered by name
     * @return list of categories ordered by name
     */
    List<Category> findAllByOrderByNameAsc();

    /**
     * Find categories with listing count
     * @return list of categories with their listing counts
     */
    @Query("SELECT c FROM Category c LEFT JOIN FETCH c.listings ORDER BY SIZE(c.listings) DESC, c.name ASC")
    List<Category> findAllWithListingCount();

    /**
     * Find categories that have active listings
     * @return list of categories with active listings
     */
    @Query("SELECT DISTINCT c FROM Category c JOIN c.listings l WHERE l.status = 'AVAILABLE' ORDER BY c.name ASC")
    List<Category> findCategoriesWithActiveListings();

    /**
     * Count listings for a specific category
     * @param categoryId the category ID
     * @return number of listings in the category
     */
    @Query("SELECT COUNT(l) FROM Listing l WHERE l.category.categoryId = :categoryId")
    long countListingsByCategoryId(@Param("categoryId") Long categoryId);
}