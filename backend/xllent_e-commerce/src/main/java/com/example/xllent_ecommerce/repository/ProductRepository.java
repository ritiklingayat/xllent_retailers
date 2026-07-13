package com.example.xllent_ecommerce.repository;

import com.example.xllent_ecommerce.entity.Category;
import com.example.xllent_ecommerce.entity.Product;
import com.example.xllent_ecommerce.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByStatus(Status status);

    List<Product> findByCategory(Category category);

    List<Product> findByBrand(String brand);

    boolean existsByProductName(String productName);
}