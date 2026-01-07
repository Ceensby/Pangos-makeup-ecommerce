package com.example.ecomm.repository;

import com.example.ecomm.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    // All featured products, newest first
    // All featured products, newest first
    List<Product> findByFeaturedTrueOrderByIdDesc();

    List<Product> findByMainCategory(String mainCategory);

    List<Product> findBySubCategory(String subCategory);

    List<Product> findByMainCategoryAndSubCategory(String mainCategory, String subCategory);

    // Basic search in name or description
    List<Product> findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(String name, String description);

    // You can still add other methods here if needed
}
