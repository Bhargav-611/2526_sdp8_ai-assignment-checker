package com.ogs.autograde.services;

import com.ogs.autograde.DTO.ImageModel;
import com.ogs.autograde.models.Image;
import org.springframework.http.ResponseEntity;

import java.util.Map;

public interface ImageService {
    public Image uploadImage(ImageModel imageModel);
}
