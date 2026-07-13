package com.example.xllent_ecommerce.service;

import com.example.xllent_ecommerce.dto.request.ProductRequest;
import com.example.xllent_ecommerce.dto.response.ProductResponse;

import java.util.List;

public interface ProductService {

    ProductResponse addProduct(ProductRequest request);

    ProductResponse updateProduct(Long id, ProductRequest request);

    ProductResponse getProductById(Long id);

    List<ProductResponse> getAllProducts();

    void deleteProduct(Long id);

}