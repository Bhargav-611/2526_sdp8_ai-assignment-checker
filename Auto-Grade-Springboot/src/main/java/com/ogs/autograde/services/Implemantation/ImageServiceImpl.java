package com.ogs.autograde.services.Implemantation;

import com.ogs.autograde.payloads.ImageModel;
import com.ogs.autograde.Repository.ImageRepo;
import com.ogs.autograde.models.Image;
import com.ogs.autograde.services.CloudinaryService;
import com.ogs.autograde.services.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
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
        if (imageModel.getName().isEmpty() || imageModel.getFile().isEmpty()) {
            return null;
        }
        Map<String, String> uploadResult = cloudinaryService.uploadFile(imageModel.getFile(), "folder_1");

        if (uploadResult == null) {
            return null;
        }

        Image image = new Image();
        image.setName(imageModel.getName());
        image.setUrl(uploadResult.get("url"));
        image.setPublicId(uploadResult.get("publicId"));

        return imageRepository.save(image);
    }
    @Override
    public boolean deleteImage(Long imageId) {

        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new RuntimeException("Image not found"));

        boolean deletedFromCloudinary =
                cloudinaryService.deleteFile(image.getPublicId());

        if (deletedFromCloudinary) {
            imageRepository.delete(image);
            return true;
        }

        return false;
    }

}