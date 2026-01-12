package com.ogs.autograde.services.Implemantation;

import com.ogs.autograde.payloads.CreateFacultyDto;
import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.services.FacultyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyServicesImp implements FacultyServices {

    final private FacultyRepo facultyRepo;

    public FacultyServicesImp(@Autowired FacultyRepo facultyRepo) {
        this.facultyRepo = facultyRepo;
    }

    @Override
    public Faculty createFaculty(CreateFacultyDto createFacultyDto) {
        Faculty faculty = Faculty.builder().name(createFacultyDto.getName()).build();
        return facultyRepo.save(faculty);
    }

    @Override
    public Faculty findByid(Long id) {
        Optional<Faculty> facultyOptional = facultyRepo.findById(id);
        return facultyOptional.orElse(null);
    }

    @Override
    public List<Faculty> findAllFaculty() {
        return facultyRepo.findAll();
    }


}
