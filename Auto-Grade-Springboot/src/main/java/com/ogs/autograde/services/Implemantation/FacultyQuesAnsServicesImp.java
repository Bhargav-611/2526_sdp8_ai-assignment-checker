package com.ogs.autograde.services.Implemantation;


import com.ogs.autograde.payloads.CreateFacultyQuesAnsDto;
import com.ogs.autograde.Repository.FacultyQuesAnsRepo;
import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.models.FacultyQuesAns;
import com.ogs.autograde.services.FacultyQuesAnsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class FacultyQuesAnsServicesImp implements FacultyQuesAnsServices {

    final private FacultyRepo facultyRepo;
    final private FacultyQuesAnsRepo facultyQuesAnsRepo;

    public FacultyQuesAnsServicesImp(@Autowired FacultyRepo facultyRepo,@Autowired FacultyQuesAnsRepo facultyQuesAnsRepo) {
        this.facultyRepo = facultyRepo;
        this.facultyQuesAnsRepo = facultyQuesAnsRepo;
    }

    @Override
    public FacultyQuesAns createFacultyQuesAns(CreateFacultyQuesAnsDto createFacultyQuesAnsDto) {
        Optional<Faculty> facultyOptional = facultyRepo.findById(createFacultyQuesAnsDto.getFaculty_id());
        if(facultyOptional.isEmpty()) return null;

        FacultyQuesAns facultyQuesAns = FacultyQuesAns.builder().answer(createFacultyQuesAnsDto.getAnswer())
                .question(createFacultyQuesAnsDto.getQuestion())
                .max_mark(createFacultyQuesAnsDto.getMax_mark()).build();

        Faculty faculty = facultyOptional.get();
        faculty.addFacultyQuesAns(facultyQuesAns);
        facultyRepo.save(faculty);

        return facultyQuesAns;
    }

    @Override
    public List<FacultyQuesAns> getAllFacultyQuesAns() {
        return facultyQuesAnsRepo.findAll();
    }

    @Override
    public FacultyQuesAns getById(Long id) {
        Optional<FacultyQuesAns> facultyQuesAns = facultyQuesAnsRepo.findById(id);
        return facultyQuesAns.orElse(null);
    }
}
