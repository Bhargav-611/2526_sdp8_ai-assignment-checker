package com.ogs.autograde.DTO;

import lombok.Data;
import org.springframework.web.multipart.MultipartFile;

@Data
public class ImageModel {
    private String name;
    private MultipartFile file;

    public ImageModel(String name, MultipartFile image) {
        this.name = name;
        this.file = image;
    }
}