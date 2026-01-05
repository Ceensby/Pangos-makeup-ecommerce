package com.example.ecomm.controller;

import com.example.ecomm.dto.ProductDTO;
import com.example.ecomm.model.Product;
import com.example.ecomm.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository repository;

    public ProductController(ProductRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/top")
    public List<ProductDTO> getTopFeatured() {
        // No random: list all featured products, newest first
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

    @GetMapping
    public List<ProductDTO> getAll(
            @RequestParam(required = false) String mainCategory,
            @RequestParam(required = false) String subCategory,
            @RequestParam(required = false) String q) {

        List<Product> products;

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
