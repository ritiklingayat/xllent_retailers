package com.example.xllent_ecommerce.serviceImpl;

import com.example.xllent_ecommerce.dto.request.ProductRequest;
import com.example.xllent_ecommerce.dto.response.ProductResponse;
import com.example.xllent_ecommerce.entity.Category;
import com.example.xllent_ecommerce.entity.Product;
import com.example.xllent_ecommerce.entity.Status;
import com.example.xllent_ecommerce.repository.CategoryRepository;
import com.example.xllent_ecommerce.repository.ProductRepository;
import com.example.xllent_ecommerce.service.CloudinaryService;
import com.example.xllent_ecommerce.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final ModelMapper modelMapper;
    private final CategoryRepository categoryRepository;

    @Override
    public ProductResponse addProduct(ProductRequest request) {

        try {

            if (productRepository.existsByProductName(request.getProductName())) {
                throw new RuntimeException("Product already exists.");
            }

            Product product = new Product();

            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            product.setBrand(request.getBrand());

            product.setSuperAdminPrice(request.getSuperAdminPrice());
            product.setAdminPrice(request.getAdminPrice());
            product.setSuperStockistPrice(request.getSuperStockistPrice());
            product.setDistributorPrice(request.getDistributorPrice());
            product.setWholesellerPrice(request.getWholesellerPrice());

            product.setStatus(Status.ACTIVE);

            //load category
            Category category = categoryRepository.findById(request.getCategoryId())
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            product.setCategory(category);

            if (request.getImage() != null &&
                    !request.getImage().isEmpty()) {

                String imageUrl = cloudinaryService.uploadImage(request.getImage());

                product.setImageUrl(imageUrl);
            }

            Product savedProduct = productRepository.save(product);

            return modelMapper.map(savedProduct, ProductResponse.class);

        } catch (IOException e) {

            throw new RuntimeException("Image upload failed.", e);

        }

    }

    @Override
    public ProductResponse updateProduct(Long id, ProductRequest request) {

        try {

            Product product = productRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found."));

            product.setProductName(request.getProductName());
            product.setDescription(request.getDescription());
            Category category =
                    categoryRepository.findById(request.getCategoryId())
                            .orElseThrow(() ->
                                    new RuntimeException("Category not found"));

            product.setCategory(category);
            product.setBrand(request.getBrand());

            product.setSuperAdminPrice(request.getSuperAdminPrice());
            product.setAdminPrice(request.getAdminPrice());
            product.setSuperStockistPrice(request.getSuperStockistPrice());
            product.setDistributorPrice(request.getDistributorPrice());
            product.setWholesellerPrice(request.getWholesellerPrice());

            if (request.getImage() != null &&
                    !request.getImage().isEmpty()) {

                if (product.getImageUrl() != null &&
                        !product.getImageUrl().isBlank()) {

                    cloudinaryService.deleteImage(product.getImageUrl());
                }

                String imageUrl =
                        cloudinaryService.uploadImage(request.getImage());

                product.setImageUrl(imageUrl);
            }

            Product updatedProduct =
                    productRepository.save(product);

            return modelMapper.map(updatedProduct, ProductResponse.class);

        } catch (IOException e) {

            throw new RuntimeException("Image upload failed.", e);

        }

    }

    @Override
    public ProductResponse getProductById(Long id) {

        Product product = productRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Product not found."));

        ProductResponse response =
                modelMapper.map(product, ProductResponse.class);

        response.setCategory(
                product.getCategory().getCategoryName()
        );

        return response;

    }

    @Override
    public List<ProductResponse> getAllProducts() {

        return productRepository.findAll()
                .stream()
                .map(product ->
                        modelMapper.map(product, ProductResponse.class))
                .toList();

    }

    @Override
    public void deleteProduct(Long id) {

        try {

            Product product = productRepository.findById(id)
                    .orElseThrow(() ->
                            new RuntimeException("Product not found."));

            if (product.getImageUrl() != null &&
                    !product.getImageUrl().isBlank()) {

                cloudinaryService.deleteImage(product.getImageUrl());
            }

            productRepository.delete(product);

        } catch (IOException e) {

            throw new RuntimeException("Unable to delete image.", e);

        }

    }

}
