package com.ogs.autograde.services;


import com.ogs.autograde.DTO.CreateFacultyQuesAnsDto;
import com.ogs.autograde.models.FacultyQuesAns;
import org.springframework.stereotype.Service;

public interface IFacultyQuesAnsServices {
    FacultyQuesAns createFacultyQuesAns(CreateFacultyQuesAnsDto createFacultyQuesAnsDto);
}
