package com.example.xllent_ecommerce.serviceImpl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.xllent_ecommerce.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryServiceImpl implements CloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public String uploadImage(MultipartFile file) throws IOException {

        if (file == null || file.isEmpty()) {
            return null;
        }

        Map<?, ?> uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.emptyMap()
        );

        return uploadResult.get("secure_url").toString();
    }

    @Override
    public void deleteImage(String imageUrl) throws IOException {

        if (imageUrl == null || imageUrl.isBlank()) {
            return;
        }

        String publicId = extractPublicId(imageUrl);

        cloudinary.uploader().destroy(
                publicId,
                ObjectUtils.emptyMap()
        );
    }

    /**
     * Extract Public ID from Cloudinary URL
     */
    private String extractPublicId(String imageUrl) {

        String[] parts = imageUrl.split("/");

        String fileName = parts[parts.length - 1];

        return fileName.substring(0, fileName.lastIndexOf('.'));
    }

}