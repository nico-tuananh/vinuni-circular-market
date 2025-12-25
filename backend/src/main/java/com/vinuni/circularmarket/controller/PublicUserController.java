package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.UserDTO;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010", "https://leon-uninterdicted-traci.ngrok-free.dev"})
public class PublicUserController {

    private final UserService userService;

    public PublicUserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Get user profile by ID (public endpoint)
     * @param userId the user ID
     * @return ResponseEntity with user data or error
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long userId) {
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
            error.put("message", "Failed to retrieve user profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Update current user's own profile (authenticated endpoint)
     * @param requestBody containing fullName, phone, address
     * @return ResponseEntity with updated user data or error
     */
    @PutMapping("/me/profile")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> updateMyProfile(@RequestBody Map<String, String> requestBody) {
        try {
            Long userId = getCurrentUserId();
            String fullName = requestBody.get("fullName");
            String phone = requestBody.get("phone");
            String address = requestBody.get("address");

            UserDTO updatedUser = userService.updateUserProfile(userId, fullName, phone, address);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalStateException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "User not authenticated");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Failed to update profile");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Helper method to get current user ID from security context
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

