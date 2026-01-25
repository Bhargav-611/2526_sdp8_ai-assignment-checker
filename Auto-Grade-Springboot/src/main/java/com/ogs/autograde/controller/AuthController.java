package com.ogs.autograde.controller;

import com.ogs.autograde.payloads.ApiResponse;
import com.ogs.autograde.payloads.LoginRequest;
import com.ogs.autograde.payloads.LoginResponse;
import com.ogs.autograde.payloads.RegisterRequest;
import com.ogs.autograde.services.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    /**
     * Login endpoint
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            log.info("Login request received for email: {}", loginRequest.getEmail());
            LoginResponse loginResponse = authService.login(loginRequest);
            return ResponseEntity.ok(
                    ApiResponse.builder()
                            .success(true)
                            .message("Login successful")
                            .data(loginResponse)
                            .build()
            );
        } catch (AuthenticationException e) {
            log.error("Authentication failed: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Invalid email or password")
                            .build()
            );
        } catch (Exception e) {
            log.error("Login error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Login failed: " + e.getMessage())
                            .build()
            );
        }
    }

    /**
     * Faculty Registration endpoint
     * POST /api/auth/register/faculty
     */
    @PostMapping("/register/faculty")
    public ResponseEntity<?> registerFaculty(@RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Faculty registration request received for email: {}", registerRequest.getEmail());
            LoginResponse loginResponse = authService.registerFaculty(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.builder()
                            .success(true)
                            .message("Faculty registered successfully")
                            .data(loginResponse)
                            .build()
            );
        } catch (IllegalArgumentException e) {
            log.warn("Faculty registration validation error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build()
            );
        } catch (Exception e) {
            log.error("Faculty registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Registration failed: " + e.getMessage())
                            .build()
            );
        }
    }

    /**
     * Student Registration endpoint
     * POST /api/auth/register/student
     */
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody RegisterRequest registerRequest) {
        try {
            log.info("Student registration request received for email: {}", registerRequest.getEmail());
            LoginResponse loginResponse = authService.registerStudent(registerRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(
                    ApiResponse.builder()
                            .success(true)
                            .message("Student registered successfully")
                            .data(loginResponse)
                            .build()
            );
        } catch (IllegalArgumentException e) {
            log.warn("Student registration validation error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    ApiResponse.builder()
                            .success(false)
                            .message(e.getMessage())
                            .build()
            );
        } catch (Exception e) {
            log.error("Student registration error: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ApiResponse.builder()
                            .success(false)
                            .message("Registration failed: " + e.getMessage())
                            .build()
            );
        }
    }

    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(
                ApiResponse.builder()
                        .success(true)
                        .message("Auth service is running")
                        .build()
        );
    }
}
