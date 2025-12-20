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
        logger.info("🔐 AUTH SERVICE LOGIN START: Attempting login for email: {}", loginRequest.getEmail());
        logger.debug("📋 AUTH SERVICE LOGIN REQUEST: Email: {}, Password present: {}",
                    loginRequest.getEmail(), loginRequest.getPassword() != null && !loginRequest.getPassword().isEmpty());

        try {
            logger.debug("🔍 AUTH SERVICE LOGIN STEP 1: Checking if user exists in database");
            // First check if user exists
            User user = userRepository.findByEmail(loginRequest.getEmail())
                    .orElse(null);
            if (user == null) {
                logger.warn("❌ AUTH SERVICE LOGIN STEP 1: User not found in database: {}", loginRequest.getEmail());
                throw new RuntimeException("User not found");
            } else {
                logger.info("✅ AUTH SERVICE LOGIN STEP 1: User found - ID: {}, Email: {}, Role: {}, Status: {}",
                           user.getUserId(), user.getEmail(), user.getRole(), user.getStatus());
                logger.debug("🔐 AUTH SERVICE LOGIN STEP 1: Password hash exists: {}", user.getPasswordHash() != null);
            }

            logger.debug("🔐 AUTH SERVICE LOGIN STEP 2: Attempting Spring Security authentication");
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getEmail(),
                    loginRequest.getPassword()
                )
            );
            logger.info("✅ AUTH SERVICE LOGIN STEP 2: Spring Security authentication successful for user: {}", loginRequest.getEmail());

            logger.debug("🔐 AUTH SERVICE LOGIN STEP 3: Setting security context");
            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            logger.debug("👤 AUTH SERVICE LOGIN STEP 3: UserDetails extracted - Username: {}", userDetails.getUsername());

            logger.debug("🔍 AUTH SERVICE LOGIN STEP 4: Fetching complete user data from database");
            // Get user from database to get additional information
            User authenticatedUser = userRepository.findByEmail(userDetails.getUsername())
                    .orElseThrow(() -> new RuntimeException("User not found after authentication"));
            logger.debug("✅ AUTH SERVICE LOGIN STEP 4: User data retrieved - Full name: {}", authenticatedUser.getFullName());

            logger.debug("🔑 AUTH SERVICE LOGIN STEP 5: Generating JWT tokens");
            String token = jwtUtil.generateToken(userDetails);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails);
            logger.debug("✅ AUTH SERVICE LOGIN STEP 5: Tokens generated - Token length: {}, Refresh token length: {}",
                        token != null ? token.length() : 0, refreshToken != null ? refreshToken.length() : 0);

            logger.info("🎉 AUTH SERVICE LOGIN SUCCESS: User logged in - User ID: {}, Email: {}, Role: {}",
                       authenticatedUser.getUserId(), authenticatedUser.getEmail(), authenticatedUser.getRole());

            AuthResponse response = new AuthResponse(token, refreshToken, authenticatedUser.getUserId(), authenticatedUser.getEmail(),
                                   authenticatedUser.getFullName(), authenticatedUser.getRole());
            logger.debug("📤 AUTH SERVICE LOGIN RESPONSE: Response object created successfully");
            return response;
        } catch (Exception e) {
            logger.error("❌ AUTH SERVICE LOGIN FAILED: Login attempt failed for email: {} - Error type: {} - Message: {}",
                       loginRequest.getEmail(), e.getClass().getSimpleName(), e.getMessage());
            logger.debug("🔍 AUTH SERVICE LOGIN FAILURE DETAILS:", e);
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
        logger.info("🔐 AUTH SERVICE REGISTER START: Registering new user - Email: {}, Full Name: {}",
                   registerRequest.getEmail(), registerRequest.getFullName());
        logger.debug("📋 AUTH SERVICE REGISTER REQUEST: Email: {}, Full name: {}, Password present: {}, Phone: {}, Address: {}",
                    registerRequest.getEmail(), registerRequest.getFullName(),
                    registerRequest.getPassword() != null && !registerRequest.getPassword().isEmpty(),
                    registerRequest.getPhone(), registerRequest.getAddress());

        try {
            logger.debug("🔍 AUTH SERVICE REGISTER STEP 1: Validating VinUni email domain");
            // Validate VinUni email domain
            if (!isValidVinUniEmail(registerRequest.getEmail())) {
                logger.warn("❌ AUTH SERVICE REGISTER STEP 1: Invalid VinUni email domain - Email: {}",
                           registerRequest.getEmail());
                throw new IllegalArgumentException("Only VinUni email addresses (@vinuni.edu.vn) are allowed for registration");
            }
            logger.info("✅ AUTH SERVICE REGISTER STEP 1: VinUni email validation passed");

            logger.debug("🔍 AUTH SERVICE REGISTER STEP 2: Checking if email already exists");
            // Check if email already exists
            if (userRepository.existsByEmail(registerRequest.getEmail())) {
                logger.warn("❌ AUTH SERVICE REGISTER STEP 2: Email already exists - Email: {}",
                           registerRequest.getEmail());
                throw new IllegalArgumentException("Email address already exists");
            }
            logger.info("✅ AUTH SERVICE REGISTER STEP 2: Email uniqueness check passed");

            logger.debug("👤 AUTH SERVICE REGISTER STEP 3: Creating new user object");
            // Create new user
            User user = new User();
            user.setFullName(registerRequest.getFullName());
            user.setEmail(registerRequest.getEmail());
            String encodedPassword = passwordEncoder.encode(registerRequest.getPassword());
            logger.debug("🔐 AUTH SERVICE REGISTER STEP 3: Password encoded - Original length: {}, Encoded length: {}",
                        registerRequest.getPassword().length(), encodedPassword.length());
            user.setPasswordHash(encodedPassword);
            user.setPhone(registerRequest.getPhone());
            user.setAddress(registerRequest.getAddress());
            user.setStatus(UserStatus.active);
            logger.debug("✅ AUTH SERVICE REGISTER STEP 3: User object created with all fields set");

            logger.debug("💾 AUTH SERVICE REGISTER STEP 4: Saving user to database");
            User savedUser = userRepository.save(user);
            logger.info("✅ AUTH SERVICE REGISTER STEP 4: New user saved - User ID: {}, Email: {}",
                       savedUser.getUserId(), savedUser.getEmail());

            logger.debug("🔑 AUTH SERVICE REGISTER STEP 5: Generating JWT tokens for immediate login");
            // Generate tokens for immediate login after registration
            String token = jwtUtil.generateToken(savedUser.getEmail());
            String refreshToken = jwtUtil.generateRefreshToken(savedUser);
            logger.debug("✅ AUTH SERVICE REGISTER STEP 5: Tokens generated - Token length: {}, Refresh token length: {}",
                        token != null ? token.length() : 0, refreshToken != null ? refreshToken.length() : 0);

            AuthResponse response = new AuthResponse(token, refreshToken, savedUser.getUserId(), savedUser.getEmail(),
                                   savedUser.getFullName(), savedUser.getRole());
            logger.info("🎉 AUTH SERVICE REGISTER SUCCESS: Registration completed - User ID: {}, Email: {}, Role: {}",
                       savedUser.getUserId(), savedUser.getEmail(), savedUser.getRole());
            return response;
        } catch (Exception e) {
            logger.error("❌ AUTH SERVICE REGISTER FAILED: Failed to register user - Email: {}, Error type: {}, Message: {}",
                        registerRequest.getEmail(), e.getClass().getSimpleName(), e.getMessage());
            logger.debug("🔍 AUTH SERVICE REGISTER FAILURE DETAILS:", e);
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
                               user.getFullName(), user.getRole());
    }

    /**
     * Logout user by clearing security context
     */
    public void logout() {
        SecurityContextHolder.clearContext();
    }
}