-- ========================================================
-- Kartik Watch Shop — Seed Data
-- 31 Luxury Timepieces + Demo Admin & Client Accounts
-- ========================================================

-- Demo Users (passwords: admin123 and client123)
-- Werkzeug-compatible PBKDF2 hashes for demo credentials: admin123 / client123
INSERT INTO `users` (`id`, `name`, `email`, `phone`, `password_hash`, `role`, `created_at`) VALUES
(1, 'Kartik Suthar (Boutique Owner)', 'admin@kartikwatches.com', '+91 98250 12345', 'pbkdf2:sha256:1000000$aH2Tsw1rzUFkoB2Y$bc0d1b21f4400629d67e61ec03fd9f2b89196e19ed6337e548fcb584b968ce81', 'admin', NOW()),
(2, 'Aarav Patel', 'client@kartikwatches.com', '+91 98250 54321', 'pbkdf2:sha256:1000000$SEA6ATg5SFLZ5IFn$2a82d4aae3a9a9a22debe73d577c2343048f43a329cac589d70b6b284e63d565', 'client', NOW())
ON DUPLICATE KEY UPDATE `name` = VALUES(`name`);

-- 31 Master Catalog Products
INSERT INTO `products` (`id`, `name`, `brand`, `category`, `gender`, `price`, `mrp`, `rating`, `reviews`, `specs`, `description`, `image`, `badge`, `stock`, `is_featured`) VALUES
(1, 'Seiko Prospex Speedtimer', 'seiko', 'seiko-mens', 'male', 68000.00, 80200.00, 5.0, 24, '39mm • Solar Chrono Cal. V192', 'Solar-powered precision racing chronograph with tachymeter bezel, 100m water resistance, and curved sapphire crystal.', 'assets/watches/seiko_speedtimer.jpg', 'SEIKO • JAPAN', 8, 1),
(2, 'Seiko Prospex King Samurai Diver', 'seiko', 'seiko-mens', 'male', 54000.00, 63700.00, 4.9, 31, '43.8mm • Auto Cal. 4R35 • 200m ISO', 'Iconic angular diver with waffle pattern dial, ceramic bezel, 200m ISO certification, and LumiBrite hands.', 'assets/watches/seiko_diver.jpg', 'SEIKO • DIVER', 6, 1),
(3, 'Seiko Presage Sharp Edged Series', 'seiko', 'seiko-mens', 'male', 88000.00, 103800.00, 5.0, 19, '39.3mm • Cal. 6R35 • 70h Reserve', 'Traditional Japanese Asanoha hemp-leaf textured dial, 70-hour power reserve, and super-hard coating.', 'assets/watches/seiko_presage.jpg', 'SEIKO • PRESAGE', 5, 1),
(4, 'Seiko Lukia Solar Diamond Ladies', 'seiko', 'seiko-womens', 'female', 48000.00, 56600.00, 5.0, 14, '28mm • Solar Quartz Cal. V137', 'Fluted bezel in rose gold tone, genuine diamond markers on an iridescent mother-of-pearl dial, sapphire glass.', 'assets/watches/seiko_lukia.jpg', 'SEIKO • JAPAN', 9, 0),
(5, 'Seiko Presage Cocktail Time Bellini', 'seiko', 'seiko-womens', 'female', 42000.00, 49600.00, 4.8, 18, '33.8mm • Auto Cal. 4R35', 'Sunburst guilloche dial inspired by Tokyo cocktail culture, box-shaped crystal, and exhibition case back.', 'assets/watches/seiko_cocktail.jpg', 'SEIKO • ELEGANCE', 7, 0),

(6, 'Citizen Promaster Skyhawk A-T', 'citizen', 'citizen-mens', 'male', 58000.00, 68400.00, 5.0, 42, '45mm • Eco-Drive Atomic U680', 'Radio-controlled atomic timekeeping in 43 cities, perpetual calendar chronograph powered by any light.', 'assets/watches/citizen_skyhawk.jpg', 'CITIZEN • ECO-DRIVE', 10, 1),
(7, 'Citizen Promaster Marine Mechanical Diver', 'citizen', 'citizen-mens', 'male', 62000.00, 73200.00, 4.9, 27, '41mm • Auto Cal. 9051 • 200m ISO', 'Super Titanium magnetic-resistant automatic diver with 200m ISO rating and high-luminosity indices.', 'assets/watches/citizen_marine.jpg', 'CITIZEN • DIVER', 4, 1),
(8, 'Citizen Series 8 Automatic 831', 'citizen', 'citizen-mens', 'male', 95000.00, 112100.00, 4.9, 15, '40mm • Cal. 9051 • Anti-Magnetic', 'Sleek geometric case with octagonal bezel, high-beat anti-magnetic automatic movement, and sapphire crystal.', 'assets/watches/citizen_series8.jpg', 'CITIZEN • SERIES 8', 3, 1),
(9, 'Citizen L Ambiluna Eco-Drive', 'citizen', 'citizen-womens', 'female', 36000.00, 42500.00, 4.9, 21, '31mm • Eco-Drive Cal. E031', 'Poetic minimalist luxury with frosted moon sapphire glass, urushi drop emblem, and sustainably powered by light.', 'assets/watches/citizen_ambiluna.jpg', 'CITIZEN • ECO-DRIVE', 11, 0),

