package com.ogs.autograde.services;

import com.ogs.autograde.DTO.ImageModel;
import com.ogs.autograde.Repository.ImageRepo;
import com.ogs.autograde.models.Image;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class ImageServiceImpl implements ImageService {

    @Autowired
    private CloudinaryService cloudinaryService;
    @Autowired
    private ImageRepo imageRepository;


    @Override
    public Image uploadImage(ImageModel imageModel) {
        try {
            if (imageModel.getName().isEmpty()) {
                return null;
//                return ResponseEntity.badRequest().build();
            }
            if (imageModel.getFile().isEmpty()) {
                return null;
//                return ResponseEntity.badRequest().build();
            }
            Image image = new Image();
            image.setName(imageModel.getName());
            image.setUrl(cloudinaryService.uploadFile(imageModel.getFile(), "folder_1"));
            if(image.getUrl() == null) {
                return null;
//                return ResponseEntity.badRequest().build();
            }
            imageRepository.save(image);
            return image;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}