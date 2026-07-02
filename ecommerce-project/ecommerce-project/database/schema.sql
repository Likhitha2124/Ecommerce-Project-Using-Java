-- ============================================================
-- E-commerce database setup
-- Run this whole script in MySQL Workbench (as a SQL script)
-- Note: if you leave spring.jpa.hibernate.ddl-auto=update in
-- application.properties, Spring Boot will auto-create the
-- "products" table for you on first run — in that case you
-- only need the CREATE DATABASE + the sample INSERT statements.
-- ============================================================

CREATE DATABASE IF NOT EXISTS ecommerce_db;
USE ecommerce_db;

CREATE TABLE IF NOT EXISTS products (
    id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(150)   NOT NULL,
    description     VARCHAR(1000),
    price           DECIMAL(10,2)  NOT NULL,
    category        VARCHAR(60),
    stock_quantity  INT            NOT NULL DEFAULT 0,
    image_url       VARCHAR(500),
    created_at      DATETIME
);

-- Sample data so the storefront isn't empty on first run
INSERT INTO products (name, description, price, category, stock_quantity, image_url, created_at) VALUES
('Wireless Headphones', 'Over-ear Bluetooth headphones with noise cancellation', 59.99, 'Electronics', 25, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', NOW()),
('Running Shoes', 'Lightweight breathable running shoes', 74.50, 'Footwear', 40, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', NOW()),
('Ceramic Coffee Mug', 'Hand-glazed 350ml ceramic mug', 12.00, 'Home', 100, 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400', NOW()),
('Backpack', '30L water-resistant travel backpack', 45.00, 'Accessories', 30, 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400', NOW()),
('Smart Watch', 'Fitness tracking smart watch with heart-rate monitor', 129.99, 'Electronics', 15, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400', NOW()),
('Desk Lamp', 'Adjustable LED desk lamp with USB charging port', 22.99, 'Home', 60, 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400', NOW());

-- Sanity check
SELECT * FROM products;
