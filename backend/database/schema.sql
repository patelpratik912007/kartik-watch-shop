-- ========================================================
-- Kartik Watch Shop — Relational Database Schema
-- Database: kartik_watch_shop
-- ========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- 1. USERS & CLIENT ACCOUNTS
CREATE TABLE IF NOT EXISTS `users` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(191) NOT NULL UNIQUE,
    `phone` VARCHAR(50) DEFAULT NULL,
    `password_hash` VARCHAR(255) DEFAULT NULL,
    `role` ENUM('client', 'admin') DEFAULT 'client',
    `google_id` VARCHAR(191) DEFAULT NULL,
    `avatar` VARCHAR(255) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_email` (`email`),
    INDEX `idx_users_role` (`role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. PRODUCTS / MASTER WATCH CATALOG
CREATE TABLE IF NOT EXISTS `products` (
    `id` INT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL,
    `brand` VARCHAR(100) NOT NULL,
    `category` VARCHAR(100) NOT NULL,
    `gender` ENUM('male', 'female', 'unisex') DEFAULT 'male',
    `price` DECIMAL(12, 2) NOT NULL,
    `mrp` DECIMAL(12, 2) NOT NULL,
    `rating` DECIMAL(3, 1) DEFAULT 4.8,
    `reviews` INT DEFAULT 18,
    `specs` VARCHAR(255) NOT NULL,
    `description` TEXT NOT NULL,
    `image` VARCHAR(255) NOT NULL,
    `badge` VARCHAR(100) DEFAULT NULL,
    `stock` INT DEFAULT 10,
    `is_featured` TINYINT(1) DEFAULT 0,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_products_brand` (`brand`),
    INDEX `idx_products_category` (`category`),
    INDEX `idx_products_gender` (`gender`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. ORDERS (E-Commerce Store Orders)
CREATE TABLE IF NOT EXISTS `orders` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_number` VARCHAR(60) NOT NULL UNIQUE,
    `user_id` INT DEFAULT NULL,
    `client_name` VARCHAR(150) NOT NULL,
    `client_email` VARCHAR(191) NOT NULL,
    `client_phone` VARCHAR(50) NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(100) DEFAULT 'Gujarat',
    `pincode` VARCHAR(20) NOT NULL,
    `payment_method` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('pending', 'verified', 'failed') DEFAULT 'verified',
    `transaction_id` VARCHAR(100) DEFAULT NULL,
    `total_amount` DECIMAL(12, 2) NOT NULL,
    `order_status` ENUM('placed', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'placed',
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_orders_ref` (`order_number`),
    INDEX `idx_orders_status` (`order_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. ORDER ITEMS (Line items of an order)
CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `order_id` INT NOT NULL,
    `product_id` INT NOT NULL,
    `product_name` VARCHAR(255) NOT NULL,
    `price` DECIMAL(12, 2) NOT NULL,
    `quantity` INT NOT NULL DEFAULT 1,
    `subtotal` DECIMAL(12, 2) NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE,
    INDEX `idx_order_items_order` (`order_id`),
    INDEX `idx_order_items_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SERVICE BOOKINGS (Watch Atelier Repairs & Maintenance)
CREATE TABLE IF NOT EXISTS `service_bookings` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `booking_reference` VARCHAR(60) NOT NULL UNIQUE,
    `user_id` INT DEFAULT NULL,
    `client_name` VARCHAR(150) NOT NULL,
    `client_phone` VARCHAR(50) NOT NULL,
    `client_email` VARCHAR(191) NOT NULL,
    `service_id` VARCHAR(100) NOT NULL,
    `service_name` VARCHAR(255) NOT NULL,
    `service_price` DECIMAL(10, 2) NOT NULL,
    `watch_brand` VARCHAR(100) NOT NULL,
    `watch_model` VARCHAR(150) NOT NULL,
    `appointment_date` DATE NOT NULL,
    `appointment_slot` VARCHAR(50) NOT NULL,
    `delivery_mode` VARCHAR(50) NOT NULL,
    `payment_status` ENUM('pending', 'paid') DEFAULT 'paid',
    `payment_method` VARCHAR(50) DEFAULT 'UPI QR',
    `booking_status` ENUM('confirmed', 'in_progress', 'completed', 'cancelled') DEFAULT 'confirmed',
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_srv_ref` (`booking_reference`),
    INDEX `idx_srv_status` (`booking_status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. SELL INQUIRIES (Pre-Owned Watch Valuation & Buyback)
CREATE TABLE IF NOT EXISTS `sell_inquiries` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `reference_no` VARCHAR(60) NOT NULL UNIQUE,
    `user_id` INT DEFAULT NULL,
    `client_name` VARCHAR(150) NOT NULL,
    `client_phone` VARCHAR(50) NOT NULL,
    `client_email` VARCHAR(191) NOT NULL,
    `watch_brand` VARCHAR(100) NOT NULL,
    `model_name` VARCHAR(255) NOT NULL,
    `condition_state` VARCHAR(50) NOT NULL,
    `purchase_year` INT DEFAULT NULL,
    `has_box` TINYINT(1) DEFAULT 0,
    `has_papers` TINYINT(1) DEFAULT 0,
    `has_receipt` TINYINT(1) DEFAULT 0,
    `has_extra_strap` TINYINT(1) DEFAULT 0,
    `expected_price` DECIMAL(12, 2) DEFAULT NULL,
    `status` ENUM('submitted', 'reviewing', 'offer_made', 'accepted', 'rejected') DEFAULT 'submitted',
    `notes` TEXT DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL,
    INDEX `idx_sell_ref` (`reference_no`),
    INDEX `idx_sell_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;
