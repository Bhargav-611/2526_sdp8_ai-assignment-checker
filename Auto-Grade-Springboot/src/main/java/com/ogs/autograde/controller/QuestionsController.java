package com.ogs.autograde.controller;
import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.models.Questions;
import com.ogs.autograde.services.QuestionsServices;
import jakarta.websocket.server.PathParam;
import org.hibernate.dialect.function.DB2SubstringFunction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/questions")
@CrossOrigin(origins = "http://localhost:5173")
public class QuestionsController {

    final private QuestionsServices questionsServices;

    public QuestionsController(QuestionsServices questionsServices) {
        this.questionsServices = questionsServices;
    }

    @GetMapping("/demo")
    public String Demo()
    {
        return "Controller work fine";
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuestionsResponse> getQuestion(@PathVariable("id")Long id)
    {
        Questions questions = questionsServices.findById(id);
        if(questions != null)
        {
            String url = "http://localhost:8080/questions/" + id + "/image";
            QuestionsResponse questionsResponse = new QuestionsResponse(questions.getQuestion(),questions.getAnswer(),url);
            return ResponseEntity.ok(questionsResponse);
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping(value = "/{id}/image",produces = MediaType.IMAGE_JPEG_VALUE)
    public byte[] getimage(@PathVariable("id")Long id)
    {
        Questions questions = questionsServices.findById(id);
        if(questions != null)
        {
            return questions.getPhoto();
        }
        else
        {
            return null;
        }
    }

    @PostMapping("/")
    public ResponseEntity<Questions> createQuestion(@RequestParam("question")String question,@RequestParam("answer") String answer, @RequestParam("image")MultipartFile file) throws IOException {

        Questions newaddedquestions = questionsServices.createQuestion(question,answer,file);
        System.out.println(answer);
        if(newaddedquestions != null)
        {
//            System.out.println(newaddedquestions.getAnswer());
            return ResponseEntity.ok(newaddedquestions);
        }
        else
        {
            return ResponseEntity.notFound().build();
        }
    }
}
