package com.ogs.autograde.services;


import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.Repository.StudentQuesAnsRepo;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.ogs.autograde.models.StudentQuesAns;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StudentAnsQuesServicesImp implements IStudentQuesAnsServices{

    final private StudentQuesAnsRepo studentQuesAnsRepo;

    public StudentAnsQuesServicesImp(StudentQuesAnsRepo studentQuesAnsRepo) {
        this.studentQuesAnsRepo = studentQuesAnsRepo;
    }

    public StudentQuesAns findById(Long id)
    {
        Optional<StudentQuesAns> questions = studentQuesAnsRepo.findById(id);
        return questions.orElse(null);
    }
    public StudentQuesAns createQuestion(String question, String answer, MultipartFile imageFile) throws IOException {
        StudentQuesAns studentQuesAns = new com.ogs.autograde.models.StudentQuesAns();
        studentQuesAns.setQuestion(question);
        studentQuesAns.setAnswer(answer);
        studentQuesAns.setPhoto(imageFile.getBytes());
        return studentQuesAnsRepo.save(studentQuesAns);
    }

    public List<QuestionsResponse> getAllQuestions() {
        List<QuestionsResponse> questionsResponseList = new ArrayList<>();
        List<com.ogs.autograde.models.StudentQuesAns> studentQuesAnsList = studentQuesAnsRepo.findAll();
        for(com.ogs.autograde.models.StudentQuesAns studentQuesAns : studentQuesAnsList)
        {
            questionsResponseList.add(new QuestionsResponse(studentQuesAns.getAnswer(),"http://localhost:8080/questions/" + studentQuesAns.getId() + "/image", studentQuesAns.getQuestion()));
        }
        return questionsResponseList;
    }
}