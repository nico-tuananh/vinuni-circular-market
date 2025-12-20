package com.vinuni.circularmarket.controller;

import com.vinuni.circularmarket.dto.AuthResponse;
import com.vinuni.circularmarket.dto.LoginRequest;
import com.vinuni.circularmarket.dto.RegisterRequest;
import com.vinuni.circularmarket.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5174", "http://localhost:8010"})
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    /**
     * User login endpoint
     * @param loginRequest the login request containing email and password
     * @return ResponseEntity with AuthResponse or error message
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        System.out.println("🔐 BACKEND LOGIN START: Received login request for email: " + loginRequest.getEmail());
        System.out.println("📤 BACKEND LOGIN REQUEST: Email present: " + (loginRequest.getEmail() != null) +
                          ", Password present: " + (loginRequest.getPassword() != null && !loginRequest.getPassword().isEmpty()));

        try {
            System.out.println("⚙️ BACKEND LOGIN PROCESSING: Calling authService.login()");
            AuthResponse authResponse = authService.login(loginRequest);
            System.out.println("✅ BACKEND LOGIN SUCCESS: Login successful for user: " + loginRequest.getEmail());
            System.out.println("📊 BACKEND LOGIN RESPONSE: Token generated: " + (authResponse.getToken() != null) +
                              ", User ID: " + authResponse.getUserId() +
                              ", Role: " + authResponse.getRole());
            return ResponseEntity.ok(authResponse);
        } catch (Exception e) {
            System.err.println("❌ BACKEND LOGIN ERROR: Login failed for email: " + loginRequest.getEmail());
            System.err.println("❌ BACKEND LOGIN ERROR DETAILS: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid email or password");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }
    }

    /**
     * User registration endpoint
     * @param registerRequest the registration request
     * @return ResponseEntity with AuthResponse or error message
     */
    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        System.out.println("🔐 BACKEND REGISTER START: Received register request for email: " + registerRequest.getEmail());
        System.out.println("📤 BACKEND REGISTER REQUEST: Full name: " + registerRequest.getFullName() +
                          ", Email: " + registerRequest.getEmail() +
                          ", Password present: " + (registerRequest.getPassword() != null && !registerRequest.getPassword().isEmpty()) +
                          ", Phone: " + registerRequest.getPhone() +
                          ", Address: " + registerRequest.getAddress());

        try {
            System.out.println("⚙️ BACKEND REGISTER PROCESSING: Calling authService.register()");
            AuthResponse authResponse = authService.register(registerRequest);
            System.out.println("✅ BACKEND REGISTER SUCCESS: Registration successful for user: " + registerRequest.getEmail());
            System.out.println("📊 BACKEND REGISTER RESPONSE: Token generated: " + (authResponse.getToken() != null) +
                              ", User ID: " + authResponse.getUserId() +
                              ", Role: " + authResponse.getRole());
            return ResponseEntity.status(HttpStatus.CREATED).body(authResponse);
        } catch (IllegalArgumentException e) {
            System.err.println("❌ BACKEND REGISTER VALIDATION ERROR: " + e.getMessage());
            Map<String, String> error = new HashMap<>();
            error.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        } catch (Exception e) {
            System.err.println("❌ BACKEND REGISTER ERROR: Registration failed for email: " + registerRequest.getEmail());
            System.err.println("❌ BACKEND REGISTER ERROR DETAILS: " + e.getClass().getSimpleName() + ": " + e.getMessage());
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("message", "Registration failed. Please try again.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Token refresh endpoint
     * @param requestBody containing refreshToken
     * @return ResponseEntity with new AuthResponse or error message
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody Map<String, String> requestBody) {
        try {
            String refreshToken = requestBody.get("refreshToken");
            if (refreshToken == null || refreshToken.trim().isEmpty()) {
                Map<String, String> error = new HashMap<>();
                error.put("message", "Refresh token is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
            }

            AuthResponse authResponse = authService.refreshToken(refreshToken);
            return ResponseEntity.ok(authResponse);
        } catch (IllegalArgumentException e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Invalid refresh token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Token refresh failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * User logout endpoint
     * @return ResponseEntity with success message
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        try {
            authService.logout();
            Map<String, String> response = new HashMap<>();
            response.put("message", "Logged out successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("message", "Logout failed");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
        }
    }

    /**
     * Health check endpoint
     * @return ResponseEntity with health status
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "VinUni Circular Market Auth Service");
        return ResponseEntity.ok(response);
    }
}