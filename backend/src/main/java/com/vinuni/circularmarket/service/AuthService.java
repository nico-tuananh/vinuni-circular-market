package com.vinuni.circularmarket.service;

import com.vinuni.circularmarket.dto.AuthResponse;
import com.vinuni.circularmarket.dto.LoginRequest;
import com.vinuni.circularmarket.dto.RegisterRequest;
import com.vinuni.circularmarket.model.User;
import com.vinuni.circularmarket.model.UserStatus;
import com.vinuni.circularmarket.repository.UserRepository;
import com.vinuni.circularmarket.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthService.class);

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // VinUni email domain pattern
    private static final Pattern VINUNI_EMAIL_PATTERN = Pattern.compile("^[a-zA-Z0-9._%+-]+@vinuni\\.edu\\.vn$");

    public AuthService(AuthenticationManager authenticationManager,
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder,
                      JwtUtil jwtUtil) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Authenticate user and generate JWT tokens
     * @param loginRequest the login request containing email and password
     * @return AuthResponse containing tokens and user information
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest loginRequest) {
        logger.info("🔐 LOGIN START: Attempting login for email: {}", loginRequest.getEmail());

        try {
            // Check if user exists
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElse(null);
            if (user == null) {
                logger.warn("❌ LOGIN FAILED: User not found: {}", loginRequest.getEmail());
                throw new RuntimeException("User not found");
            }

            // Attempt Spring Security authentication
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Get complete user data
            User authenticatedUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));

            // Generate JWT tokens
            String token = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);

            logger.info("✅ LOGIN SUCCESS: User logged in - User ID: {}, Email: {}, Role: {}",
                       authenticatedUser.getUserId(), authenticatedUser.getEmail(), authenticatedUser.getRole());

            AuthResponse response = new AuthResponse(token, refreshToken, authenticatedUser.getUserId(), authenticatedUser.getEmail(),
                                   authenticatedUser.getFullName(), authenticatedUser.getRole(), authenticatedUser.getCreatedAt(),
                                   authenticatedUser.getPhone(), authenticatedUser.getAddress(), authenticatedUser.getStatus(),
                                   authenticatedUser.getAvgRating(), authenticatedUser.getRatingCount());
            return response;
        } catch (Exception e) {
            logger.error("❌ LOGIN FAILED: Login attempt failed for email: {} - Error: {}",
                       loginRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    /**
     * Register a new user with VinUni email validation
     * @param registerRequest the registration request
     * @return AuthResponse containing tokens and user information
     */
    @Transactional
    public AuthResponse register(RegisterRequest registerRequest) {
        logger.info("🔐 REGISTER START: Registering new user - Email: {}, Full Name: {}",
                   registerRequest.getEmail(), registerRequest.getFullName());

        try {
            // Validate VinUni email domain
            if (!isValidVinUniEmail(registerRequest.getEmail())) {
                logger.warn("❌ REGISTER FAILED: Invalid VinUni email domain - Email: {}",
                           registerRequest.getEmail());
                throw new IllegalArgumentException("Only VinUni email addresses (@vinuni.edu.vn) are allowed for registration");
            }

            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                logger.warn("❌ REGISTER FAILED: Email already exists - Email: {}",
                           registerRequest.getEmail());
                throw new IllegalArgumentException("Email address already exists");
            }

            // Create new user
            User user = new User();
            user.setFullName(registerRequest.getFullName());
            user.setEmail(registerRequest.getEmail());
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            user.setPasswordHash(encodedPassword);
            user.setPhone(registerRequest.getPhone());
            user.setAddress(registerRequest.getAddress());
            user.setStatus(UserStatus.active);

            User savedUser = userRepository.save(user);

            // Generate tokens for immediate login after registration
            String token = jwtUtil.generateToken(savedUser.getEmail());
            String refreshToken = jwtUtil.generateRefreshToken(savedUser);

            logger.info("✅ REGISTER SUCCESS: Registration completed - User ID: {}, Email: {}, Role: {}",
                       savedUser.getUserId(), savedUser.getEmail(), savedUser.getRole());

            AuthResponse response = new AuthResponse(token, refreshToken, savedUser.getUserId(), savedUser.getEmail(),
                                   savedUser.getFullName(), savedUser.getRole(), savedUser.getCreatedAt(),
                                   savedUser.getPhone(), savedUser.getAddress(), savedUser.getStatus(),
                                   savedUser.getAvgRating(), savedUser.getRatingCount());
            return response;
        } catch (Exception e) {
            logger.error("❌ REGISTER FAILED: Failed to register user - Email: {}, Error: {}",
                        registerRequest.getEmail(), e.getMessage());
            throw e;
        }
    }

    /**
     * Validate if the email is a valid VinUni email
     * @param email the email to validate
     * @return true if valid VinUni email, false otherwise
     */
    private boolean isValidVinUniEmail(String email) {
        if (email == null) {
            return false;
        }
        return VINUNI_EMAIL_PATTERN.matcher(email).matches();
    }

    /**
     * Refresh JWT token using refresh token
     * @param refreshToken the refresh token
     * @return AuthResponse with new tokens
     */
    @Transactional(readOnly = true)
    public AuthResponse refreshToken(String refreshToken) {
        if (!jwtUtil.validateToken(refreshToken)) {
            throw new IllegalArgumentException("Invalid refresh token");
        }

        String username = jwtUtil.extractUsername(refreshToken);
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found for token refresh"));

        String newToken = jwtUtil.generateToken(user.getEmail());
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        return new AuthResponse(newToken, newRefreshToken, user.getUserId(), user.getEmail(),
                               user.getFullName(), user.getRole(), user.getCreatedAt(),
                               user.getPhone(), user.getAddress(), user.getStatus(),
                               user.getAvgRating(), user.getRatingCount());
    }

    /**
     * Logout user by clearing security context
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}