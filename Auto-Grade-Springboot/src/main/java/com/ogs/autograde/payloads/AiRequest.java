package com.ogs.autograde.payloads;

import lombok.Data;

@Data
public class AiRequest {
    private String image_path;
    private String question;
    private String model_answer;
    private int max_marks;
}
