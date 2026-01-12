package com.ogs.autograde.services.Implemantation;

import com.ogs.autograde.payloads.ImageModel;
import com.ogs.autograde.Repository.ImageRepo;
import com.ogs.autograde.models.Image;
import com.ogs.autograde.services.CloudinaryService;
import com.ogs.autograde.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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