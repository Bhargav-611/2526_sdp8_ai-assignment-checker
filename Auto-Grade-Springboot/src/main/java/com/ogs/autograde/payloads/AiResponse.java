package com.ogs.autograde.payloads;

import lombok.Data;
import java.util.Map;

@Data
public class AiResponse {
    private String image_path;
    private String student_answer;           // raw OCR text
    private String student_answer_clean;     // grammar-corrected version
    private double accuracy;
    private double marks;
    private int max_marks;
    private String evaluation;              // flat readable string
    private double semantic_similarity;
    private double rubric_marks;
    private double length_factor;
    private Map<String, Double> rubric;
}
