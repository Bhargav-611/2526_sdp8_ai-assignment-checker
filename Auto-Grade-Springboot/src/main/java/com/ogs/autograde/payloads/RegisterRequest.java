package com.ogs.autograde.payloads;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // ROLE_TEACHER or ROLE_STUDENT
    
    // Additional fields for Faculty
    private String department;
    private String designation;
    private String qualification;
    private Integer experienceYears;
    
    // Additional fields for Student
    private String rollNumber;
    private String semester;
    private String section;
    private String admissionYear;
}
