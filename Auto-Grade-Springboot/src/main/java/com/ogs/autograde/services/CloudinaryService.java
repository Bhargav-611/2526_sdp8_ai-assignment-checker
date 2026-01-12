package com.ogs.autograde.services;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface CloudinaryService {
    Map<String, String> uploadFile(MultipartFile file, String folderName);
    boolean deleteFile(String publicId);
}
