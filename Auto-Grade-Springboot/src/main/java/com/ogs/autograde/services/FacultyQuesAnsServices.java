package com.ogs.autograde.services;


import com.ogs.autograde.payloads.CreateFacultyQuesAnsDto;
import com.ogs.autograde.models.FacultyQuesAns;

import java.util.List;

public interface FacultyQuesAnsServices {
    FacultyQuesAns createFacultyQuesAns(CreateFacultyQuesAnsDto createFacultyQuesAnsDto);
    List<FacultyQuesAns> getAllFacultyQuesAns();
    FacultyQuesAns getById(Long id);
}
