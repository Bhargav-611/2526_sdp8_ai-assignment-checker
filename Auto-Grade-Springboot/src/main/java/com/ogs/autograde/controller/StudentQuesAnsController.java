package com.ogs.autograde.controller;
import com.ogs.autograde.DTO.CreateStudentQADto;
import com.ogs.autograde.DTO.ImageModel;
import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.models.Student;
import com.ogs.autograde.models.StudentQuesAns;
import com.ogs.autograde.services.IStudentQuesAnsServices;
import com.ogs.autograde.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentQuesAnsController {

    final private IStudentQuesAnsServices iStudentQuesAnsServices;

    @Autowired
    private ImageService imageService;

    public StudentQuesAnsController(@Autowired IStudentQuesAnsServices iStudentQuesAnsServices) {
        this.iStudentQuesAnsServices = iStudentQuesAnsServices;
    }

    @GetMapping("/demo")
    public String Demo()
    {
        return "Controller work fine";
    }

//    @GetMapping("/")
//    public ResponseEntity<List<QuestionsResponse>> getAllQuestions()
//    {
//        return ResponseEntity.ok(iStudentQuesAnsServices.getAllQuestions());
//    }
//
//    @GetMapping("/{id}")
//    public ResponseEntity<QuestionsResponse> getQuestion(@PathVariable("id")Long id)
//    {
//        StudentQuesAns studentQuesAns = iStudentQuesAnsServices.findById(id);
//        if(studentQuesAns != null)
//        {
//            String url = "http://localhost:8080/questions/" + id + "/image";
//            QuestionsResponse questionsResponse = new QuestionsResponse(studentQuesAns.getQuestion(), studentQuesAns.getAnswer(),url);
//            return ResponseEntity.ok(questionsResponse);
//        }
//        return ResponseEntity.notFound().build();
//    }

//    @GetMapping(value = "/{id}/image",produces = MediaType.IMAGE_JPEG_VALUE)
//    public byte[] getimage(@PathVariable("id")Long id)
//    {
//        StudentQuesAns studentQuesAns = iStudentQuesAnsServices.findById(id);
//        if(studentQuesAns != null)
//        {
//            return studentQuesAns.getPhoto();
//        }
//        else
//        {
//            return null;
//        }
//    }

    @PostMapping()
    public ResponseEntity<?> createQuestion(@ModelAttribute CreateStudentQADto createStudentQADto) throws IOException {

        return iStudentQuesAnsServices.createQuestion(createStudentQADto);
    }



//    @PostMapping("/upload")
//    public ResponseEntity<Map> upload(ImageModel imageModel) {
//        try {
//            return imageService.uploadImage(imageModel);
//        } catch (Exception e) {
//            e.printStackTrace();
//            return null;
//        }
//    }
}
