package com.ogs.autograde.controller;


import com.ogs.autograde.DTO.ApiResponse;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.services.IStudentQuesAnsServices;
import com.ogs.autograde.services.IStudentServices;
import com.ogs.autograde.services.StudentAnsQuesServicesImp;
import com.ogs.autograde.services.StudentServicesImp;
import org.apache.hc.core5.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/student")
public class StudentController {
    final private IStudentServices iStudentServices;


    public StudentController(@Autowired IStudentServices iStudentServices) {
        this.iStudentServices = iStudentServices;
    }

    @PostMapping
    public ResponseEntity<?> createStudent(@RequestParam("name") String name)
    {
        Student student = iStudentServices.createStudent(name);
        if(student == null)
        {
            return ResponseEntity.status(HttpStatus.SC_BAD_REQUEST).build();
        }
        else
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("Student Created Successfully").data(student).build());
        }
    }

}
