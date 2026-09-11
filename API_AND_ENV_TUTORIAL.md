# Kartik Watch Shop — API Keys & Environment Variables Tutorial
### Complete Step-by-Step Setup Guide • Where to Put Every Key, Password & Credential
**Version 2.0** | For: Local Development & Production

---

## Table of Contents
1. [Overview & Quick Start (3 Steps)](#1-overview--quick-start-3-steps)
2. [Master Key Map (Which File & Line Uses Each Key)](#2-master-key-map-which-file--line-uses-each-key)
3. [Diagnostic Tool: How to Verify Your Keys Live](#3-diagnostic-tool-how-to-verify-your-keys-live)
4. [Step-by-Step API Setup Guides](#4-step-by-step-api-setup-guides)
   - [4.1 MySQL Database Password (`DB_PASS`)](#41-mysql-database-password-db_pass)
   - [4.2 Flask Secret Key (`SECRET_KEY`)](#42-flask-secret-key-secret_key)
   - [4.3 Google OAuth 2.0 Sign-In (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)](#43-google-oauth-20-sign-in-google_client_id--google_client_secret)
   - [4.4 Razorpay Payment Gateway (`RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`)](#44-razorpay-payment-gateway-razorpay_key_id--razorpay_key_secret)
   - [4.5 Email Notifications (`SMTP_USER` & `SMTP_PASS` / Gmail App Password)](#45-email-notifications-smtp_user--smtp_pass--gmail-app-password)
   - [4.6 SMS & WhatsApp OTP (`TWILIO_ACCOUNT_SID`, `AUTH_TOKEN`, `PHONE`)](#46-sms--whatsapp-otp-twilio_account_sid-auth_token-phone)
   - [4.7 Google Maps Embed API (`GOOGLE_MAPS_API_KEY`)](#47-google-maps-embed-api-google_maps_api_key)
   - [4.8 Cloudinary Image Storage (`CLOUDINARY_*`)](#48-cloudinary-image-storage-cloudinary_)
5. [Code Architecture: How Backend & Frontend Read the Keys](#5-code-architecture-how-backend--frontend-read-the-keys)
6. [Security Rules & GitHub Protection](#6-security-rules--github-protection)
7. [Troubleshooting & FAQs](#7-troubleshooting--faqs)

---

## 1. Overview & Quick Start (3 Steps)

All secrets, API keys, and database passwords in **Kartik Watch Shop** are stored in a single secure file named `.env` located at the project root:

```
c:\Users\Windows\Desktop\kartik-watch-shop\.env
```

> [!IMPORTANT]
> **The server works immediately with ZERO keys!**
> Every single key in `.env` has a safe fallback default. The app runs out-of-the-box on XAMPP MySQL with simulated mock checkouts and OTPs. You only need to add keys when you want real Google logins, real UPI payments via Razorpay, real emails, or real SMS.

### Quick Start in 3 Steps:

1. **Open the `.env` file:**
   Open [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env) in VS Code or your preferred text editor.
   *(If it does not exist, run `start-server-python.bat` or copy [.env.example](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env.example) to `.env`)*

2. **Fill in the keys you want to activate:**
   Replace the blank values with your actual keys (e.g., paste your Google Client ID, Razorpay Key, etc.).

3. **Restart the server or check status:**
   Open your browser at:
   👉 **`http://localhost:5000/api/config-status`**
   You will see an instant live dashboard showing which keys are detected!

---

## 2. Master Key Map (Which File & Line Uses Each Key)

Here is the exact mapping showing where every `.env` key is defined, where the backend loads it, and which frontend page consumes it:

| # | Environment Variable in `.env` | Default Value | Where Backend Loads It | Where Frontend / UI Uses It | Purpose |
|---|--------------------------------|---------------|------------------------|-----------------------------|---------|
| 1 | `DB_HOST` | `127.0.0.1` | [`config.py:26`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L26), [`db.py:21`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L21) | Backend database connection | MySQL Host address |
| 2 | `DB_PORT` | `3306` | [`config.py:27`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L27), [`db.py:22`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L22) | Backend database connection | MySQL Port (XAMPP default: 3306) |
| 3 | `DB_USER` | `root` | [`config.py:28`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L28), [`db.py:23`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L23) | Backend database connection | MySQL Username (XAMPP default: root) |
| 4 | `DB_PASS` | *(empty)* | [`config.py:29`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L29), [`db.py:24`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L24) | Backend database connection | MySQL Password (blank for local XAMPP) |
| 5 | `DB_NAME` | `kartik_watch_shop` | [`config.py:30`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L30), [`db.py:25`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L25) | All tables: `products`, `orders`, `users`, etc. | MySQL database name |
| 6 | `SECRET_KEY` | *(auto-default)* | [`config.py:35`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L35), [`app.py:49`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L49) | User session cookies | Flask secret key for signing cookies |
| 7 | `GOOGLE_CLIENT_ID` | *(empty)* | [`config.py:43`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L43), [`app.py:171`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L171) | [`auth.html:62`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/auth.html#L62), [`auth.js:154`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/js/auth.js#L154) | "Sign in with Google" button |
| 8 | `GOOGLE_CLIENT_SECRET` | *(empty)* | [`config.py:44`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L44), [`routes/auth.py:163`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/auth.py#L163) | Secure server-side token exchange | Validates Google identity token |
| 9 | `RAZORPAY_KEY_ID` | *(empty)* | [`config.py:50`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L50), [`app.py:172`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L172) | [`payment.html:105`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/payment.html#L105) (UPI/Card checkout) | Public key to launch Razorpay modal |
| 10 | `RAZORPAY_KEY_SECRET` | *(empty)* | [`config.py:51`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L51), [`routes/orders.py:85`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/orders.py#L85) | Backend webhook & signature validation | Signs payment verification SHA256 |
| 11 | `SMTP_USER` & `SMTP_PASS` | *(empty)* | [`config.py:59-60`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L59-L60) | Order confirmation & booking receipts | Sends actual emails to clients via Gmail SMTP |
| 12 | `TWILIO_ACCOUNT_SID` & `TWILIO_AUTH_TOKEN` | *(empty)* | [`config.py:68-70`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L68-L70) | [`auth.html:130`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/auth.html#L130) (OTP verification popup) | Sends real SMS OTPs to mobile numbers |
| 13 | `GOOGLE_MAPS_API_KEY` | *(empty)* | [`config.py:75`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L75), [`app.py:173`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L173) | [`services.html:191`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/services.html#L191) (Radhanpur Road Map) | Embeds official Google Maps pin |
| 14 | `CLOUDINARY_*` | *(empty)* | [`config.py:80-82`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L80-L82) | [`sell.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/sell.html) (Watch appraisal photos) | Cloud photo storage for timepieces |

---

## 3. Diagnostic Tool: How to Verify Your Keys Live

We built two diagnostic endpoints directly into the Flask backend so you can verify your configuration without guessing or exposing passwords:

### 1. Check Full Configuration Status (Private Diagnostics)
Open in your browser:
👉 **`http://localhost:5000/api/config-status`**

**Sample Response:**
```json
{
  "api_keys_status": {
    "cloudinary": { "configured": false },
    "email_smtp": { "configured": false, "host": "smtp.gmail.com", "user_set": false },
    "google_maps": { "configured": false },
    "google_oauth": { "client_id_set": true, "client_secret_set": true, "configured": true },
    "razorpay": { "configured": true, "key_id_set": true, "key_secret_set": true },
    "sms_twilio": { "configured": false, "phone_set": false, "sid_set": false }
  },
  "environment": {
    "database": {
      "database": "kartik_watch_shop",
      "host": "127.0.0.1",
      "password_set": false,
      "port": 3306,
      "user": "root"
    },
    "flask_debug": true,
    "flask_port": 5000
  },
  "success": true
}
```
*(Notice: Real secrets and passwords are **never revealed** in the JSON output! Only safe `true/false` boolean flags.)*

### 2. Check Public Frontend Configuration
Open in your browser:
👉 **`http://localhost:5000/api/config/public`**

```json
{
  "google_client_id": "your-client-id.apps.googleusercontent.com",
  "razorpay_key_id": "rzp_test_xxxx",
  "google_maps_api_key": "AIzaSy...",
  "success": true
}
```
*(This endpoint allows `auth.html` and `payment.html` to dynamically fetch public client keys automatically.)*

---

## 4. Step-by-Step API Setup Guides

---

### 4.1 MySQL Database Password (`DB_PASS`)

#### What it does:
Connects Flask to your MySQL / MariaDB server.

#### Where in `.env`:
```env
# ── 1. DATABASE CREDENTIALS (MySQL / XAMPP) ──
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=
DB_NAME=kartik_watch_shop
```

#### How to configure:
- **Default XAMPP (Localhost):** Leave `DB_PASS=` completely blank (empty after the equals sign). Default XAMPP MySQL has user `root` with NO password.
- **If you set a MySQL root password in phpMyAdmin:**
  ```env
  DB_PASS=YourSecretPassword123
  ```
- **If using Remote MySQL (e.g. AWS RDS, Railway, Clever Cloud):**
  ```env
  DB_HOST=containers-us-west-123.railway.app
  DB_PORT=6543
  DB_USER=root
  DB_PASS=YourRemotePassword
  DB_NAME=railway
  ```

#### Files that use this:
- [`backend-python/config.py:26-31`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L26-L31)
- [`backend-python/db.py:18-35`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/db.py#L18-L35)

---

### 4.2 Flask Secret Key (`SECRET_KEY`)

#### What it does:
Used by Flask to cryptographically sign session cookies (`kartik_user`), preventing tampering with client identities and admin privileges.

#### Where in `.env`:
```env
# ── 2. FLASK SERVER SETTINGS ──
SECRET_KEY=kartik-watch-shop-secret-key-change-me-in-production
FLASK_DEBUG=true
FLASK_HOST=0.0.0.0
FLASK_PORT=5000
```

#### How to generate a strong 256-bit key:
Run this one-liner in your terminal / PowerShell:
```powershell
python -c "import secrets; print(secrets.token_hex(32))"
```
Copy the resulting 64-character string and paste it into `SECRET_KEY=` in `.env`:
```env
SECRET_KEY=9f8e4c3b2a1d0e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f
```

#### Files that use this:
- [`backend-python/config.py:35`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L35)
- [`backend-python/app.py:49`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L49)

---

### 4.3 Google OAuth 2.0 Sign-In (`GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`)

#### What it does:
Allows users to click **"Continue with Google"** on [`auth.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/auth.html) to instantly sign in or register with their verified Google account.

#### Where in `.env`:
```env
# ── 3. GOOGLE OAUTH 2.0 (for Google Sign-In) ──
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-google-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5000/api/auth/google/callback
```

#### How to get the credentials from Google Cloud Console:
1. Go to the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a new project named **"Kartik Watch Shop"**.
3. In the left menu, click **APIs & Services** → **OAuth consent screen**:
   - User Type: **External** → Click **Create**.
   - App Name: `Kartik Watch Shop`
   - User support email: Select your Gmail.
   - Developer contact email: Enter your Gmail.
   - Click **Save and Continue** through the steps.
4. Click **APIs & Services** → **Credentials** in the left menu.
5. Click **+ CREATE CREDENTIALS** at the top → Choose **OAuth client ID**.
6. Application type: **Web application**.
7. Name: `Kartik Watch Shop Web Client`.
8. Under **Authorized JavaScript origins**, click **+ ADD URI**:
   - `http://localhost:5000`
   - `http://127.0.0.1:5000`
9. Under **Authorized redirect URIs**, click **+ ADD URI**:
   - `http://localhost:5000/api/auth/google/callback`
   - `http://localhost:5000/frontend/auth.html`
10. Click **CREATE**.
11. A modal appears showing:
    - **Your Client ID** (e.g. `1234567890-abc.apps.googleusercontent.com`)
    - **Your Client Secret** (e.g. `GOCSPX-xyz123...`)
12. Copy both and paste into [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env)!

#### Files that use this:
- [`backend-python/config.py:43-46`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L43-L46)
- [`backend-python/routes/auth.py:163-229`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/auth.py#L163-L229) (`/api/auth/google` endpoint)
- [`frontend/auth.html:61-64`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/auth.html#L61-L64) (Google sign-in button)
- [`frontend/js/auth.js:154-176`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/js/auth.js#L154-L176) (Google redirect handler)

---

### 4.4 Razorpay Payment Gateway (`RAZORPAY_KEY_ID` & `RAZORPAY_KEY_SECRET`)

#### What it does:
Powers real UPI payments (Google Pay, PhonePe, Paytm, BHIM), Indian Debit/Credit cards (Visa, MasterCard, RuPay), and Net Banking on [`payment.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/payment.html).

#### Where in `.env`:
```env
# ── 4. PAYMENT GATEWAY (Razorpay) ──
RAZORPAY_KEY_ID=rzp_test_YourTestKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpaySecretKeyHere
RAZORPAY_WEBHOOK_SECRET=YourWebhookSecretHere
```

#### How to get test credentials from Razorpay:
1. Sign up for a free merchant account at [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. On top of the dashboard, ensure the toggle is in **Test Mode** (orange badge).
3. In the left sidebar, navigate to **Account & Settings** → **API Keys** (under *Website and app settings*).
4. Click **Generate Test Key**.
5. You will see:
   - **Key Id** (starts with `rzp_test_...`)
   - **Key Secret** (a long secret string)
6. Copy both and paste into [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env)!

> [!TIP]
> **Test Payments in Razorpay:**
> When using `rzp_test_...`, you do not spend any real money! Razorpay provides test UPI IDs (e.g. `success@razorpay`) and test credit card numbers (`4000 0000 0000 1111`) to test orders safely.
> When you're ready to go live, complete KYC and switch the toggle to **Live Mode** to get `rzp_live_...`.

#### Files that use this:
- [`backend-python/config.py:50-52`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L50-L52)
- [`backend-python/routes/orders.py:31-99`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/orders.py#L31-L99) (Processes order amounts and verifies transaction IDs)
- [`frontend/payment.html:85-173`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/payment.html#L85-L173) (UPI QR code and card payment tabs)

---

### 4.5 Email Notifications (`SMTP_USER` & `SMTP_PASS` / Gmail App Password)

#### What it does:
Sends automatic email receipts and order confirmations to customers after placing an order or booking an atelier repair service in Mehsana.

#### Where in `.env`:
```env
# ── 5. EMAIL / SMS NOTIFICATIONS ──
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
SMTP_FROM_NAME=Kartik Watch Shop
SMTP_FROM_EMAIL=your-email@gmail.com
```

#### How to generate a Gmail App Password:
> [!CAUTION]
> **Never use your normal Google account password in `SMTP_PASS`!** Google will block the connection. You MUST generate a 16-character **App Password**.

1. Log in to your [Google Account](https://myaccount.google.com/).
2. In the left menu, select **Security**.
3. Under *How you sign in to Google*, make sure **2-Step Verification** is turned **ON**.
4. Now visit: [https://myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
5. Under **App name**, type `Kartik Watch Shop` and click **Create**.
6. Google displays a **16-character password** (e.g. `wxyz abcd efgh ijkl`).
7. Paste this 16-character code directly into `SMTP_PASS=` in [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env) (with or without spaces).
8. Put your Gmail in `SMTP_USER=` and `SMTP_FROM_EMAIL=`.

#### Files that use this:
- [`backend-python/config.py:57-63`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L57-L63)
- Triggered on new orders in [`backend-python/routes/orders.py`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/orders.py) and new service reservations in [`backend-python/routes/services.py`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/services.py).

---

### 4.6 SMS & WhatsApp OTP (`TWILIO_ACCOUNT_SID`, `AUTH_TOKEN`, `PHONE`)

#### What it does:
Sends real 6-digit OTP verification codes via SMS to customers' mobile phones during signup on [`auth.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/auth.html).

#### Where in `.env`:
```env
# SMS via Twilio (for real OTP)
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890
```

#### How to get Twilio credentials:
1. Sign up for a free trial at [Twilio Console](https://console.twilio.com/).
2. Twilio gives you **$15 free trial credit**.
3. On the Console dashboard, locate:
   - **Account SID** (starts with `AC...`)
   - **Auth Token** (click Show)
4. Click **Get phone number** to obtain your trial Twilio phone number (e.g. `+1 555 123 4567`).
5. Paste these three items into [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env)!

> [!NOTE]
> **Offline / Demo Mode Fallback:**
> If you leave Twilio keys blank, [`frontend/js/auth.js`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/js/auth.js) automatically displays the generated demo OTP right on screen in a gold toast notification (e.g. `Verification code sent! Demo Code: 794218` or `123456`), so your demo always works 100% without spending money on SMS!

#### Files that use this:
- [`backend-python/config.py:68-70`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L68-L70)
- [`frontend/js/auth.js:342-420`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/js/auth.js#L342-L420)

---

### 4.7 Google Maps Embed API (`GOOGLE_MAPS_API_KEY`)

#### What it does:
Renders the interactive Google Map pin for the Mehsana boutique on [`services.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/services.html) at Radhanpur Road.

#### Where in `.env`:
```env
# ── 6. GOOGLE MAPS EMBED ──
GOOGLE_MAPS_API_KEY=AIzaSyYourGoogleMapsApiKeyHere
```

#### How to get the API Key:
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Go to **APIs & Services** → **Library**.
3. Search for **Maps Embed API** and click **Enable**.
4. Go to **APIs & Services** → **Credentials** → **+ CREATE CREDENTIALS** → **API key**.
5. Copy the generated key (starts with `AIzaSy...`) and paste it into [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env).

#### Files that use this:
- [`backend-python/config.py:75`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L75)
- [`backend-python/app.py:173`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/app.py#L173) (`/api/config/public`)
- [`frontend/services.html:190-195`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/services.html#L190-L195) (Map card iframe)

---

### 4.8 Cloudinary Image Storage (`CLOUDINARY_*`)

#### What it does:
Used for uploading high-resolution timepiece photos when customers submit trade-in requests on [`sell.html`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/frontend/sell.html).

#### Where in `.env`:
```env
# ── 7. CLOUDINARY / IMAGE UPLOAD ──
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your-api-secret-key
```

#### How to get credentials:
1. Sign up for free at [Cloudinary](https://cloudinary.com/users/register_free).
2. On your Cloudinary Dashboard under **Product Environment**, you will see:
   - **Cloud Name**
   - **API Key**
   - **API Secret** (click copy)
3. Paste all three into [.env](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env).

#### Files that use this:
- [`backend-python/config.py:80-82`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/config.py#L80-L82)
- [`backend-python/routes/sell.py`](file:///c:/Users/Windows/Desktop/kartik-watch-shop/backend-python/routes/sell.py)

---

## 5. Code Architecture: How Backend & Frontend Read the Keys

Here is how environment variables flow through the system:

```
┌────────────────────────────────────────────────────────┐
│                        .env                            │
│  (DB_PASS, GOOGLE_CLIENT_ID, RAZORPAY_KEY_ID, ...)     │
└──────────────────────────┬─────────────────────────────┘
                           │ python-dotenv loads
                           ▼
┌────────────────────────────────────────────────────────┐
│               backend-python/config.py                 │
│  class Config:                                         │
│    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID')    │
│    RAZORPAY_KEY_ID  = os.getenv('RAZORPAY_KEY_ID')     │
│    DB_PASS          = os.getenv('DB_PASS')             │
└─────────────┬────────────────────────────┬─────────────┘
              │ Private Secrets            │ Public Keys
              │ (Never exposed to browser) │ (Client-safe)
              ▼                            ▼
   ┌───────────────────────┐   ┌───────────────────────────┐
   │    Backend Routes     │   │   GET /api/config/public  │
   │  - db.py (MySQL)      │   │   Returns:                │
   │  - routes/auth.py     │   │     google_client_id      │
   │  - routes/orders.py   │   │     razorpay_key_id       │
   │  - routes/services.py │   │     google_maps_api_key   │
   └───────────────────────┘   └─────────────┬─────────────┘
                                             │ fetch()
                                             ▼
                               ┌───────────────────────────┐
                               │   Frontend Browser Pages  │
                               │  - auth.html  (Google)    │
                               │  - payment.html (Razorpay)│
                               │  - services.html (Maps)   │
                               └───────────────────────────┘
```

### Key Security Concept: Public vs Private
- **PRIVATE SECRETS:** `DB_PASS`, `SECRET_KEY`, `GOOGLE_CLIENT_SECRET`, `RAZORPAY_KEY_SECRET`, `SMTP_PASS`, `TWILIO_AUTH_TOKEN`.
  *These stay strictly inside the Python backend and are NEVER sent over HTTP to the browser.*
- **PUBLIC CLIENT KEYS:** `GOOGLE_CLIENT_ID`, `RAZORPAY_KEY_ID`, `GOOGLE_MAPS_API_KEY`.
  *These are safe to send to the browser via `/api/config/public` so client-side JavaScript can launch login dialogs or payment screens.*

---

## 6. Security Rules & GitHub Protection

### 1. `.env` is Ignored by Git
The project root contains [.gitignore](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.gitignore) which explicitly excludes `.env`:
```gitignore
# ── Environment & Secrets ──
.env
*.env.local
```
This guarantees that even if you push this repository to GitHub or GitLab, your private passwords and API keys **will never leak publicly**.

### 2. The `.env.example` Template
Whenever you add a new API key to `.env`, also add a placeholder name for it in [.env.example](file:///c:/Users/Windows/Desktop/kartik-watch-shop/.env.example) without the real value:
```env
# In .env (REAL SECRET - DO NOT SHARE):
RAZORPAY_KEY_SECRET=sk_live_983749817234981723

# In .env.example (SAFE TEMPLATE - SHAREABLE):
RAZORPAY_KEY_SECRET=your-razorpay-key-secret
```

---

## 7. Troubleshooting & FAQs

### Q1: I updated my `.env` file, but the changes aren't taking effect.
**Fix:** 
1. If the Flask server is running in a terminal, press `Ctrl+C` to stop it.
2. Double-click `start-server-python.bat` to restart it.
3. Open `http://localhost:5000/api/config-status` to verify that your new key has `configured: true`.

### Q2: What if I don't have any API keys right now?
**Answer:** The entire website functions in **Demonstration Mode**!
- You can register, login, and verify OTPs using the demo code (`123456`).
- You can click "Quick Demo" on `auth.html` to log in instantly.
- You can place orders on `payment.html` via UPI QR code or simulated card.
- Everything is saved directly to your local MySQL database.

### Q3: How do I change the port from 5000 to something else?
Edit line 29 in `.env`:
```env
FLASK_PORT=8080
```
Restart the server and it will run on `http://localhost:8080`!

---
*Kartik Watch Shop • Luxury Horology Boutique • Radhanpur Road, Mehsana, Gujarat*
