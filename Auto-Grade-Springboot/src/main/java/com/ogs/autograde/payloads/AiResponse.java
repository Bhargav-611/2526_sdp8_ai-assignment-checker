package com.ogs.autograde.payloads;


import lombok.Data;

@Data
public class AiResponse {
    private String image_path;
    private String student_answer;
    private double accuracy;
    private int marks;
    private int max_marks;
    private String evaluation;
}
