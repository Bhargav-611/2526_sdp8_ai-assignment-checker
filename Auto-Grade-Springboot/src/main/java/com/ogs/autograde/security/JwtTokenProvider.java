package com.ogs.autograde.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import io.jsonwebtoken.security.WeakKeyException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;
import java.security.Key;
import java.util.Base64;
import java.util.Date;
import java.util.stream.Collectors;

@Component
@Slf4j
public class JwtTokenProvider {

    @Value("${jwt.secret:}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpirationMs;

    private Key signingKey;

    @PostConstruct
    private void init() {
        if (jwtSecret == null || jwtSecret.isBlank()) {
            // No secret provided → generate a secure ephemeral 512-bit key
            signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
            log.warn("No jwt.secret configured — generated an ephemeral secure key for HS512. "
                    + "Tokens won't survive application restarts. "
                    + "Set `jwt.secret` to a Base64-encoded 512-bit key to persist tokens.");
            return;
        }

        try {
            // Decode Base64 secret
            byte[] keyBytes = Base64.getDecoder().decode(jwtSecret);
            signingKey = Keys.hmacShaKeyFor(keyBytes); // will throw WeakKeyException if too short
        } catch (IllegalArgumentException e) {
            log.error("JWT secret is not valid Base64: {}", e.getMessage());
            generateFallbackKey();
        } catch (WeakKeyException e) {
            log.error("JWT secret is too weak for HS512: {}", e.getMessage());
            generateFallbackKey();
        }
    }

    private void generateFallbackKey() {
        signingKey = Keys.secretKeyFor(SignatureAlgorithm.HS512);
        log.warn("Generated a secure ephemeral key because provided secret was insufficient. "
                + "Use a Base64-encoded 512-bit (or larger) key in `jwt.secret` to persist tokens.");
    }

    private Key getSigningKey() {
        return signingKey;
    }

    // Generate token from Authentication object
    public String generateToken(Authentication authentication) {
        String username = authentication.getName();
        String roles = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(","));

        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Generate token from username and roles
    public String generateTokenFromUsername(String username, String roles) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .setSubject(username)
                .claim("roles", roles)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    // Get username from token
    public String getUsernameFromToken(String token) {
        try {
            return Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .getSubject();
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw e;
        }
    }

    // Get roles from token
    public String getRolesFromToken(String token) {
        try {
            return (String) Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token)
                    .getBody()
                    .get("roles");
        } catch (ExpiredJwtException e) {
            log.error("JWT token is expired: {}", e.getMessage());
            throw e;
        }
    }

    // Validate token
    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder()
                    .setSigningKey(getSigningKey())
                    .build()
                    .parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            log.error("Invalid JWT token: {}", e.getMessage());
        } catch (ExpiredJwtException e) {
            log.error("Expired JWT token: {}", e.getMessage());
        } catch (UnsupportedJwtException e) {
            log.error("Unsupported JWT token: {}", e.getMessage());
        } catch (IllegalArgumentException e) {
            log.error("JWT claims string is empty: {}", e.getMessage());
        }
        return false;
    }
}