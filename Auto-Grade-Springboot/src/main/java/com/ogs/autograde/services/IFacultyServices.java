package com.ogs.autograde.services;


import com.ogs.autograde.DTO.CreateFacultyDto;
import com.ogs.autograde.models.Faculty;
import org.springframework.stereotype.Service;

public interface IFacultyServices {
    Faculty createFaculty(CreateFacultyDto createFacultyDto);
    Faculty findByid(Long id);
}
