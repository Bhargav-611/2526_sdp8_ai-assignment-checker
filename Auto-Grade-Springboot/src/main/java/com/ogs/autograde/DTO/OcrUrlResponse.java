package com.ogs.autograde.DTO;


import lombok.Data;

@Data
public class OcrUrlResponse {
    private String image_path;
    private String extracted_text;
}
