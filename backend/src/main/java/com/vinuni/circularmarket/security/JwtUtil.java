package com.vinuni.circularmarket.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret:vinuni-circular-market-secret-key-for-jwt-tokens-that-is-at-least-256-bits}")
    private String secret;

    @Value("${jwt.expiration:86400000}") // 24 hours in milliseconds
    private long jwtExpiration;

    @Value("${jwt.refresh-expiration:604800000}") // 7 days in milliseconds
    private long refreshExpiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generate JWT token for user
     * @param userDetails the user details
     * @return JWT token string
     */
    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername(), jwtExpiration);
    }

    /**
     * Generate JWT token for username
     * @param username the username (email)
     * @return JWT token string
     */
    public String generateToken(String username) {
        return generateToken(username, jwtExpiration);
    }

    /**
     * Generate JWT token with custom expiration
     * @param username the username (email)
     * @param expirationTime the expiration time in milliseconds
     * @return JWT token string
     */
    private String generateToken(String username, long expirationTime) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + expirationTime))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Generate refresh token
     * @param userDetails the user details
     * @return refresh token string
     */
    public String generateRefreshToken(UserDetails userDetails) {
        return generateToken(userDetails.getUsername(), refreshExpiration);
    }

    /**
     * Extract username from JWT token
     * @param token the JWT token
     * @return username (email)
     */
    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extract expiration date from JWT token
     * @param token the JWT token
     * @return expiration date
     */
    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extract specific claim from JWT token
     * @param token the JWT token
     * @param claimsResolver function to extract the claim
     * @return the claim value
     */
    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    /**
     * Extract all claims from JWT token
     * @param token the JWT token
     * @return all claims
     */
    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    /**
     * Check if JWT token is expired
     * @param token the JWT token
     * @return true if expired, false otherwise
     */
    public boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    /**
     * Validate JWT token
     * @param token the JWT token
     * @param userDetails the user details
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }

    /**
     * Validate JWT token without user details
     * @param token the JWT token
     * @return true if valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return !isTokenExpired(token);
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    /**
     * Generate token from Authentication object
     * @param authentication the authentication object
     * @return JWT token string
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateToken(userDetails);
    }

    /**
     * Check if token is close to expiration (within 10 minutes)
     * @param token the JWT token
     * @return true if token will expire soon
     */
    public boolean isTokenCloseToExpiration(String token) {
        Date expiration = extractExpiration(token);
        long timeToExpiration = expiration.getTime() - System.currentTimeMillis();
        return timeToExpiration < 600000; // 10 minutes in milliseconds
    }
}