(10, 'Tissot PRX Chrono Automatic', 'tissot', 'tissot-mens', 'male', 155000.00, 182900.00, 4.9, 39, '42mm • Valjoux A05.H31 • 60h', 'Integrated bracelet chronograph with blue panda dial, 60-hour power reserve, and transparent case back.', 'assets/watches/tissot_prx.jpg', 'TISSOT • SWISS', 2, 1),
(11, 'Tissot Seastar 1000 Powermatic 80', 'tissot', 'tissot-mens', 'male', 72000.00, 85000.00, 4.8, 35, '43mm • Powermatic 80 • 300m', 'Professional 300m Swiss dive watch with unidirectional ceramic bezel and Nivachron balance spring.', 'assets/watches/tissot_seastar.jpg', 'TISSOT • SWISS', 6, 1),
(12, 'Tissot T-Touch Connect Solar', 'tissot', 'tissot-mens', 'male', 88000.00, 103800.00, 4.8, 20, '47mm • Solar Smart • Titanium', 'Swiss-made solar hybrid smartwatch with tactile sapphire touchscreen, activity tracker, and 6-month battery.', 'assets/watches/tissot_ttouch.jpg', 'TISSOT • SMART', 5, 0),
(13, 'Tissot Gentleman Powermatic 80 Silicium', 'tissot', 'tissot-mens', 'male', 68000.00, 80200.00, 4.8, 28, '40mm • Powermatic 80 Silicium', 'Versatile gentleman\'s Swiss automatic with anti-magnetic silicon hairspring and crosshair blue dial.', 'assets/watches/tissot_gentleman.jpg', 'TISSOT • SWISS', 7, 1),
(14, 'Tissot Bellissima Small Lady', 'tissot', 'tissot-womens', 'female', 38500.00, 45400.00, 4.9, 16, '29mm • Swiss Quartz • Guilloche', 'Timeless Roman numerals, silver guilloche rosette dial, and cabochon crown for day-to-night Swiss grace.', 'assets/watches/tissot_celestia.jpg', 'TISSOT • ELEGANCE', 8, 0),
(15, 'Tissot Flamingo Two-Tone', 'tissot', 'tissot-womens', 'female', 32000.00, 37800.00, 4.7, 12, '30mm • ETA Swiss Quartz', 'Jewelry watch with asymmetric lugs, iridescent mother-of-pearl dial, and yellow gold PVD bicolour bracelet.', 'assets/watches/tissot_flamingo.jpg', 'TISSOT • SWISS', 9, 0),

(16, 'Casio G-Shock MT-G Carbon Titanium', 'casio', 'casio-smart-mens', 'male', 79999.00, 94400.00, 4.9, 44, 'Carbon Core • Tough Solar • BT', 'Triple G Resist, Bluetooth smartphone link, Multi-Band 6 atomic time, sapphire crystal, and dual core guard.', 'assets/watches/casio_gsmart_titanium.jpg', 'G-SHOCK • MT-G', 3, 1),
(17, 'Casio Pro Trek PRG-340 Solar', 'casio', 'casio-smart-mens', 'male', 24500.00, 28900.00, 4.7, 50, 'Triple Sensor • Tough Solar • 100m', 'Outdoor tactical timepiece with digital compass, altimeter, barometer, thermometer, and duplex LCD.', 'assets/watches/casio_protrek.jpg', 'CASIO PRO TREK', 12, 0),
(18, 'Casio G-Shock Mudmaster GWG-B1000', 'casio', 'casio-smart-mens', 'male', 48500.00, 57200.00, 4.8, 38, 'Mud Resist • Solar • Triple Sensor', 'Indestructible master of G built for extreme terrains with carbon-reinforced resin and sapphire glass.', 'assets/watches/casio_gshock_gbd.jpg', 'G-SHOCK • TOUGH', 6, 1),
(19, 'Casio Edifice EQB-2000 Sospensione', 'casio', 'casio-smart-mens', 'male', 34500.00, 40700.00, 4.7, 23, '47mm • Solar • BT Smartphone Link', 'Motorsport-inspired suspension arm lug design, Bluetooth automatic time calibration, and lap timer.', 'assets/watches/casio_edifice_eqb.jpg', 'CASIO EDIFICE', 8, 0),
(20, 'Casio Edifice ECB-900 Racing Chrono', 'casio', 'casio-smart-mens', 'male', 18500.00, 21800.00, 4.6, 62, '48mm • Solar Chrono • World Time', 'Speed indicator, dual auto LED super illuminator, Bluetooth phone sync, and 1/1000-second stopwatch.', 'assets/watches/casio_edifice_ecb.jpg', 'CASIO EDIFICE', 15, 0),

