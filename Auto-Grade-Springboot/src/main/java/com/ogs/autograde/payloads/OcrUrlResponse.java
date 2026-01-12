package com.ogs.autograde.payloads;


import lombok.Data;

@Data
public class OcrUrlResponse {
    private String image_path;
    private String extracted_text;
}
