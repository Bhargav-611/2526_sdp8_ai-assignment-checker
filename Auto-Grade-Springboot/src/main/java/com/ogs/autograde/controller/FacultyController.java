package com.ogs.autograde.controller;


import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.payloads.ApiResponse;
import com.ogs.autograde.payloads.CreateFacultyDto;
import com.ogs.autograde.services.FacultyServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/faculty")
public class FacultyController {

    final private FacultyServices facultyServices;


    public FacultyController(@Autowired FacultyServices facultyServices) {
        this.facultyServices = facultyServices;
    }

    @PostMapping
    public ResponseEntity<?> createFaculty(@RequestBody CreateFacultyDto createFacultyDto)
    {
        Faculty faculty = facultyServices.createFaculty(createFacultyDto);
        if(faculty == null)
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("Not Created").build());
        }
        return ResponseEntity.ok().body(ApiResponse.builder().message("Faculty Created successfully").data(faculty).build());
    }

    @GetMapping("/all")
    public  ResponseEntity<?> getAllFaculty()
    {
        return ResponseEntity.ok().body(ApiResponse.builder().data(facultyServices.findAllFaculty()).success(true).message("All Faculty fetch Successfully").build());
    }


    @GetMapping("/id/{id}")
    public  ResponseEntity<?> getById(@PathVariable Long id)
    {
        Faculty faculty = facultyServices.findByid(id);
//        System.out.println(faculty.getName());
        if(faculty == null)
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("Not find faculty with is id.").build());
        }
        return  ResponseEntity.ok().body(ApiResponse.builder().data(faculty).success(true).message("fetch successfully.").build());
    }


}
