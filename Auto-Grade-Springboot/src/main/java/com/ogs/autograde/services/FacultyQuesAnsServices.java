package com.ogs.autograde.services;


import com.ogs.autograde.payloads.CreateFacultyQuesAnsDto;
import com.ogs.autograde.models.FacultyQuesAns;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.ResourceBundle;

public interface FacultyQuesAnsServices {
    FacultyQuesAns createFacultyQuesAns(CreateFacultyQuesAnsDto createFacultyQuesAnsDto);
    List<FacultyQuesAns> getAllFacultyQuesAns();
    FacultyQuesAns getById(Long id);
    ResponseEntity<?> getByFacultyId(Long id);
}
