package com.ogs.autograde.AiServices;

import com.ogs.autograde.DTO.OcrUrlRequest;
import com.ogs.autograde.DTO.OcrUrlResponse;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OcrService {

    private final RestTemplate restTemplate;

    private static final String OCR_URL = "http://localhost:8000/ocr-path";

    public OcrService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public OcrUrlResponse extractText(String imageUrl) {

        // Request body
        OcrUrlRequest request = new OcrUrlRequest(imageUrl);

        // Headers
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Entity
        HttpEntity<OcrUrlRequest> entity =
                new HttpEntity<>(request, headers);

        // Call FastAPI
        ResponseEntity<OcrUrlResponse> response =
                restTemplate.postForEntity(
                        OCR_URL,
                        entity,
                        OcrUrlResponse.class
                );

        return response.getBody();
    }
    
}
