-- ========================================================
-- Kartik Watch Shop — SQLite Schema (Cloud & Zero-Config Fallback)
-- ========================================================

CREATE TABLE IF NOT EXISTS `users` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `name` TEXT NOT NULL,
    `email` TEXT NOT NULL UNIQUE,
    `phone` TEXT DEFAULT NULL,
    `password_hash` TEXT DEFAULT NULL,
    `role` TEXT DEFAULT 'client',
    `google_id` TEXT DEFAULT NULL,
    `avatar` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `products` (
    `id` INTEGER PRIMARY KEY,
    `name` TEXT NOT NULL,
    `brand` TEXT NOT NULL,
    `category` TEXT NOT NULL,
    `gender` TEXT DEFAULT 'male',
    `price` REAL NOT NULL,
    `mrp` REAL NOT NULL,
    `rating` REAL DEFAULT 4.8,
    `reviews` INTEGER DEFAULT 18,
    `specs` TEXT NOT NULL,
    `description` TEXT NOT NULL,
    `image` TEXT NOT NULL,
    `badge` TEXT DEFAULT NULL,
    `stock` INTEGER DEFAULT 10,
    `is_featured` INTEGER DEFAULT 0,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS `orders` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `order_number` TEXT NOT NULL UNIQUE,
    `user_id` INTEGER DEFAULT NULL,
    `client_name` TEXT NOT NULL,
    `client_email` TEXT NOT NULL,
    `client_phone` TEXT NOT NULL,
    `shipping_address` TEXT NOT NULL,
    `city` TEXT NOT NULL,
    `state` TEXT DEFAULT 'Gujarat',
    `pincode` TEXT NOT NULL,
    `payment_method` TEXT NOT NULL,
    `payment_status` TEXT DEFAULT 'verified',
    `transaction_id` TEXT DEFAULT NULL,
    `total_amount` REAL NOT NULL,
    `order_status` TEXT DEFAULT 'placed',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `order_items` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `order_id` INTEGER NOT NULL,
    `product_id` INTEGER NOT NULL,
    `product_name` TEXT NOT NULL,
    `price` REAL NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 1,
    `subtotal` REAL NOT NULL,
    FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `service_bookings` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `booking_reference` TEXT NOT NULL UNIQUE,
    `user_id` INTEGER DEFAULT NULL,
    `client_name` TEXT NOT NULL,
    `client_phone` TEXT NOT NULL,
    `client_email` TEXT NOT NULL,
    `service_id` TEXT NOT NULL,
    `service_name` TEXT NOT NULL,
    `service_price` REAL NOT NULL,
    `watch_brand` TEXT NOT NULL,
    `watch_model` TEXT NOT NULL,
    `appointment_date` TEXT NOT NULL,
    `appointment_slot` TEXT NOT NULL,
    `delivery_mode` TEXT NOT NULL,
    `client_address` TEXT DEFAULT NULL,
    `special_requests` TEXT DEFAULT NULL,
    `payment_status` TEXT DEFAULT 'pending',
    `payment_method` TEXT DEFAULT 'UPI QR',
    `transaction_id` TEXT DEFAULT NULL,
    `booking_status` TEXT DEFAULT 'confirmed',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `sell_inquiries` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `reference_no` TEXT NOT NULL UNIQUE,
    `user_id` INTEGER DEFAULT NULL,
    `client_name` TEXT NOT NULL,
    `client_phone` TEXT NOT NULL,
    `client_email` TEXT NOT NULL,
    `watch_brand` TEXT NOT NULL,
    `model_name` TEXT NOT NULL,
    `condition_state` TEXT NOT NULL,
    `purchase_year` INTEGER DEFAULT NULL,
    `has_box` INTEGER DEFAULT 0,
    `has_papers` INTEGER DEFAULT 0,
    `has_receipt` INTEGER DEFAULT 0,
    `has_extra_strap` INTEGER DEFAULT 0,
    `expected_price` REAL DEFAULT NULL,
    `status` TEXT DEFAULT 'submitted',
    `notes` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS `audit_log` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `user_id` INTEGER DEFAULT NULL,
    `action` TEXT NOT NULL,
    `entity_type` TEXT NOT NULL,
    `entity_id` INTEGER DEFAULT NULL,
    `details` TEXT DEFAULT NULL,
    `ip_address` TEXT DEFAULT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
