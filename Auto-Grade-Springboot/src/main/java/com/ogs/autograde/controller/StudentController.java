package com.ogs.autograde.controller;


import com.ogs.autograde.payloads.ApiResponse;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.services.StudentServices;
import org.apache.hc.core5.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/student")
public class StudentController {
    final private StudentServices studentServices;


    public StudentController(@Autowired StudentServices studentServices) {
        this.studentServices = studentServices;
    }

    @PostMapping
    @PreAuthorize("hasRole('STUDENT')")
    public ResponseEntity<?> createStudent(@RequestParam("name") String name)
    {
        Student student = studentServices.createStudent(name);
        if(student == null)
        {
            return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST).build();
        }
        else
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("Student Created Successfully").data(student).build());
        }
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('TEACHER')")
    public ResponseEntity<?> getAllStudents()
    {
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .message("All students retrieved successfully")
                .data(studentServices.getAllStudents())
                .build());
    }

}
