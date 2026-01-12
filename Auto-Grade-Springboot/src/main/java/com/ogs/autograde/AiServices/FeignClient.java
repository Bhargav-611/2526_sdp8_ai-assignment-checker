//package com.ogs.autograde.FeignClient;
//
//
//import com.ogs.autograde.DTO.OcrUrlRequest;
//import com.ogs.autograde.DTO.OcrUrlResponse;
//import org.springframework.http.MediaType;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//
//
//public interface FeignClient {
//
//    @PostMapping(
//            value = "/ocr-path",
//            consumes = MediaType.APPLICATION_JSON_VALUE
//    )
//    OcrUrlResponse extract_text(@RequestBody OcrUrlRequest ocrUrlRequest);
//}
