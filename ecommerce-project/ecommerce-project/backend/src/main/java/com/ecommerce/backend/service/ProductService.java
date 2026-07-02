package com.ecommerce.backend.service;

import com.ecommerce.backend.model.Product;
import com.ecommerce.backend.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    @Autowired
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    // CREATE
    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    // READ - all
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    // READ - one
    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }

    // READ - search by name
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    // READ - filter by category
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryIgnoreCase(category);
    }

    // UPDATE
    public Product updateProduct(Long id, Product incoming) {
        Product existing = getProductById(id);

        existing.setName(incoming.getName());
        existing.setDescription(incoming.getDescription());
        existing.setPrice(incoming.getPrice());
        existing.setCategory(incoming.getCategory());
        existing.setStockQuantity(incoming.getStockQuantity());
        existing.setImageUrl(incoming.getImageUrl());

        return productRepository.save(existing);
    }

    // DELETE
    public void deleteProduct(Long id) {
        Product existing = getProductById(id);
        productRepository.delete(existing);
    }
}
