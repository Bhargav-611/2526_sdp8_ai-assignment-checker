package com.ogs.autograde.services;


import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.Repository.QuestionsRepository;
import com.ogs.autograde.models.Questions;
import lombok.Setter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class QuestionsServices {

    final private QuestionsRepository questionsRepository;

    public QuestionsServices(QuestionsRepository questionsRepository) {
        this.questionsRepository = questionsRepository;
    }

    public Questions findById(Long id)
    {
        Optional<Questions> questions = questionsRepository.findById(id);
        return questions.orElse(null);
    }

    public Questions createQuestion(String question,String answer, MultipartFile imageFile) throws IOException {
        Questions questions = new Questions();
        System.out.println(answer);
        questions.setQuestion(question);
        questions.setAnswer(answer);
        questions.setPhoto(imageFile.getBytes());
        return questionsRepository.save(questions);
    }

    public List<QuestionsResponse> getAllQuestions() {
        List<QuestionsResponse> questionsResponseList = new ArrayList<>();
        List<Questions> questionsList = questionsRepository.findAll();
        for(Questions questions : questionsList)
        {
            questionsResponseList.add(new QuestionsResponse(questions.getAnswer(),"http://localhost:8080/questions/" + questions.getId() + "/image",questions.getQuestion()));
        }
        return questionsResponseList;
    }
}
