package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController

// Base URL for product-related endpoints
@RequestMapping("/api/products")
@CrossOrigin(origins = "*") // Allow frontend to access this API
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    // No random: list all featured products, newest first
    @GetMapping("/top")
    public List<ProductDTO> getTopFeatured() {

        List<Product> products = repository.findByFeaturedTrueOrderByIdDesc();

        // Convert Product entities to ProductDTO
        return products.stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getImageUrl(),
                        p.getDetails()))
                .collect(Collectors.toList());
    }

    // Get only featured products
    @GetMapping("/featured")
    public List<ProductDTO> getFeatured() {
        List<Product> products = repository.findByFeaturedTrueOrderByIdDesc();

        return products.stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getImageUrl(),
                        p.getDetails()))
                .collect(Collectors.toList());
    }

    // Returns products with optional filters
    @GetMapping
    public List<ProductDTO> getAll(
            @RequestParam(required = false) String mainCategory,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String q) {

        List<Product> products;

        // Filters
        if (q != null && !q.isEmpty()) {
            products = repository.findByNameContainingIgnoreCaseOrDescriptionContainingIgnoreCase(q, q);
        } else if (mainCategory != null && subCategory != null) {
            products = repository.findByMainCategoryAndSubCategory(mainCategory, subCategory);
        } else if (mainCategory != null) {
            products = repository.findByMainCategory(mainCategory);
        } else if (subCategory != null) {
            products = repository.findBySubCategory(subCategory);
        } else {
            products = repository.findAll();
        }

        // No filters → return all products
        return products.stream()
                .map(p -> new ProductDTO(
                        p.getId(),
                        p.getName(),
                        p.getDescription(),
                        p.getPrice(),
                        p.getImageUrl(),
                        p.getDetails()))
                .collect(Collectors.toList());
    }

    // Convert Product entities to ProductDTO
    @GetMapping("/{id}")
    public ProductDTO getOne(@PathVariable Long id) {
        Product p = repository.findById(id).orElseThrow();
        return new ProductDTO(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getImageUrl(),
                p.getDetails());
    }

}
