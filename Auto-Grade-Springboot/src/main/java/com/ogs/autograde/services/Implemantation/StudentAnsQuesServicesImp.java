package com.ogs.autograde.services.Implemantation;


//import com.cloudinary.api.ApiResponse;
import com.ogs.autograde.AiServices.OcrService;
import com.ogs.autograde.payloads.*;
import com.ogs.autograde.Repository.FacultyQuesAnsRepo;
import com.ogs.autograde.Repository.StudentQuesAnsRepo;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import com.ogs.autograde.Repository.StudentRepo;
import com.ogs.autograde.Repository.FacultyRepo;
import com.ogs.autograde.models.Faculty;
import com.ogs.autograde.models.FacultyQuesAns;
import com.ogs.autograde.models.Image;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.models.StudentQuesAns;
import com.ogs.autograde.services.StudentQuesAnsServices;
import com.ogs.autograde.services.ImageService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

@Service
public class StudentAnsQuesServicesImp implements StudentQuesAnsServices {

    final private StudentQuesAnsRepo studentQuesAnsRepo;
    final private StudentRepo studentRepo;
    final private FacultyQuesAnsRepo facultyQuesAnsRepo;
    final private FacultyRepo facultyRepo;
    final private ImageService imageService;
    final private OcrService ocrService;

    public StudentAnsQuesServicesImp(StudentQuesAnsRepo studentQuesAnsRepo, StudentRepo studentRepo, FacultyQuesAnsRepo facultyQuesAnsRepo, FacultyRepo facultyRepo, ImageService imageService, OcrService ocrService) {
        this.studentQuesAnsRepo = studentQuesAnsRepo;
        this.studentRepo = studentRepo;
        this.facultyQuesAnsRepo = facultyQuesAnsRepo;
        this.facultyRepo = facultyRepo;
        this.imageService = imageService;
        this.ocrService = ocrService;
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

    public StudentQuesAns AiEvolutionBy(Long id)
    {
        StudentQuesAns studentQuesAns = findById(id);
        AiResponse response = ocrService.evolutionOfAi(studentQuesAns);
        studentQuesAns.setEvolution(response.getEvaluation());
        studentQuesAns.setAnswer_mark(response.getMarks());
        studentQuesAns.setAnswer(response.getStudent_answer());
        System.out.println(response.getAccuracy());
        return  studentQuesAnsRepo.save(studentQuesAns);
    }

    @Override
    public ResponseEntity<?> getByStudentId(Long id) {
        Optional<Student> studentOptional = studentRepo.findById(id);
        if(studentOptional.isEmpty())
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("No Student Found").build());
        }
        Student student = studentOptional.get();
        List<StudentQuesAns> studentQuesAns = student.getStudentQuesAnsList();
        return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("All answer fetch Successfully.").data(studentQuesAns).build());
    }

    @Override
    public ResponseEntity<?> getByQuestionId(Long id) {
        Optional<FacultyQuesAns> facultyQuesAnsOptional = facultyQuesAnsRepo.findById(id);
        if(facultyQuesAnsOptional.isEmpty())
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("No Question is Found").build());
        }
        FacultyQuesAns facultyQuesAns = facultyQuesAnsOptional.get();
        List<StudentQuesAns> studentQuesAnsList = facultyQuesAns.getStudentQuesAnsList();
        return ResponseEntity.ok().body(ApiResponse.builder().success(true).message("All answer fetch Successfully.").data(studentQuesAnsList).build());
    }

    @Override
    public ResponseEntity<?> updateMarks(Long id, UpdateMarksDto updateMarksDto) {
        Optional<StudentQuesAns> studentQuesAnsOptional = studentQuesAnsRepo.findById(id);
        if(studentQuesAnsOptional.isEmpty())
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("Student Answer not found").build());
        }
        StudentQuesAns studentQuesAns = studentQuesAnsOptional.get();
        
        // Update marks and feedback
        if(updateMarksDto.getAnswer_mark() != null) {
            studentQuesAns.setAnswer_mark(updateMarksDto.getAnswer_mark());
        }
        if(updateMarksDto.getEvolution() != null && !updateMarksDto.getEvolution().isEmpty()) {
            studentQuesAns.setEvolution(updateMarksDto.getEvolution());
        }
        
        StudentQuesAns updatedAnswer = studentQuesAnsRepo.save(studentQuesAns);
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .message("Marks updated successfully")
                .data(updatedAnswer)
                .build());
    }

    @Override
    public ResponseEntity<?> getAllSubmissions() {
        List<StudentQuesAns> allSubmissions = studentQuesAnsRepo.findAll();
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .message("All submissions fetched successfully")
                .data(allSubmissions)
                .build());
    }

    @Override
    public ResponseEntity<?> getSubmissionsByFacultyId(Long facultyId) {
        Optional<Faculty> facultyOptional = facultyRepo.findById(facultyId);
        if(facultyOptional.isEmpty())
        {
            return ResponseEntity.ok().body(ApiResponse.builder().success(false).message("Faculty not found").build());
        }
        
        Faculty faculty = facultyOptional.get();
        List<FacultyQuesAns> facultyQuestions = faculty.getFacultyQuesAnsList();
        
        // Collect all submissions for this faculty's questions
        List<StudentQuesAns> allSubmissions = new java.util.ArrayList<>();
        for(FacultyQuesAns question : facultyQuestions) {
            allSubmissions.addAll(question.getStudentQuesAnsList());
        }
        
        return ResponseEntity.ok().body(ApiResponse.builder()
                .success(true)
                .message("Submissions fetched successfully")
                .data(allSubmissions)
                .build());
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