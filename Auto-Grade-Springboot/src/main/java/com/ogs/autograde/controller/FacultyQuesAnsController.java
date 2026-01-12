package com.ogs.autograde.controller;


import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.payloads.ApiResponse;
import com.ogs.autograde.payloads.CreateFacultyQuesAnsDto;
import com.ogs.autograde.models.FacultyQuesAns;
import com.ogs.autograde.services.FacultyQuesAnsServices;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/facultyquesans")
public class FacultyQuesAnsController {
    final private FacultyQuesAnsServices facultyQuesAnsServices;

    public FacultyQuesAnsController(@Autowired FacultyQuesAnsServices facultyQuesAnsServices) {
        this.facultyQuesAnsServices = facultyQuesAnsServices;
    }

    @PostMapping
    ResponseEntity<?> createFacultyQuesAns(@RequestBody CreateFacultyQuesAnsDto createFacultyQuesAnsDto)
    {
        FacultyQuesAns facultyQuesAns = facultyQuesAnsServices.createFacultyQuesAns(createFacultyQuesAnsDto);
        if(facultyQuesAns == null)
        {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        else
        {
            return ResponseEntity.ok(facultyQuesAns);
        }
    }

    @GetMapping("/all")
    ResponseEntity<?> getAllFacultyQuesAns()
    {
        return ResponseEntity.ok().body(ApiResponse.builder().data(facultyQuesAnsServices.getAllFacultyQuesAns()).success(true).message("All Faculty Question Answer fetch Successfully").build());
    }

    @GetMapping("/id/{id}")
    public  ResponseEntity<?> getById(@PathVariable Long id)
    {
        FacultyQuesAns facultyQuesAns = facultyQuesAnsServices.getById(id);
        if(facultyQuesAns == null)
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("Not find faculty Question Answer with is id.").build());
        }
        return  ResponseEntity.ok().body(ApiResponse.builder().data(facultyQuesAns).success(true).message("fetch successfully.").build());
    }

    @GetMapping("faculty/{id}")
    public ResponseEntity<?> getByFacultyId(@PathVariable Long id)
    {
        return facultyQuesAnsServices.getByFacultyId(id);
    }

}
