package com.ogs.autograde.services;

import com.ogs.autograde.models.StudentQuesAns;
import com.ogs.autograde.payloads.CreateStudentQADto;
import org.springframework.http.ResponseEntity;

import java.io.IOException;

public interface StudentQuesAnsServices {
    public StudentQuesAns findById(Long id);
    public ResponseEntity<?> createQuestion(CreateStudentQADto createStudentQADto) throws IOException;
//    public List<QuestionsResponse> getAllQuestions();
    public StudentQuesAns AiEvolutionBy(Long id);
    ResponseEntity<?> getByStudentId(Long id);
    ResponseEntity<?> getByQuestionId(Long id);
}