(21, 'Casio Baby-G BGA-280 Pastel Series', 'casio', 'casio-smart-womens', 'female', 7995.00, 9400.00, 4.6, 33, 'Shock Resist • 100m • World Time', 'Chic round pastel design, shock resistance, super illuminator backlight, and 3-year battery life.', 'assets/watches/casio_baby_g.jpg', 'CASIO BABY-G', 14, 0),
(22, 'Casio Sheen SHE-4543 Diamond Slim', 'casio', 'casio-smart-womens', 'female', 9995.00, 11800.00, 4.5, 29, '32mm • Solar • Sapphire • Crystals', 'Ultra-slim 6.4mm profile, scratch-resistant sapphire crystal with anti-glare, Swarovski crystals on bezel.', 'assets/watches/casio_sheen.jpg', 'CASIO SHEEN', 10, 0),
(23, 'Casio Sheen SHE-4554 Peach Gold', 'casio', 'casio-smart-womens', 'female', 11995.00, 14200.00, 4.6, 25, '31mm • Sapphire • Peach Gold IP', 'Minimalist dial with crystal hour markers, genuine Milanese steel mesh strap, and 50m water resistance.', 'assets/watches/casio_sheen_sapphire.jpg', 'CASIO SHEEN', 11, 0),
(24, 'Casio Lineage LCW-M100 Titanium Solar', 'casio', 'casio-smart-womens', 'female', 16500.00, 19500.00, 4.7, 19, 'Pure Titanium • Solar • Radio Wave', 'Ultra-light pure titanium construction with Multi-Band 6 radio wave atomic precision and sapphire crystal.', 'assets/watches/casio_lineage.jpg', 'CASIO LINEAGE', 8, 0),
(25, 'Casio Vintage A1000 All-Metal Luxury', 'casio', 'casio-smart-womens', 'female', 8995.00, 10600.00, 4.5, 47, 'Solid Steel • Mother of Pearl • LED', 'Premium all-stainless steel vintage icon with natural mother-of-pearl dial face and Milanese bracelet.', 'assets/watches/casio_ws_b1500.jpg', 'CASIO VINTAGE', 16, 0),

