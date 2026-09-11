"""
Kartik Watch Shop — Backend Configuration
Loads ALL credentials and API keys from .env file.
Defaults match XAMPP's default MySQL configuration for local development.

Environment variables are loaded from:
    1. Project root .env file  (kartik-watch-shop/.env)
    2. Backend .env file       (backend/.env)
    3. System environment variables
"""

import os
from dotenv import load_dotenv

# Load .env file if present (from project root or backend/)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))


class Config:
    """Application configuration with sensible XAMPP defaults."""

    # ══════════════════════════════════════════════════════════
    # 1. DATABASE SETTINGS (MySQL / XAMPP)
    # ══════════════════════════════════════════════════════════
    DB_HOST = os.getenv('DB_HOST', '127.0.0.1')
    DB_PORT = int(os.getenv('DB_PORT', 3306))
    DB_USER = os.getenv('DB_USER', 'root')
    DB_PASS = os.getenv('DB_PASS', '')
    DB_NAME = os.getenv('DB_NAME', 'kartik_watch_shop')

    # ══════════════════════════════════════════════════════════
    # 2. FLASK SERVER SETTINGS
    # ══════════════════════════════════════════════════════════
    SECRET_KEY = os.getenv('SECRET_KEY', 'kartik-watch-shop-secret-key-2026')
    DEBUG = os.getenv('FLASK_DEBUG', 'true').lower() == 'true'
    HOST = os.getenv('FLASK_HOST', '0.0.0.0')
    PORT = int(os.getenv('FLASK_PORT', 5000))

    # ══════════════════════════════════════════════════════════
    # 3. GOOGLE OAUTH 2.0 (Google Sign-In)
    # ══════════════════════════════════════════════════════════
    GOOGLE_CLIENT_ID = os.getenv('GOOGLE_CLIENT_ID', '')
    GOOGLE_CLIENT_SECRET = os.getenv('GOOGLE_CLIENT_SECRET', '')
    GOOGLE_REDIRECT_URI = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:5000/api/auth/google/callback')

    # ══════════════════════════════════════════════════════════
    # 4. PAYMENT GATEWAY (Razorpay)
    # ══════════════════════════════════════════════════════════
    RAZORPAY_KEY_ID = os.getenv('RAZORPAY_KEY_ID', '')
    RAZORPAY_KEY_SECRET = os.getenv('RAZORPAY_KEY_SECRET', '')
    RAZORPAY_WEBHOOK_SECRET = os.getenv('RAZORPAY_WEBHOOK_SECRET', '')

    # ══════════════════════════════════════════════════════════
    # 5. EMAIL (SMTP / SendGrid)
    # ══════════════════════════════════════════════════════════
    SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USER = os.getenv('SMTP_USER', '')
    SMTP_PASS = os.getenv('SMTP_PASS', '')
    SMTP_FROM_NAME = os.getenv('SMTP_FROM_NAME', 'Kartik Watch Shop')
    SMTP_FROM_EMAIL = os.getenv('SMTP_FROM_EMAIL', '')
    SENDGRID_API_KEY = os.getenv('SENDGRID_API_KEY', '')

    # ══════════════════════════════════════════════════════════
    # 6. SMS (Twilio — for real OTP)
    # ══════════════════════════════════════════════════════════
    TWILIO_ACCOUNT_SID = os.getenv('TWILIO_ACCOUNT_SID', '')
    TWILIO_AUTH_TOKEN = os.getenv('TWILIO_AUTH_TOKEN', '')
    TWILIO_PHONE_NUMBER = os.getenv('TWILIO_PHONE_NUMBER', '')

    # ══════════════════════════════════════════════════════════
    # 7. GOOGLE MAPS EMBED
    # ══════════════════════════════════════════════════════════
    GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', '')

    # ══════════════════════════════════════════════════════════
    # 8. CLOUDINARY (Image Uploads — future)
    # ══════════════════════════════════════════════════════════
    CLOUDINARY_CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME', '')
    CLOUDINARY_API_KEY = os.getenv('CLOUDINARY_API_KEY', '')
    CLOUDINARY_API_SECRET = os.getenv('CLOUDINARY_API_SECRET', '')

    # ── Frontend Path (for static file serving) ──
    FRONTEND_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend'))
