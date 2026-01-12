package com.ogs.autograde.services;


import com.ogs.autograde.payloads.CreateFacultyDto;
import com.ogs.autograde.models.Faculty;

import java.util.List;

public interface FacultyServices {
    Faculty createFaculty(CreateFacultyDto createFacultyDto);
    Faculty findByid(Long id);
    List<Faculty> findAllFaculty();
}
