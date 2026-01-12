package com.ogs.autograde.controller;
import ch.qos.logback.core.pattern.util.RegularEscapeUtil;
import com.ogs.autograde.AiServices.OcrService;
import com.ogs.autograde.payloads.AiResponse;
import com.ogs.autograde.payloads.ApiResponse;
import com.ogs.autograde.payloads.CreateStudentQADto;
import com.ogs.autograde.payloads.OcrUrlResponse;
import com.ogs.autograde.models.StudentQuesAns;
import com.ogs.autograde.services.StudentQuesAnsServices;
import com.ogs.autograde.services.StudentServices;
import com.ogs.autograde.services.ImageService;
import com.ogs.autograde.services.Implemantation.StudentAnsQuesServicesImp;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class StudentQuesAnsController {

    final private StudentQuesAnsServices studentQuesAnsServices;
    final private OcrService ocrService;

    @Autowired
    private ImageService imageService;
    @Autowired
    private StudentServices studentServices;

    public StudentQuesAnsController(@Autowired StudentQuesAnsServices studentQuesAnsServices, OcrService ocrService) {
        this.studentQuesAnsServices = studentQuesAnsServices;
        this.ocrService = ocrService;
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

//    @PostMapping("/image")
//    public ResponseEntity<?> removeImage(@ModelAttribute Long stu_ans_id)
//    {
//        StudentQuesAns studentQuesAns = studentQuesAnsServices.findById(stu_ans_id);
//
//        if(studentQuesAns == null)
//        {
//            return ResponseEntity.badRequest().body(ApiResponse.builder().success(false).message("Student Answer id not match").data("").build());
//        }
//
//    }


    @GetMapping("/student/{id}")
    public ResponseEntity<?> getByStudentId(@PathVariable Long id)
    {
        return studentQuesAnsServices.getByStudentId(id);
    }

    @GetMapping("/question/{id}")
    public ResponseEntity<?> getByQuestionId(@PathVariable Long id)
    {
        return studentQuesAnsServices.getByQuestionId(id);
    }

    @PostMapping()
    public ResponseEntity<?> createQuestion(@ModelAttribute CreateStudentQADto createStudentQADto) throws IOException {
        return studentQuesAnsServices.createQuestion(createStudentQADto);
    }


    @PostMapping("/extract")
    public OcrUrlResponse getExtractText()
    {
        return ocrService.extractText("D:/Collage/Btech/sem6/AutoGrade/2526_sdp8_ai-assignment-checker/preprocessing/photos/ansh.jpeg");
    }

    @PostMapping("/ai/{id}")
    public StudentQuesAns AiEvaluation(@PathVariable Long id)
    {
        return studentQuesAnsServices.AiEvolutionBy(id);
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
