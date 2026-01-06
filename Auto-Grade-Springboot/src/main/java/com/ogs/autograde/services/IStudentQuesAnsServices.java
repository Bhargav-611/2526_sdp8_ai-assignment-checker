package com.ogs.autograde.services;

import com.ogs.autograde.DTO.QuestionsResponse;
import com.ogs.autograde.models.StudentQuesAns;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface IStudentQuesAnsServices {
    public StudentQuesAns findById(Long id);
    public StudentQuesAns createQuestion(String question, String answer, MultipartFile imageFile) throws IOException;
    public List<QuestionsResponse> getAllQuestions();
}