(26, 'Hamilton Khaki Field Mechanical', 'hamilton', 'hamilton-mens', 'male', 54500.00, 64300.00, 4.9, 41, '38mm • Hand-Wound H-50 • 80h', 'Original soldier\'s military field watch, 80-hour power reserve hand-wound movement, matte steel case, NATO strap.', 'assets/watches/hamilton_khaki.jpg', 'HAMILTON • SWISS', 5, 1),
(27, 'Hamilton Jazzmaster Open Heart Auto', 'hamilton', 'hamilton-mens', 'male', 92000.00, 108600.00, 4.9, 36, '42mm • Cal. H-10 • 80h Reserve', 'Precision cut-out dial showcasing the ticking Swiss balance wheel and escapement with Côtes de Genève finish.', 'assets/watches/hamilton_jazzmaster.jpg', 'HAMILTON • SWISS', 4, 1),
(28, 'Hamilton Intra-Matic Auto Chrono', 'hamilton', 'hamilton-mens', 'male', 185000.00, 218300.00, 4.8, 17, '40mm • Cal. H-31 • 60h Chrono', 'Classic 1968 vintage panda chronograph remake with reverse panda sub-dials, box sapphire, and leather strap.', 'assets/watches/hamilton_intramatic.jpg', 'HAMILTON • HERITAGE', 2, 1),
(29, 'Hamilton Ventura Elvis80 Auto', 'hamilton', 'hamilton-womens', 'female', 128000.00, 151000.00, 4.8, 22, '42.5mm • Asymmetric Shield • H-10', 'The world\'s first electric watch icon with dramatic triangular shield case, sapphire crystal, and 80-hour power reserve.', 'assets/watches/hamilton_ventura.jpg', 'HAMILTON • ICONIC', 3, 1),
(30, 'Hamilton Jazzmaster Lady Auto', 'hamilton', 'hamilton-womens', 'female', 74000.00, 87300.00, 4.7, 15, '30mm • ETA 2671 Automatic', 'Exquisite Swiss automatic for women with mother-of-pearl dial, diamond index markers, and exhibition case back.', 'assets/watches/hamilton_jazzmaster_lady.jpg', 'HAMILTON • ELEGANCE', 6, 0),
(31, 'Hamilton Ardmore Heritage Art Deco', 'hamilton', 'hamilton-womens', 'female', 46000.00, 54300.00, 4.8, 18, '18.7x27mm • Swiss Quartz', 'Rectangular 1937 Art Deco silhouette with emerald leather strap, silver dial, and vintage Roman numerals.', 'assets/watches/hamilton_ardmore.jpg', 'HAMILTON • ART DECO', 7, 0)
ON DUPLICATE KEY UPDATE 
    `name` = VALUES(`name`),
    `price` = VALUES(`price`),
    `mrp` = VALUES(`mrp`),
    `stock` = VALUES(`stock`);

-- Sample initial Service Booking for Mehsana Atelier
INSERT INTO `service_bookings` (`id`, `booking_reference`, `user_id`, `client_name`, `client_phone`, `client_email`, `service_id`, `service_name`, `service_price`, `watch_brand`, `watch_model`, `appointment_date`, `appointment_slot`, `delivery_mode`, `payment_status`, `payment_method`, `booking_status`, `notes`) VALUES
(1, 'KWS-SRV-782194', 2, 'Aarav Patel', '+91 98250 54321', 'client@kartikwatches.com', 'mechanical-calib', 'Mechanical Calibration & Timing Regulation', 1500.00, 'Seiko', 'Prospex Speedtimer', DATE_ADD(CURDATE(), INTERVAL 3 DAY), '11:00 AM - 01:00 PM', 'Mehsana Boutique Walk-in', 'paid', 'UPI QR', 'confirmed', 'Customer requested accuracy tuning within COSC parameters.')
ON DUPLICATE KEY UPDATE `booking_reference` = VALUES(`booking_reference`);

-- Sample initial E-Commerce Order
INSERT INTO `orders` (`id`, `order_number`, `user_id`, `client_name`, `client_email`, `client_phone`, `shipping_address`, `city`, `state`, `pincode`, `payment_method`, `payment_status`, `transaction_id`, `total_amount`, `order_status`, `notes`) VALUES
(1, 'KWS-ORD-419208', 2, 'Aarav Patel', 'client@kartikwatches.com', '+91 98250 54321', 'Shivalik Heights, Radhanpur Road', 'Mehsana', 'Gujarat', '384002', 'UPI (Google Pay)', 'verified', 'TXN-UPI-9928104', 68000.00, 'placed', 'Complimentary gift packaging requested.')
ON DUPLICATE KEY UPDATE `order_number` = VALUES(`order_number`);

INSERT INTO `order_items` (`id`, `order_id`, `product_id`, `product_name`, `price`, `quantity`, `subtotal`) VALUES
(1, 1, 1, 'Seiko Prospex Speedtimer', 68000.00, 1, 68000.00)
ON DUPLICATE KEY UPDATE `product_name` = VALUES(`product_name`);

-- Sample initial Pre-Owned Watch Sell Valuation
INSERT INTO `sell_inquiries` (`id`, `reference_no`, `user_id`, `client_name`, `client_phone`, `client_email`, `watch_brand`, `model_name`, `condition_state`, `purchase_year`, `has_box`, `has_papers`, `has_receipt`, `has_extra_strap`, `expected_price`, `status`, `notes`) VALUES
(1, 'KWS-VAL-601932', 2, 'Aarav Patel', '+91 98250 54321', 'client@kartikwatches.com', 'Tissot', 'PRX Powermatic 80 Blue', 'Excellent (Minor hairlines)', 2023, 1, 1, 1, 0, 48000.00, 'reviewing', 'Complete set with original warranty card and invoice from authorized dealer.')
ON DUPLICATE KEY UPDATE `reference_no` = VALUES(`reference_no`);
