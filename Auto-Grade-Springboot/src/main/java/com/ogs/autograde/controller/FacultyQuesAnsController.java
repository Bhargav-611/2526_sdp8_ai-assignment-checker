package com.ogs.autograde.controller;


import com.ogs.autograde.DTO.CreateFacultyQuesAnsDto;
import com.ogs.autograde.models.FacultyQuesAns;
import com.ogs.autograde.services.FacultyQuesAnsServicesImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/facultyquesans")
public class FacultyQuesAnsController {
    final private FacultyQuesAnsServicesImp facultyQuesAnsServicesImp;

    public FacultyQuesAnsController(@Autowired FacultyQuesAnsServicesImp facultyQuesAnsServicesImp) {
        this.facultyQuesAnsServicesImp = facultyQuesAnsServicesImp;
    }

    @PostMapping
    ResponseEntity<?> createFacultyQuesAns(@RequestBody CreateFacultyQuesAnsDto createFacultyQuesAnsDto)
    {
        FacultyQuesAns facultyQuesAns = facultyQuesAnsServicesImp.createFacultyQuesAns(createFacultyQuesAnsDto);
        if(facultyQuesAns == null)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        else
        {
            return ResponseEntity.ok(facultyQuesAns);
        }
    }
}
