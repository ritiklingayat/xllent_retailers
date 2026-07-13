package com.example.xllent_ecommerce.service;

import com.example.xllent_ecommerce.dto.request.CategoryRequest;
import com.example.xllent_ecommerce.dto.response.CategoryResponse;

import java.util.List;

public interface CategoryService {

    CategoryResponse createCategory(CategoryRequest request);

    CategoryResponse getCategoryById(Long id);

    List<CategoryResponse> getAllCategories();

    CategoryResponse updateCategory(Long id, CategoryRequest request);

    void deleteCategory(Long id);

}