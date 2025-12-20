package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.UserDTO;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.model.UserRole;
import com.vinuni.circularmarket.model.UserStatus;
import com.vinuni.circularmarket.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Get user by ID
     * @param userId the user ID
     * @return UserDTO if found
     */
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserById(Long userId) {
        logger.debug("READ OPERATION: Fetching user by ID: {}", userId);
        Optional<UserDTO> userDTO = userRepository.findById(userId).map(this::convertToDTO);
        if (userDTO.isPresent()) {
            logger.debug("READ OPERATION SUCCESS: User found with ID: {}", userId);
        } else {
            logger.warn("READ OPERATION: User not found with ID: {}", userId);
        }
        return userDTO;
    }

    /**
     * Get user by email
     * @param email the email
     * @return UserDTO if found
     */
    @Transactional(readOnly = true)
    public Optional<UserDTO> getUserByEmail(String email) {
        logger.debug("READ OPERATION: Fetching user by email: {}", email);
        Optional<UserDTO> userDTO = userRepository.findByEmail(email).map(this::convertToDTO);
        if (userDTO.isPresent()) {
            logger.debug("READ OPERATION SUCCESS: User found with email: {}", email);
        } else {
            logger.warn("READ OPERATION: User not found with email: {}", email);
        }
        return userDTO;
    }

    /**
     * Get all users with pagination
     * @param pageable pagination information
     * @return page of UserDTOs
     */
    @Transactional(readOnly = true)
    public Page<UserDTO> getAllUsers(Pageable pageable) {
        logger.debug("READ OPERATION: Fetching all users with pagination - Page: {}, Size: {}",
                    pageable.getPageNumber(), pageable.getPageSize());
        Page<UserDTO> users = userRepository.findAll(pageable).map(this::convertToDTO);
        logger.debug("READ OPERATION SUCCESS: Retrieved {} users out of {} total",
                    users.getNumberOfElements(), users.getTotalElements());
        return users;
    }

    /**
     * Get users by status
     * @param status the user status
     * @return list of UserDTOs
     */
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByStatus(UserStatus status) {
        return userRepository.findByStatus(status).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get users by role
     * @param role the user role
     * @return list of UserDTOs
     */
    @Transactional(readOnly = true)
    public List<UserDTO> getUsersByRole(UserRole role) {
        return userRepository.findByRole(role).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Get active users (for admin operations)
     * @return list of active UserDTOs
     */
    @Transactional(readOnly = true)
    public List<UserDTO> getActiveUsers() {
        return userRepository.findActiveUsers(UserStatus.active).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Search users by name or email
     * @param searchTerm the search term
     * @return list of matching UserDTOs
     */
    @Transactional(readOnly = true)
    public List<UserDTO> searchUsers(String searchTerm) {
        return userRepository.searchUsers(searchTerm).stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    /**
     * Update user status (activate/deactivate)
     * @param userId the user ID
     * @param status the new status
     * @return updated UserDTO
     */
    @Transactional
    public UserDTO updateUserStatus(Long userId, UserStatus status) {
        logger.info("UPDATE OPERATION: Updating user status - User ID: {}, New Status: {}", userId, status);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            UserStatus oldStatus = user.getStatus();
            user.setStatus(status);
            User savedUser = userRepository.save(user);

            logger.info("UPDATE OPERATION SUCCESS: User status updated - User ID: {}, Status changed from {} to {}",
                       userId, oldStatus, status);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            logger.error("UPDATE OPERATION FAILED: Failed to update user status - User ID: {}, New Status: {}, Error: {}",
                        userId, status, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Update user role (promote/demote)
     * @param userId the user ID
     * @param role the new role
     * @return updated UserDTO
     */
    @Transactional
    public UserDTO updateUserRole(Long userId, UserRole role) {
        logger.info("UPDATE OPERATION: Updating user role - User ID: {}, New Role: {}", userId, role);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            UserRole oldRole = user.getRole();
            user.setRole(role);
            User savedUser = userRepository.save(user);

            logger.info("UPDATE OPERATION SUCCESS: User role updated - User ID: {}, Role changed from {} to {}",
                       userId, oldRole, role);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            logger.error("UPDATE OPERATION FAILED: Failed to update user role - User ID: {}, New Role: {}, Error: {}",
                        userId, role, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Update user profile information
     * @param userId the user ID
     * @param fullName the new full name
     * @param phone the new phone
     * @param address the new address
     * @return updated UserDTO
     */
    @Transactional
    public UserDTO updateUserProfile(Long userId, String fullName, String phone, String address) {
        logger.info("UPDATE OPERATION: Updating user profile - User ID: {}, Full Name: {}, Phone: {}, Address: {}",
                   userId, fullName, phone, address);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            if (fullName != null && !fullName.trim().isEmpty()) {
                user.setFullName(fullName.trim());
            }
            user.setPhone(phone);
            user.setAddress(address);

            User savedUser = userRepository.save(user);
            logger.info("UPDATE OPERATION SUCCESS: User profile updated - User ID: {}", userId);
            return convertToDTO(savedUser);
        } catch (Exception e) {
            logger.error("UPDATE OPERATION FAILED: Failed to update user profile - User ID: {}, Error: {}",
                        userId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Delete user (soft delete by setting status to inactive)
     * @param userId the user ID
     */
    @Transactional
    public void deleteUser(Long userId) {
        logger.info("DELETE OPERATION: Soft deleting user - User ID: {}", userId);
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + userId));

            user.setStatus(UserStatus.inactive);
            userRepository.save(user);
            logger.info("DELETE OPERATION SUCCESS: User soft deleted - User ID: {}", userId);
        } catch (Exception e) {
            logger.error("DELETE OPERATION FAILED: Failed to delete user - User ID: {}, Error: {}",
                        userId, e.getMessage(), e);
            throw e;
        }
    }

    /**
     * Get user statistics
     * @return map containing user statistics
     */
    @Transactional(readOnly = true)
    public java.util.Map<String, Long> getUserStatistics() {
        java.util.Map<String, Long> stats = new java.util.HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("activeUsers", (long) userRepository.findByStatus(UserStatus.active).size());
        stats.put("inactiveUsers", (long) userRepository.findByStatus(UserStatus.inactive).size());
        stats.put("adminUsers", userRepository.countByRole(UserRole.admin));
        stats.put("studentUsers", userRepository.countByRole(UserRole.student));
        return stats;
    }

    /**
     * Convert User entity to UserDTO
     * @param user the user entity
     * @return UserDTO
     */
    private UserDTO convertToDTO(User user) {
        return new UserDTO(
            user.getUserId(),
            user.getFullName(),
            user.getEmail(),
            user.getPhone(),
            user.getAddress(),
            user.getRole(),
            user.getStatus(),
            user.getCreatedAt(),
            user.getAvgRating(),
            user.getRatingCount()
        );
    }
}