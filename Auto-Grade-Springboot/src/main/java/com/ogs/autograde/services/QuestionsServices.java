package com.ogs.autograde.services;


import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.Repository.StudentQuesAnsRepo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class QuestionsServices {

    final private StudentQuesAnsRepo questionsRepository;

    public QuestionsServices(StudentQuesAnsRepo questionsRepository) {
        this.questionsRepository = questionsRepository;
    }

    public com.ogs.autograde.models.StudentQuesAns findById(Long id)
    {
        Optional<com.ogs.autograde.models.StudentQuesAns> questions = questionsRepository.findById(id);
        return questions.orElse(null);
    }

    public com.ogs.autograde.models.StudentQuesAns createQuestion(String question, String answer, MultipartFile imageFile) throws IOException {
        com.ogs.autograde.models.StudentQuesAns studentQuesAns = new com.ogs.autograde.models.StudentQuesAns();
        studentQuesAns.setQuestion(question);
        studentQuesAns.setAnswer(answer);
        studentQuesAns.setPhoto(imageFile.getBytes());
        return questionsRepository.save(studentQuesAns);
    }

    public List<QuestionsResponse> getAllQuestions() {
        List<QuestionsResponse> questionsResponseList = new ArrayList<>();
        List<com.ogs.autograde.models.StudentQuesAns> studentQuesAnsList = questionsRepository.findAll();
        for(com.ogs.autograde.models.StudentQuesAns studentQuesAns : studentQuesAnsList)
        {
            questionsResponseList.add(new QuestionsResponse(studentQuesAns.getAnswer(),"http://localhost:8080/questions/" + studentQuesAns.getId() + "/image", studentQuesAns.getQuestion()));
        }
        return questionsResponseList;
    }
}
