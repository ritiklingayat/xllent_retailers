package com.example.xllent_ecommerce.repository;

import com.example.xllent_ecommerce.entity.Category;
import com.example.xllent_ecommerce.entity.Status;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    Optional<Category> findByCategoryName(String categoryName);

    boolean existsByCategoryName(String categoryName);

    List<Category> findByStatus(Status status);

}