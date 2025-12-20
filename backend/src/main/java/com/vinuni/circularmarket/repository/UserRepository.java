package com.vinuni.circularmarket.repository;

import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.model.UserRole;
import com.vinuni.circularmarket.model.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Find user by email
     * @param email the email to search for
     * @return Optional containing the user if found
     */
    Optional<User> findByEmail(String email);

    /**
     * Check if user exists by email
     * @param email the email to check
     * @return true if user exists, false otherwise
     */
    boolean existsByEmail(String email);

    /**
     * Find users by role
     * @param role the role to filter by
     * @return list of users with the specified role
     */
    List<User> findByRole(UserRole role);

    /**
     * Find users by status
     * @param status the status to filter by
     * @return list of users with the specified status
     */
    List<User> findByStatus(UserStatus status);

    /**
     * Find users by role and status
     * @param role the role to filter by
     * @param status the status to filter by
     * @return list of users with the specified role and status
     */
    List<User> findByRoleAndStatus(UserRole role, UserStatus status);

    /**
     * Count users by role
     * @param role the role to count
     * @return number of users with the specified role
     */
    long countByRole(UserRole role);

    /**
     * Find active users (for admin operations)
     * @return list of active users
     */
    @Query("SELECT u FROM User u WHERE u.status = :status ORDER BY u.createdAt DESC")
    List<User> findActiveUsers(@Param("status") UserStatus status);

    /**
     * Search users by name or email (case insensitive)
     * @param searchTerm the search term
     * @return list of users matching the search term
     */
    @Query("SELECT u FROM User u WHERE LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchTerm, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :searchTerm, '%'))")
    List<User> searchUsers(@Param("searchTerm") String searchTerm);

    /**
     * Get user registration statistics by date range
     * @param startDate start date
     * @param endDate end date
     * @return list of daily registration statistics
     */
    @Query("SELECT DATE(u.createdAt) as date, COUNT(u) as count FROM User u WHERE u.createdAt BETWEEN :startDate AND :endDate GROUP BY DATE(u.createdAt) ORDER BY DATE(u.createdAt)")
    List<Object[]> getRegistrationStatsByDateRange(@Param("startDate") java.time.LocalDateTime startDate, @Param("endDate") java.time.LocalDateTime endDate);
}