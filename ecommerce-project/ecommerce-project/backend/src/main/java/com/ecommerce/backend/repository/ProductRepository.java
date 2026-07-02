package com.ecommerce.backend.repository;

import com.ecommerce.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

/**
 * Extending JpaRepository already gives us save(), findAll(), findById(),
 * deleteById() etc. for free. We only declare the extra query methods
 * that Spring Data derives automatically from the method name.
 */
public interface ProductRepository extends JpaRepository<Product, Long> {

    List<Product> findByCategoryIgnoreCase(String category);

    List<Product> findByNameContainingIgnoreCase(String keyword);
}
