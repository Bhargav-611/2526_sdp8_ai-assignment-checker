package com.ogs.autograde.services;

import com.ogs.autograde.DTO.CreateStudentQADto;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface IStudentQuesAnsServices {
//    public StudentQuesAns findById(Long id);
    public ResponseEntity<?> createQuestion(CreateStudentQADto createStudentQADto) throws IOException;
//    public List<QuestionsResponse> getAllQuestions();
}
