package com.ogs.autograde.services;

import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.models.Role;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.payloads.LoginRequest;
import com.ogs.autograde.payloads.LoginResponse;
import com.ogs.autograde.payloads.RegisterRequest;
import com.ogs.autograde.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final PasswordEncoder passwordEncoder;
    private final FacultyRepo facultyRepo;
    private final StudentRepo studentRepo;

    /**
     * Login user and generate JWT token
     */
    public LoginResponse login(LoginRequest loginRequest) throws AuthenticationException {
        log.info("Authenticating user with email: {}", loginRequest.getEmail());

        // Authenticate using email and password
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        // Generate JWT token
        String token = jwtTokenProvider.generateToken(authentication);
        log.info("Token generated successfully for user: {}", loginRequest.getEmail());

        // Fetch user details
        Optional<Faculty> faculty = facultyRepo.findByEmail(loginRequest.getEmail());
        if (faculty.isPresent()) {
            Faculty f = faculty.get();
            return LoginResponse.builder()
                    .token(token)
                    .id(f.getId())
                    .email(f.getEmail())
                    .name(f.getName())
                    .role(f.getRole().toString())
                    .build();
        }

        Optional<Student> student = studentRepo.findByEmail(loginRequest.getEmail());
        if (student.isPresent()) {
            Student s = student.get();
            return LoginResponse.builder()
                    .token(token)
                    .id(s.getId())
                    .email(s.getEmail())
                    .name(s.getName())
                    .role(s.getRole().toString())
                    .build();
        }

        throw new IllegalArgumentException("User not found");
    }

    /**
     * Register new Faculty
     */
    public LoginResponse registerFaculty(RegisterRequest registerRequest) {
        log.info("Registering new faculty with email: {}", registerRequest.getEmail());

        // Check if email already exists
        if (facultyRepo.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Faculty with this email already exists");
        }

        Faculty faculty = Faculty.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.ROLE_TEACHER)
                .department(registerRequest.getDepartment())
                .designation(registerRequest.getDesignation())
                .qualification(registerRequest.getQualification())
                .experienceYears(registerRequest.getExperienceYears() != null ? registerRequest.getExperienceYears() : 0)
                .build();

        Faculty savedFaculty = facultyRepo.save(faculty);
        log.info("Faculty registered successfully with id: {}", savedFaculty.getId());

        // Generate token for newly registered faculty
        String token = jwtTokenProvider.generateTokenFromUsername(
                savedFaculty.getEmail(),
                savedFaculty.getRole().toString()
        );

        return LoginResponse.builder()
                .token(token)
                .id(savedFaculty.getId())
                .email(savedFaculty.getEmail())
                .name(savedFaculty.getName())
                .role(savedFaculty.getRole().toString())
                .build();
    }

    /**
     * Register new Student
     */
    public LoginResponse registerStudent(RegisterRequest registerRequest) {
        log.info("Registering new student with email: {}", registerRequest.getEmail());

        // Check if email already exists
        if (studentRepo.findByEmail(registerRequest.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Student with this email already exists");
        }

        Student student = Student.builder()
                .name(registerRequest.getName())
                .email(registerRequest.getEmail())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role(Role.ROLE_STUDENT)
                .rollNumber(registerRequest.getRollNumber())
                .department(registerRequest.getDepartment())
                .semester(registerRequest.getSemester())
                .section(registerRequest.getSection())
                .admissionYear(registerRequest.getAdmissionYear())
                .build();

        Student savedStudent = studentRepo.save(student);
        log.info("Student registered successfully with id: {}", savedStudent.getId());

        // Generate token for newly registered student
        String token = jwtTokenProvider.generateTokenFromUsername(
                savedStudent.getEmail(),
                savedStudent.getRole().toString()
        );

        return LoginResponse.builder()
                .token(token)
                .id(savedStudent.getId())
                .email(savedStudent.getEmail())
                .name(savedStudent.getName())
                .role(savedStudent.getRole().toString())
                .build();
    }
}
