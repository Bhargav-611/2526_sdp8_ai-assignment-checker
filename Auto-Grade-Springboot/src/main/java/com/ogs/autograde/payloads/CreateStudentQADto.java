package com.ogs.autograde.payloads;


import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class CreateStudentQADto {
    private MultipartFile image;
    private Long student_id;
    private Long question_id;
}
