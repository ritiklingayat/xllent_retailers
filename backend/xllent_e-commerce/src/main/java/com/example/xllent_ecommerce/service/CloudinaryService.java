package com.example.xllent_ecommerce.service;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface CloudinaryService {

    /**
     * Upload image to Cloudinary
     *
     * @param file Multipart image
     * @return Image URL
     */
    String uploadImage(MultipartFile file) throws IOException;

    /**
     * Delete image from Cloudinary
     *
     * @param imageUrl Cloudinary URL
     */
    void deleteImage(String imageUrl) throws IOException;

}