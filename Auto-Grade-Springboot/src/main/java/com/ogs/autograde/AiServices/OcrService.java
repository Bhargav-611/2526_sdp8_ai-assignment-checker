package com.ogs.autograde.AiServices;

import com.ogs.autograde.payloads.AiRequest;
import com.ogs.autograde.payloads.AiResponse;
import com.ogs.autograde.payloads.OcrUrlRequest;
import com.ogs.autograde.payloads.OcrUrlResponse;
import com.ogs.autograde.models.StudentQuesAns;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;

@Service
public class OcrService {

    private final RestTemplate restTemplate;
    private final WebClient webClient;

    private static final String OCR_URL = "http://localhost:8000/ocr-path";
    private static final String EVOUTIONOFAI_URL = "http://localhost:8000/evaluate-path";
    private static final String EVOUTIONOFAI_STREAM_URL = "http://localhost:8000/evaluate-path-stream";

    public OcrService(RestTemplate restTemplate, WebClient.Builder webClientBuilder) {
        this.restTemplate = restTemplate;
        this.webClient = webClientBuilder.build();
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

                try {
                        ResponseEntity<AiResponse> response = restTemplate.postForEntity(
                                        EVOUTIONOFAI_URL,
                                        entity,
                                        AiResponse.class
                        );
                        return response.getBody();
                } catch (org.springframework.web.client.ResourceAccessException e) {
                        // Connection refused / timeout
                        System.err.println("AI service connection failed: " + e.getMessage());
                        AiResponse fallback = new AiResponse();
                        fallback.setEvaluation("AI service unavailable");
                        fallback.setMarks(0);
                        fallback.setStudent_answer("");
                        fallback.setAccuracy(0.0);
                        return fallback;
                } catch (org.springframework.web.client.RestClientException e) {
                        System.err.println("AI service error: " + e.getMessage());
                        AiResponse fallback = new AiResponse();
                        fallback.setEvaluation("AI service error");
                        fallback.setMarks(0);
                        fallback.setStudent_answer("");
                        fallback.setAccuracy(0.0);
                        return fallback;
                }
    }

    public Flux<String> streamAiEvaluation(StudentQuesAns studentQuesAns) {
        AiRequest request = new AiRequest();
        request.setImage_path(studentQuesAns.getPhoto().getUrl());
        request.setModel_answer(studentQuesAns.getFacultyQuesAns().getAnswer());
        request.setMax_marks(studentQuesAns.getFacultyQuesAns().getMax_mark());
        request.setQuestion(studentQuesAns.getFacultyQuesAns().getQuestion());

        return webClient.post()
                .uri(EVOUTIONOFAI_STREAM_URL)
                .contentType(MediaType.APPLICATION_JSON)
                .bodyValue(request)
                .retrieve()
                .bodyToFlux(String.class);
    }

}
