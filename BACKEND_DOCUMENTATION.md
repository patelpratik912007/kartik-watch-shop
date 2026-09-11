# Kartik Watch Shop — Backend Documentation
### Python Flask Backend • Complete Understanding Guide
**Version 2.0** | Last Updated: 2026-09-08

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [How to Start the Server](#2-how-to-start-the-server)
3. [Database Schema & Tables](#3-database-schema--tables)
4. [API Endpoints Reference](#4-api-endpoints-reference)
5. [Data Flow — How Frontend Connects to Backend](#5-data-flow--how-frontend-connects-to-backend)
6. [Authentication Flow](#6-authentication-flow)
7. [How Each Form Saves Data to the Database](#7-how-each-form-saves-data-to-the-database)
8. [Error Handling](#8-error-handling)
9. [Bugs Fixed from PHP Backend](#9-bugs-fixed-from-php-backend)
10. [How to Add / Modify Data](#10-how-to-add--modify-data)
11. [File Structure Map](#11-file-structure-map)

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐      │
│  │index.html│ │cart.html  │ │sell.html  │ │auth.html │ ... │
│  └─────┬────┘ └─────┬────┘ └─────┬────┘ └─────┬────┘      │
│        │            │            │            │             │
│        └────────────┴────────────┴────────────┘             │
│                         │ fetch() calls                     │
└─────────────────────────┼───────────────────────────────────┘
                          │ HTTP (JSON)
                          ▼
┌─────────────────────────────────────────────────────────────┐
│              PYTHON FLASK SERVER (port 5000)                │
│                                                             │
│  app.py (main entry)                                        │
│    ├── /api/auth/*       → routes/auth.py                   │
│    ├── /api/products/*   → routes/products.py               │
│    ├── /api/orders/*     → routes/orders.py                 │
│    ├── /api/services/*   → routes/services.py               │
│    ├── /api/sell/*       → routes/sell.py                    │
│    ├── /api/stats        → routes/stats.py                  │
│    └── /frontend/*       → serves static HTML/CSS/JS        │
│                                                             │
│  db.py ────── MySQL connection helper ──────────────────┐   │
│  config.py ── environment config                        │   │
└─────────────────────────────────────────────────────────┼───┘
                                                          │
                                                          ▼
┌─────────────────────────────────────────────────────────────┐
│                MySQL (XAMPP / MariaDB)                       │
│                Database: kartik_watch_shop                   │
│                                                             │
│  Tables: users, products, orders, order_items,              │
│          service_bookings, sell_inquiries                   │
└─────────────────────────────────────────────────────────────┘
```

**Key Points:**
- The frontend is plain HTML/CSS/JS (no framework)
- The backend is Python Flask serving JSON APIs
- Flask also serves the frontend static files (no separate web server needed)
- Database is MySQL running via XAMPP

---

## 2. How to Start the Server

### Prerequisites
- **Python 3.10+** installed (with `pip`)
- **MySQL running** (XAMPP → Start MySQL, or standalone MySQL)

### Option A: One-Click Launcher (Windows)
```
Double-click: start-server-python.bat
```
This will automatically:
1. Check Python is installed
2. Install dependencies (`pip install -r requirements.txt`)
3. Run database setup (create tables + seed data)
4. Start Flask server at `http://localhost:5000`
5. Open the frontend in your browser

### Option B: Manual Steps
```bash
# Step 1: Install dependencies
cd backend-python
pip install -r requirements.txt

# Step 2: Setup database (first time only)
python setup_db.py

# Step 3: Start server
python app.py
```

### Server URLs
| URL | Purpose |
|-----|---------|
| `http://localhost:5000/` | Redirects to frontend |
| `http://localhost:5000/frontend/index.html` | Homepage |
| `http://localhost:5000/api/products` | Products API |
| `http://localhost:5000/api/health` | Health check |

---

## 3. Database Schema & Tables

The database `kartik_watch_shop` contains **7 tables**:

### 3.1 `users` — Customer & Admin Accounts
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `name` | VARCHAR(150) | Full name |
| `email` | VARCHAR(191) | Email (unique) |
| `phone` | VARCHAR(50) | Phone number |
| `password_hash` | VARCHAR(255) | Hashed password (bcrypt/pbkdf2) |
| `role` | ENUM('client','admin') | Account type |
| `google_id` | VARCHAR(191) | Google OAuth ID |
| `avatar` | VARCHAR(255) | Profile image URL |
| `created_at` | TIMESTAMP | Registration date |
| `updated_at` | TIMESTAMP | Last update |

**Demo Accounts (seeded):**
- Admin: `admin@kartikwatches.com` / `admin123`
- Client: `client@kartikwatches.com` / `client123`

---

### 3.2 `products` — Watch Catalog (31 watches)
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Primary key (1-31) |
| `name` | VARCHAR(255) | Watch name |
| `brand` | VARCHAR(100) | Brand slug (seiko, citizen, tissot, casio, hamilton) |
| `category` | VARCHAR(100) | Category slug (e.g., seiko-mens, tissot-womens) |
| `gender` | ENUM('male','female','unisex') | Target gender |
| `price` | DECIMAL(12,2) | Selling price in INR |
| `mrp` | DECIMAL(12,2) | Maximum retail price (strikethrough price) |
| `rating` | DECIMAL(3,1) | Star rating (1.0-5.0) |
| `reviews` | INT | Number of reviews |
| `specs` | VARCHAR(255) | Technical specifications |
| `description` | TEXT | Full description |
| `image` | VARCHAR(255) | Image path (relative to frontend/) |
| `badge` | VARCHAR(100) | Display badge text |
| `stock` | INT | Available quantity |
| `is_featured` | TINYINT(1) | Show on homepage? |
| `created_at` | TIMESTAMP | Date added |

**Brand Distribution:** Seiko (5), Citizen (4), Tissot (6), Casio (10), Hamilton (6) = **31 total**

---

### 3.3 `orders` — E-Commerce Orders
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `order_number` | VARCHAR(60) | Reference (KWS-ORD-XXXXXX) |
| `user_id` | INT (FK→users) | Logged-in user (nullable) |
| `client_name` | VARCHAR(150) | Customer name |
| `client_email` | VARCHAR(191) | Customer email |
| `client_phone` | VARCHAR(50) | Customer phone |
| `shipping_address` | TEXT | Delivery address |
| `city` | VARCHAR(100) | City |
| `state` | VARCHAR(100) | State (default: Gujarat) |
| `pincode` | VARCHAR(20) | PIN code |
| `payment_method` | VARCHAR(50) | UPI, Card, NetBanking, etc. |
| `payment_status` | ENUM('pending','verified','failed') | Payment state |
| `transaction_id` | VARCHAR(100) | Payment transaction ref |
| `total_amount` | DECIMAL(12,2) | Total order value |
| `order_status` | ENUM('placed','processing','shipped','delivered','cancelled') | Order state |
| `notes` | TEXT | Customer notes |
| `created_at` | TIMESTAMP | Order date |

---

### 3.4 `order_items` — Line Items of Each Order
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `order_id` | INT (FK→orders) | Parent order |
| `product_id` | INT | Watch product ID |
| `product_name` | VARCHAR(255) | Watch name (denormalized) |
| `price` | DECIMAL(12,2) | Unit price |
| `quantity` | INT | Quantity ordered |
| `subtotal` | DECIMAL(12,2) | price × quantity |

---

### 3.5 `service_bookings` — Watch Repair & Calibration
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `booking_reference` | VARCHAR(60) | Reference (KWS-SRV-XXXXXX) |
| `user_id` | INT (FK→users) | Logged-in user (nullable) |
| `client_name` | VARCHAR(150) | Customer name |
| `client_phone` | VARCHAR(50) | Customer phone |
| `client_email` | VARCHAR(191) | Customer email |
| `service_id` | VARCHAR(100) | Service type identifier |
| `service_name` | VARCHAR(255) | Human-readable service name |
| `service_price` | DECIMAL(10,2) | Service cost |
| `watch_brand` | VARCHAR(100) | Watch brand being serviced |
| `watch_model` | VARCHAR(150) | Watch model |
| `appointment_date` | DATE | Scheduled date |
| `appointment_slot` | VARCHAR(50) | Time slot |
| `delivery_mode` | VARCHAR(50) | Walk-in / Courier |
| `payment_status` | ENUM('pending','paid') | Payment state |
| `payment_method` | VARCHAR(50) | Payment method |
| `booking_status` | ENUM('confirmed','in_progress','completed','cancelled') | Booking state |
| `notes` | TEXT | Special instructions |
| `created_at` | TIMESTAMP | Booking date |

---

### 3.6 `sell_inquiries` — Pre-Owned Watch Valuation
| Column | Type | Description |
|--------|------|-------------|
| `id` | INT (auto) | Primary key |
| `reference_no` | VARCHAR(60) | Reference (KWS-VAL-XXXXXX) |
| `user_id` | INT (FK→users) | Logged-in user (nullable) |
| `client_name` | VARCHAR(150) | Seller name |
| `client_phone` | VARCHAR(50) | Seller phone |
| `client_email` | VARCHAR(191) | Seller email |
| `watch_brand` | VARCHAR(100) | Watch brand |
| `model_name` | VARCHAR(255) | Watch model |
| `condition_state` | VARCHAR(50) | Condition (Excellent/Good/Fair) |
| `purchase_year` | INT | Year of purchase |
| `has_box` | TINYINT(1) | Original box included? |
| `has_papers` | TINYINT(1) | Papers/warranty included? |
| `has_receipt` | TINYINT(1) | Receipt included? |
| `has_extra_strap` | TINYINT(1) | Extra strap included? |
| `expected_price` | DECIMAL(12,2) | Seller's expected price |
| `status` | ENUM('submitted','reviewing','offer_made','accepted','rejected') | Inquiry state |
| `notes` | TEXT | Additional details |
| `created_at` | TIMESTAMP | Submission date |


---

### Table Relationships Diagram
```
users (1) ──────┬──── (many) orders
                │              │
                │              └──── (many) order_items
                │
                ├──── (many) service_bookings
                │
                └──── (many) sell_inquiries

products (referenced by) ──── order_items.product_id
```

---

## 4. API Endpoints Reference

### 4.1 Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|:---:|
| `GET` | `/api/auth/me` | Get current session user | No |
| `POST` | `/api/auth/register` | Create new account | No |
| `POST` | `/api/auth/login` | Login with email+password | No |
| `POST` | `/api/auth/google` | Google sign-in | No |
| `POST` | `/api/auth/logout` | Clear session | No |

#### POST `/api/auth/register`
```json
// REQUEST BODY
{
  "name": "Kartik Suthar",
  "email": "kartik@example.com",
  "phone": "+91 98250 12345",
  "password": "SecurePass@123"
}

// RESPONSE (201)
{
  "success": true,
  "message": "Registration successful! Welcome to Kartik Watch Shop.",
  "user": {
    "id": 3,
    "name": "Kartik Suthar",
    "email": "kartik@example.com",
    "phone": "+91 98250 12345",
    "role": "client"
  }
}
```

#### POST `/api/auth/login`
```json
// REQUEST BODY
{ "email": "admin@kartikwatches.com", "password": "admin123" }

// RESPONSE (200)
{
  "success": true,
  "message": "Login successful.",
  "user": { "id": 1, "name": "Kartik Suthar (Boutique Owner)", "email": "admin@kartikwatches.com", "role": "admin" }
}

// ERROR (401)
{ "success": false, "error": "Invalid email or password." }
```

---

### 4.2 Products (`/api/products`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/products` | List all (with filters) |
| `GET` | `/api/products/<id>` | Single product + related |

#### GET `/api/products` — Query Parameters
| Param | Type | Example | Description |
|-------|------|---------|-------------|
| `brand` | string | `seiko` | Filter by brand |
| `gender` | string | `female` | Filter by gender |
| `category` | string | `tissot-mens` | Filter by category |
| `search` | string | `diver` | Search name/specs/brand |
| `sort` | string | `price_asc` | Sort: price_asc, price_desc, rating, name, default |
| `limit` | int | `5` | Max results |

```
GET /api/products?brand=seiko&gender=male&sort=price_desc
```

#### GET `/api/products/1`
```json
// RESPONSE (200)
{
  "success": true,
  "product": {
    "id": 1,
    "name": "Seiko Prospex Speedtimer",
    "brand": "seiko",
    "price": 68000.0,
    "mrp": 80200.0,
    "rating": 5.0,
    "desc": "Solar-powered precision racing chronograph...",
    "image": "assets/watches/seiko_speedtimer.jpg",
    "stock": 8,
    "is_featured": true,
    "related": [ /* 3 same-brand watches */ ]
  }
}
```

---

### 4.3 Orders (`/api/orders`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/orders` | Place new order |
| `GET` | `/api/orders` | List recent 50 |
| `GET` | `/api/orders/<order_number>` | Single order |

#### POST `/api/orders`
```json
// REQUEST BODY
{
  "client_name": "Aarav Patel",
  "client_email": "aarav@example.com",
  "client_phone": "+91 98250 54321",
  "payment_method": "UPI (Google Pay)",
  "total_amount": 68000,
  "items": [
    { "id": 1, "name": "Seiko Prospex Speedtimer", "price": 68000, "qty": 1 }
  ]
}

// RESPONSE (201)
{
  "success": true,
  "message": "Order registered successfully with Mehsana Boutique.",
  "order_number": "KWS-ORD-A1B2C3",
  "order_id": 2,
  "total_amount": 68000.0,
  "transaction_id": "TXN-D4E5F6G7"
}
```

---

### 4.4 Services (`/api/services`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/services` | Book appointment |
| `GET` | `/api/services` | List bookings |
| `GET` | `/api/services/<reference>` | Single booking |

#### POST `/api/services`
```json
// REQUEST BODY
{
  "client_name": "Aarav Patel",
  "client_phone": "+91 98250 54321",
  "client_email": "aarav@example.com",
  "service_name": "Mechanical Calibration",
  "service_price": 1500,
  "watch_brand": "Seiko",
  "watch_model": "Prospex Speedtimer",
  "appointment_date": "2026-09-11",
  "appointment_slot": "11:00 AM - 01:00 PM"
}

// RESPONSE (201)
{
  "success": true,
  "booking_reference": "KWS-SRV-A1B2C3",
  "booking_id": 2,
  "appointment_date": "2026-09-11",
  "appointment_slot": "11:00 AM - 01:00 PM"
}
```

---

### 4.5 Sell / Valuation (`/api/sell`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/sell` | Submit inquiry |
| `GET` | `/api/sell` | List inquiries |
| `GET` | `/api/sell/<reference>` | Single inquiry |

#### POST `/api/sell`
```json
// REQUEST BODY
{
  "client_name": "Aarav Patel",
  "client_phone": "+91 98250 54321",
  "watch_brand": "Tissot",
  "model_name": "PRX Powermatic 80",
  "condition_state": "Excellent",
  "purchase_year": 2023,
  "has_box": true,
  "has_papers": true,
  "expected_price": 48000
}

// RESPONSE (201)
{
  "success": true,
  "reference_no": "KWS-VAL-A1B2C3",
  "inquiry_id": 2
}
```

---

### 4.6 Stats (`/api/stats`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/stats` | Dashboard metrics |

```json
// RESPONSE (200)
{
  "success": true,
  "metrics": {
    "total_orders": 5,
    "total_revenue": 340000.0,
    "total_products": 31,
    "total_services": 3,
    "total_valuations": 1,
    "total_users": 4
  },
  "recent_orders": [ ... ],
  "recent_bookings": [ ... ]
}
```

---

### 4.7 Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/health` | Server status |

```json
{ "status": "ok", "server": "Kartik Watch Shop — Python Flask Backend", "version": "2.0.0" }
```

---

## 5. Data Flow — How Frontend Connects to Backend

### Flow 1: Browsing Products (collections.html)
```
User opens collections.html
    → watches-data.js has 31 watches in client-side JavaScript
    → Products render from local JS data (no API call needed for browsing)
    → Clicking a product → product.html?id=N
    → Product detail rendered from watches-data.js
```
> **Note:** The frontend catalog is currently client-side. The /api/products endpoint exists for the admin panel and future migration to server-rendered catalog.

### Flow 2: Placing an Order (cart.html → payment.html)
```
User adds watches to cart (localStorage: kartik_cart)
    → cart.html shows cart items from localStorage
    → User clicks "Proceed to Payment"
    → payment.html loads cart from localStorage
    → User selects payment method + enters name/phone
    → User clicks "Confirm Payment"
    → JavaScript calls: POST /api/orders
        Body: { client_name, client_email, client_phone, payment_method, total_amount, items[] }
    → Flask server inserts into `orders` table + `order_items` table (transactional)
    → Returns: { success: true, order_number: "KWS-ORD-XXXXXX" }
    → Frontend shows receipt with order number
```

### Flow 3: Booking a Service (services.html → payment.html)
```
User selects a service on services.html
    → Books appointment details (date, slot, watch info)
    → Booking stored in localStorage: kartik_service_booking
    → Redirected to payment.html?type=service
    → User confirms payment
    → JavaScript calls: POST /api/services
        Body: { client_name, client_phone, service_name, watch_brand, appointment_date, ... }
    → Flask server inserts into `service_bookings` table
    → Returns: { success: true, booking_reference: "KWS-SRV-XXXXXX" }
```

### Flow 4: Selling a Watch (sell.html)
```
User fills out sell form on sell.html
    → Enters watch details (brand, model, condition, accessories)
    → Clicks "Submit Valuation"
    → JavaScript calls: POST /api/sell
        Body: { client_name, client_phone, watch_brand, model_name, condition_state, ... }
    → Flask server inserts into `sell_inquiries` table
    → Returns: { success: true, reference_no: "KWS-VAL-XXXXXX" }
    → Form hides, success message shown with reference number
```

### Flow 5: User Authentication (auth.html)
```
User registers on auth.html
    → Fills name, email, phone, password
    → OTP verification (simulated)
    → On OTP success:
        1. User saved to localStorage (kartik_users)
        2. Session created in localStorage (kartik_session)
        3. Sync call: POST /api/auth/register → saved to MySQL `users` table
    → Redirected to homepage

User logs in on auth.html
    → Enters email/phone + password
    → Validated against localStorage first (offline-first)
    → Sync call: POST /api/auth/login → creates Flask session
    → Redirected to homepage
```

---

## 6. Authentication Flow

```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (auth.js)           │ BACKEND (routes/auth.py) │
├──────────────────────────────┼───────────────────────────┤
│ 1. User fills signup form    │                           │
│ 2. OTP verification (local)  │                           │
│ 3. Save to localStorage      │                           │
│ 4. POST /api/auth/register  ──►  Hash password            │
│                              │    INSERT INTO users       │
│                              │    Create Flask session     │
│                              ◄──  { success, user }       │
│ 5. Redirect to homepage      │                           │
└──────────────────────────────┴───────────────────────────┘
```

**Important:** The frontend uses a **dual-storage** pattern:
- **localStorage** — Primary auth source (works offline / file:// protocol)
- **MySQL** — Synced via API calls (persistent, works for admin panel)

---

## 7. How Each Form Saves Data to the Database

### 7.1 Registration Form → `users` table
| Form Field | → | Database Column |
|-----------|---|-----------------|
| Full Name | → | `users.name` |
| Email Address | → | `users.email` |
| Phone Number | → | `users.phone` |
| Password | → | `users.password_hash` (hashed with pbkdf2) |
| — | → | `users.role` = 'client' (auto) |

### 7.2 Payment/Checkout Form → `orders` + `order_items` tables
| Form Field | → | Database Column |
|-----------|---|-----------------|
| Customer Name | → | `orders.client_name` |
| Customer Email | → | `orders.client_email` |
| Customer Phone | → | `orders.client_phone` |
| Payment Method button | → | `orders.payment_method` |
| Cart total | → | `orders.total_amount` |
| — | → | `orders.order_number` (UUID-generated) |
| — | → | `orders.order_status` = 'placed' (auto) |
| Each cart item.id | → | `order_items.product_id` |
| Each cart item.name | → | `order_items.product_name` |
| Each cart item.price | → | `order_items.price` |
| Each cart item.qty | → | `order_items.quantity` |
| price × qty | → | `order_items.subtotal` |

### 7.3 Service Booking Form → `service_bookings` table
| Form Field | → | Database Column |
|-----------|---|-----------------|
| Customer Name | → | `service_bookings.client_name` |
| Customer Phone | → | `service_bookings.client_phone` |
| Customer Email | → | `service_bookings.client_email` |
| Selected Service | → | `service_bookings.service_id` + `service_name` |
| Service Price | → | `service_bookings.service_price` |
| Watch Brand | → | `service_bookings.watch_brand` |
| Watch Model | → | `service_bookings.watch_model` |
| Appointment Date | → | `service_bookings.appointment_date` |
| Time Slot | → | `service_bookings.appointment_slot` |
| Delivery Mode | → | `service_bookings.delivery_mode` |
| — | → | `service_bookings.booking_reference` (UUID-generated) |
| — | → | `service_bookings.booking_status` = 'confirmed' (auto) |

### 7.4 Sell Your Watch Form → `sell_inquiries` table
| Form Field | → | Database Column |
|-----------|---|-----------------|
| Seller Name | → | `sell_inquiries.client_name` |
| Seller Phone | → | `sell_inquiries.client_phone` |
| Seller Email | → | `sell_inquiries.client_email` |
| Watch Brand dropdown | → | `sell_inquiries.watch_brand` |
| Watch Model | → | `sell_inquiries.model_name` |
| Condition dropdown | → | `sell_inquiries.condition_state` |
| Year of Purchase | → | `sell_inquiries.purchase_year` |
| Checkbox: Original Box | → | `sell_inquiries.has_box` |
| Checkbox: Papers | → | `sell_inquiries.has_papers` |
| Checkbox: Receipt | → | `sell_inquiries.has_receipt` |
| Checkbox: Extra Strap | → | `sell_inquiries.has_extra_strap` |
| Expected Price | → | `sell_inquiries.expected_price` |
| Description | → | `sell_inquiries.notes` |
| — | → | `sell_inquiries.reference_no` (UUID-generated) |
| — | → | `sell_inquiries.status` = 'submitted' (auto) |

---

## 8. Error Handling

All API endpoints return errors in a consistent JSON format:

```json
{
  "success": false,
  "error": "Human-readable error message"
}
```

### HTTP Status Codes Used
| Code | Meaning | When |
|------|---------|------|
| 200 | OK | Successful GET, login, logout |
| 201 | Created | Successful POST (new record) |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Wrong password |
| 404 | Not Found | Record doesn't exist |
| 409 | Conflict | Email already registered |
| 405 | Method Not Allowed | Wrong HTTP method |
| 500 | Server Error | Database failure |

### Frontend Error Handling
The frontend uses a graceful fallback pattern:
```javascript
fetch('/api/orders', { ... })
  .then(res => res.json())
  .catch(err => {
    console.log('Database sync notice (offline / file protocol fallback):', err);
    return null;  // Falls back to client-side reference number
  });
```
This ensures the shop works even if:
- MySQL is not running
- The server is down
- The user is offline

---

## 9. Bugs Fixed from PHP Backend

| # | Bug | Fix Applied |
|---|-----|-------------|
| 1 | `products.php` used `desc AS \`desc\`` but column is `description` — SQL error | Python uses correct column name `description`, maps to `desc` in JSON response |
| 2 | Related products query referenced wrong alias | Fixed to use `description` column directly |
| 3 | `mt_rand()` for order numbers → duplicate collisions under load | Replaced with `uuid.uuid4()` — cryptographically unique |
| 4 | `mt_rand()` for sell references → same collision risk | Replaced with UUID |
| 5 | `mt_rand()` for booking references → same collision risk | Replaced with UUID |
| 6 | PHP session-based auth fails cross-origin | Flask session with `SameSite=Lax` + CORS headers |
| 7 | `jsonResponse()` called before defined during DB error | Python module loading order avoids this |
| 8 | `LIMIT` injected via string concatenation (SQL injection risk) | Parameterized: `LIMIT %s` with value binding |
| 9 | Frontend stores passwords in plaintext (localStorage) | Backend now hashes with pbkdf2:sha256 |
| 10 | `start-server.bat` required XAMPP PHP | New `start-server-python.bat` uses Python only |

---

## 10. How to Add / Modify Data

### Add a New Watch to the Catalog
1. Open `backend/database/seed.sql`
2. Add a new row to the products INSERT:
```sql
(32, 'New Watch Name', 'brand', 'brand-mens', 'male', 55000.00, 65000.00, 4.8, 10, 
'40mm • Automatic', 'Description text', 'assets/watches/new_watch.jpg', 'BRAND • TAG', 5, 0),
```
3. Also add the watch to `frontend/js/watches-data.js`:
```javascript
{
  id: 32,
  name: "New Watch Name",
  brand: "brand",
  category: "brand-mens",
  gender: "male",
  price: 55000,
  rating: 4.8,
  specs: "40mm • Automatic",
  desc: "Description text",
  image: "assets/watches/new_watch.jpg",
  badge: "BRAND • TAG"
}
```
4. Run `python backend-python/setup_db.py` to update the database

### Change a Watch Price
- Update `seed.sql` → run `setup_db.py`
- Update `watches-data.js` (for frontend display)

### Add a New API Endpoint
1. Create a new file in `backend-python/routes/your_feature.py`
2. Define a Blueprint: `bp = Blueprint('feature', __name__, url_prefix='/api/feature')`
3. Register it in `app.py`: `app.register_blueprint(bp)`

---

## 11. File Structure Map

```
kartik-watch-shop/
│
├── backend-python/                    ← NEW PYTHON BACKEND
│   ├── app.py                        ← Main Flask entry (start here)
│   ├── config.py                     ← Database & server config
│   ├── db.py                         ← MySQL connection helpers
│   ├── setup_db.py                   ← Database setup script
│   ├── requirements.txt              ← Python dependencies
│   └── routes/                       ← API route blueprints
│       ├── __init__.py
│       ├── auth.py                   ← /api/auth/* endpoints
│       ├── products.py               ← /api/products/* endpoints
│       ├── orders.py                 ← /api/orders/* endpoints
│       ├── services.py               ← /api/services/* endpoints
│       ├── sell.py                   ← /api/sell/* endpoints
│       └── stats.py                  ← /api/stats endpoint
│
├── backend/                           ← OLD PHP BACKEND (preserved)
│   ├── config/db.php
│   ├── database/
│   │   ├── schema.sql                ← Shared table definitions
│   │   └── seed.sql                  ← Shared seed data (31 watches)
│   ├── api/ (auth.php, products.php, orders.php, services.php, sell.php, stats.php)
│   └── admin/index.php
│
├── frontend/                          ← FRONTEND UI
│   ├── index.html, collections.html, product.html, cart.html
│   ├── payment.html, services.html, sell.html, auth.html
│   ├── css/ (style.css + modules/)
│   ├── js/ (watches-data.js, auth.js, cart.js, etc.)
│   └── assets/ (watch images)
│
├── start-server-python.bat            ← NEW: 1-click Python launcher
├── start-server.bat                   ← OLD: PHP/XAMPP launcher
├── BACKEND_DOCUMENTATION.md           ← THIS FILE
└── index.php                          ← OLD: PHP router (still works)
```

---

**Document prepared for Kartik Watch Shop, Mehsana, Gujarat.**  
*For any questions about the backend, refer to the API endpoints in Section 4 or the data flow diagrams in Section 5.*
