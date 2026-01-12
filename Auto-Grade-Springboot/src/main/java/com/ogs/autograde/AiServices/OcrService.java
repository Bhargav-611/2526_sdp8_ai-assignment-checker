package com.ogs.autograde.AiServices;

import com.ogs.autograde.payloads.AiRequest;
import com.ogs.autograde.payloads.AiResponse;
import com.ogs.autograde.payloads.OcrUrlRequest;
import com.ogs.autograde.payloads.OcrUrlResponse;
import com.ogs.autograde.models.StudentQuesAns;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class OcrService {

    private final RestTemplate restTemplate;

    private static final String OCR_URL = "http://localhost:8000/ocr-path";
    private static final String EVOUTIONOFAI_URL = "http://localhost:8000/evaluate-path";

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

    public AiResponse evolutionOfAi(StudentQuesAns studentQuesAns)
    {
        AiRequest request = new AiRequest();
        request.setImage_path(studentQuesAns.getPhoto().getUrl());
        request.setModel_answer(studentQuesAns.getFacultyQuesAns().getAnswer());
        request.setMax_marks(studentQuesAns.getFacultyQuesAns().getMax_mark());
        request.setQuestion(studentQuesAns.getFacultyQuesAns().getQuestion());

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<AiRequest> entity =
                new HttpEntity<>(request, headers);

        ResponseEntity<AiResponse> response =
                restTemplate.postForEntity(
                        EVOUTIONOFAI_URL,
                        entity,
                        AiResponse.class
                );
        return response.getBody();
    }

}
