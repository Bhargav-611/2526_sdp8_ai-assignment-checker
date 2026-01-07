package com.ogs.autograde.controller;


import com.ogs.autograde.DTO.CreateFacultyDto;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.services.IFacultyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    final private IFacultyServices iFacultyServices;


    public FacultyController(@Autowired  IFacultyServices iFacultyServices) {
        this.iFacultyServices = iFacultyServices;
    }

    @PostMapping
    public ResponseEntity<?> createFaculty(@RequestBody CreateFacultyDto createFacultyDto)
    {
        return ResponseEntity.ok().body(iFacultyServices.createFaculty(createFacultyDto));
    }
}
