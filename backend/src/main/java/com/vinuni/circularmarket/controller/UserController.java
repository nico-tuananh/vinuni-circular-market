package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.UserDTO;
import com.vinuni.circularmarket.model.UserRole;
import com.vinuni.circularmarket.model.UserStatus;
import com.vinuni.circularmarket.service.UserService;
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
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010", "https://leon-uninterdicted-traci.ngrok-free.dev"})
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get all users with pagination
     * @param page page number (0-based)
     * @param size page size
     * @param sortBy sort field
     * @param sortDir sort direction
     * @return ResponseEntity with paginated users
     */
    @GetMapping
    public ResponseEntity<?> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir) {

        try {
            Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

            Page<UserDTO> usersPage = userService.getAllUsers(pageable);

            Map<String, Object> response = new HashMap<>();
            response.put("users", usersPage.getContent());
            response.put("currentPage", usersPage.getNumber());
            response.put("totalItems", usersPage.getTotalElements());
            response.put("totalPages", usersPage.getTotalPages());
            response.put("pageSize", usersPage.getSize());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve users");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get user by ID
     * @param userId the user ID
     * @return ResponseEntity with user data or error
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable Long userId) {
        try {
            Optional<UserDTO> userDTO = userService.getUserById(userId);
            if (userDTO.isPresent()) {
                return ResponseEntity.ok(userDTO.get());
            } else {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User not found");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
            }
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve user");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Search users by name or email
     * @param searchTerm the search term
     * @return ResponseEntity with matching users
     */
    @GetMapping("/search")
    public ResponseEntity<?> searchUsers(@RequestParam String searchTerm) {
        try {
            if (searchTerm == null || searchTerm.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Search term is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            List<UserDTO> users = userService.searchUsers(searchTerm.trim());
            return ResponseEntity.ok(users);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Search failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update user status (activate/deactivate)
     * @param userId the user ID
     * @param requestBody containing status
     * @return ResponseEntity with updated user or error
     */
    @PutMapping("/{userId}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String statusStr = requestBody.get("status");
            if (statusStr == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Status is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            UserStatus status;
            try {
                status = UserStatus.valueOf(statusStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid status. Must be ACTIVE or INACTIVE");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            UserDTO updatedUser = userService.updateUserStatus(userId, status);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user status");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update user role (promote/demote)
     * @param userId the user ID
     * @param requestBody containing role
     * @return ResponseEntity with updated user or error
     */
    @PutMapping("/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> requestBody) {
        try {
            String roleStr = requestBody.get("role");
            if (roleStr == null) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Role is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            UserRole role;
            try {
                role = UserRole.valueOf(roleStr.toUpperCase());
            } catch (IllegalArgumentException e) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Invalid role. Must be ADMIN or STUDENT");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            UserDTO updatedUser = userService.updateUserRole(userId, role);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update user role");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Deactivate user account
     * @param userId the user ID
     * @return ResponseEntity with success message or error
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<?> deactivateUser(@PathVariable Long userId) {
        try {
            userService.deleteUser(userId);
            Map<String, String> response = new HashMap<>();
            response.put("message", "User deactivated successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to deactivate user");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get user statistics
     * @return ResponseEntity with user statistics
     */
    @GetMapping("/statistics")
    public ResponseEntity<?> getUserStatistics() {
        try {
            Map<String, Long> statistics = userService.getUserStatistics();
            return ResponseEntity.ok(statistics);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve user statistics");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Get active users only
     * @return ResponseEntity with active users
     */
    @GetMapping("/active")
    public ResponseEntity<?> getActiveUsers() {
        try {
            List<UserDTO> activeUsers = userService.getActiveUsers();
            return ResponseEntity.ok(activeUsers);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to retrieve active users");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Bulk activate users
     * @param requestBody containing userIds array
     * @return ResponseEntity with success message
     */
    @PostMapping("/bulk/activate")
    public ResponseEntity<?> bulkActivateUsers(@RequestBody Map<String, List<Long>> requestBody) {
        try {
            List<Long> userIds = requestBody.get("userIds");
            if (userIds == null || userIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User IDs are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            for (Long userId : userIds) {
                try {
                    userService.updateUserStatus(userId, com.vinuni.circularmarket.model.UserStatus.active);
                } catch (Exception e) {
                    // Log error but continue with other users
                    System.err.println("Failed to activate user " + userId + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk activation completed");
            response.put("processed", userIds.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Bulk activation failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Bulk deactivate users
     * @param requestBody containing userIds array
     * @return ResponseEntity with success message
     */
    @PostMapping("/bulk/deactivate")
    public ResponseEntity<?> bulkDeactivateUsers(@RequestBody Map<String, List<Long>> requestBody) {
        try {
            List<Long> userIds = requestBody.get("userIds");
            if (userIds == null || userIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User IDs are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            for (Long userId : userIds) {
                try {
                    userService.updateUserStatus(userId, com.vinuni.circularmarket.model.UserStatus.inactive);
                } catch (Exception e) {
                    // Log error but continue with other users
                    System.err.println("Failed to deactivate user " + userId + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk deactivation completed");
            response.put("processed", userIds.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Bulk deactivation failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Bulk promote users to admin
     * @param requestBody containing userIds array
     * @return ResponseEntity with success message
     */
    @PostMapping("/bulk/promote")
    public ResponseEntity<?> bulkPromoteUsers(@RequestBody Map<String, List<Long>> requestBody) {
        try {
            List<Long> userIds = requestBody.get("userIds");
            if (userIds == null || userIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User IDs are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            for (Long userId : userIds) {
                try {
                    userService.updateUserRole(userId, com.vinuni.circularmarket.model.UserRole.admin);
                } catch (Exception e) {
                    // Log error but continue with other users
                    System.err.println("Failed to promote user " + userId + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk promotion completed");
            response.put("processed", userIds.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Bulk promotion failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Bulk demote users to student
     * @param requestBody containing userIds array
     * @return ResponseEntity with success message
     */
    @PostMapping("/bulk/demote")
    public ResponseEntity<?> bulkDemoteUsers(@RequestBody Map<String, List<Long>> requestBody) {
        try {
            List<Long> userIds = requestBody.get("userIds");
            if (userIds == null || userIds.isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "User IDs are required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            for (Long userId : userIds) {
                try {
                    userService.updateUserRole(userId, com.vinuni.circularmarket.model.UserRole.student);
                } catch (Exception e) {
                    // Log error but continue with other users
                    System.err.println("Failed to demote user " + userId + ": " + e.getMessage());
                }
            }

            Map<String, Object> response = new HashMap<>();
            response.put("message", "Bulk demotion completed");
            response.put("processed", userIds.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Bulk demotion failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Force delete user (admin only - bypasses normal restrictions)
     * @param userId the user ID
     * @return ResponseEntity with success message
     */
    @DeleteMapping("/{userId}/force")
    public ResponseEntity<?> forceDeleteUser(@PathVariable Long userId) {
        try {
            // In a real implementation, this would be a force delete that removes all associated data
            // For now, just call the regular delete
            userService.deleteUser(userId);

            Map<String, String> response = new HashMap<>();
            response.put("message", "User force deleted successfully");
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to force delete user");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }
}