package com.ogs.autograde.services;

import com.ogs.autograde.DTO.ImageModel;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ImageService {
    public ResponseEntity<Map> uploadImage(ImageModel imageModel);
}
