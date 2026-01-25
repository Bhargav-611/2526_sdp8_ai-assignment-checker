package com.ogs.autograde.services;

import com.ogs.autograde.payloads.ImageModel;
import com.ogs.autograde.models.Image;

public interface ImageService {
    public Image uploadImage(ImageModel imageModel);
    public boolean deleteImage(Long imageId);
}
