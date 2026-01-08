package com.ogs.autograde.services;


//import com.cloudinary.api.ApiResponse;
import com.ogs.autograde.DTO.ApiResponse;
import com.ogs.autograde.DTO.CreateStudentQADto;
import com.ogs.autograde.DTO.ImageModel;
import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.Repository.FacultyQuesAnsRepo;
import com.ogs.autograde.Repository.StudentQuesAnsRepo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.models.FacultyQuesAns;
import com.ogs.autograde.models.Image;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.models.StudentQuesAns;
import org.apache.tomcat.util.buf.Ascii;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentAnsQuesServicesImp implements IStudentQuesAnsServices{

    final private StudentQuesAnsRepo studentQuesAnsRepo;
    final private StudentRepo studentRepo;
    final private FacultyQuesAnsRepo facultyQuesAnsRepo;
    final private ImageService imageService;

    public StudentAnsQuesServicesImp(StudentQuesAnsRepo studentQuesAnsRepo, StudentRepo studentRepo, FacultyQuesAnsRepo facultyQuesAnsRepo, ImageService imageService) {
        this.studentQuesAnsRepo = studentQuesAnsRepo;
        this.studentRepo = studentRepo;
        this.facultyQuesAnsRepo = facultyQuesAnsRepo;
        this.imageService = imageService;
    }

    public StudentQuesAns findById(Long id)
    {
        Optional<StudentQuesAns> questions = studentQuesAnsRepo.findById(id);
        return questions.orElse(null);
    }
    public ResponseEntity<?> createQuestion(CreateStudentQADto createStudentQADto) throws IOException {
        Optional<Student> studentOptional = studentRepo.findById(createStudentQADto.getStudent_id());
        Student student;
        if(studentOptional.isEmpty())
        {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message("Student id not match").data("").build());
        }
        else
        {
            student = studentOptional.get();
        }
        Optional<FacultyQuesAns> facultyQuesAnsOptional = facultyQuesAnsRepo.findById(createStudentQADto.getQuestion_id());
        FacultyQuesAns facultyQuesAns;
        if(facultyQuesAnsOptional.isEmpty())
        {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message("Faculty Question id not match").data("").build());
        }
        else
        {
            facultyQuesAns = facultyQuesAnsOptional.get();
        }
        Image image = imageService.uploadImage(new ImageModel( student.getName()+"_"+ facultyQuesAns.getId().toString(),createStudentQADto.getImage()));
        if(image == null)
        {
            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message("image upload fails").data("").build());
        }
        StudentQuesAns studentQuesAns = new StudentQuesAns();
        studentQuesAns.setPhoto(image);
//        System.out.println(studentQuesAns);
        studentQuesAnsRepo.save(studentQuesAns);
//        System.out.println(studentQuesAns);
        student.AddstudentQuesAnsList(studentQuesAns);
        facultyQuesAns.addStudentQuesAns(studentQuesAns);
        studentRepo.save(student);
        facultyQuesAnsRepo.save(facultyQuesAns);
        return ResponseEntity.ok(ApiResponse.builder().success(true).message("Student Answer Upload Successfully").data(studentQuesAns).build());
//        return ;
    }

//    public List<QuestionsResponse> getAllQuestions() {
//        List<QuestionsResponse> questionsResponseList = new ArrayList<>();
//        List<com.ogs.autograde.models.StudentQuesAns> studentQuesAnsList = studentQuesAnsRepo.findAll();
//        for(com.ogs.autograde.models.StudentQuesAns studentQuesAns : studentQuesAnsList)
//        {
//            questionsResponseList.add(new QuestionsResponse(studentQuesAns.getAnswer(),"http://localhost:8080/questions/" + studentQuesAns.getId() + "/image", studentQuesAns.getQuestion()));
//        }
//        return questionsResponseList;
//    }
}