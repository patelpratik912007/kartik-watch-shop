"""
Kartik Watch Shop — Authentication API
Handles: register, login, Google sign-in, logout, session check.

Endpoints:
    POST /api/auth/register  — Create new user account
    POST /api/auth/login     — Login with email + password
    POST /api/auth/google    — Google OAuth sign-in handler
    POST /api/auth/logout    — Clear session
    GET  /api/auth/me        — Get current authenticated user
"""

from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import query_one, execute

auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


@auth_bp.route('/me', methods=['GET'])
def get_current_user():
    """
    GET /api/auth/me
    Returns the currently authenticated user from session, or null.

    Response (authenticated):
        { "authenticated": true, "user": { "id": 1, "name": "...", ... } }

    Response (not authenticated):
        { "authenticated": false, "user": null }
    """
    user = session.get('kartik_user')
    if user:
        return jsonify({'authenticated': True, 'user': user})
    return jsonify({'authenticated': False, 'user': None})


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    POST /api/auth/register
    Create a new client account.

    Request Body (JSON):
        {
            "name": "Full Name",           (required)
            "email": "user@example.com",   (required)
            "phone": "+91 98250 12345",    (optional)
            "password": "SecurePass@123"   (required)
        }

    Response 201:
        { "success": true, "message": "Registration successful!", "user": {...} }

    Error 400: Missing fields
    Error 409: Email already exists
    """
    data = request.get_json(silent=True) or {}

    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip()
    password = data.get('password') or ''

    # Validation
    if not name or not email or not password:
        return jsonify({
            'success': False,
            'error': 'Please provide name, email, and password.'
        }), 400

    # Check existing user
    existing = query_one("SELECT id FROM `users` WHERE `email` = %s LIMIT 1", (email,))
    if existing:
        return jsonify({
            'success': False,
            'error': 'An account with this email already exists.'
        }), 409

    # Hash password (bcrypt-compatible via Werkzeug)
    password_hash = generate_password_hash(password, method='pbkdf2:sha256')

    # Insert user
    user_id = execute(
        "INSERT INTO `users` (`name`, `email`, `phone`, `password_hash`, `role`) "
        "VALUES (%s, %s, %s, %s, 'client')",
        (name, email, phone or None, password_hash)
    )

    user = {
        'id': user_id,
        'name': name,
        'email': email,
        'phone': phone,
        'role': 'client'
    }
    session['kartik_user'] = user

    return jsonify({
        'success': True,
        'message': 'Registration successful! Welcome to Kartik Watch Shop.',
        'user': user
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    POST /api/auth/login
    Authenticate with email and password.

    Request Body (JSON):
        {
            "email": "user@example.com",   (required)
            "password": "SecurePass@123"   (required)
        }

    Response 200:
        { "success": true, "message": "Login successful.", "user": {...} }

    Error 400: Missing fields
    Error 401: Invalid credentials
    """
    data = request.get_json(silent=True) or {}

    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''

    if not email or not password:
        return jsonify({
            'success': False,
            'error': 'Please provide both email and password.'
        }), 400

    user = query_one(
        "SELECT id, name, email, phone, password_hash, role, avatar "
        "FROM `users` WHERE `email` = %s LIMIT 1",
        (email,)
    )

    # Accounts created through Google may not have a local password, and old
    # imported records can contain password hashes from an unsupported format.
    # Neither case should turn an invalid login attempt into a server error.
    password_hash = (user or {}).get('password_hash') or ''
    try:
        password_matches = check_password_hash(password_hash, password)
    except (TypeError, ValueError):
        password_matches = False

    if not user or not password_matches:
        return jsonify({
            'success': False,
            'error': 'Invalid email or password.'
        }), 401

    # Remove sensitive field
    del user['password_hash']
    user['id'] = int(user['id'])
    session['kartik_user'] = user

    return jsonify({
        'success': True,
        'message': 'Login successful.',
        'user': user
    })


@auth_bp.route('/google', methods=['POST'])
def google_auth():
    """
    POST /api/auth/google
    Handle Google sign-in: find or create user by email.

    Request Body (JSON):
        {
            "email": "user@gmail.com",     (required)
            "name": "Google User",         (optional)
            "google_id": "abc123",         (optional)
            "avatar": "https://..."        (optional)
        }

    Response 200:
        { "success": true, "message": "Google authentication verified.", "user": {...} }
    """
    data = request.get_json(silent=True) or {}

    email = (data.get('email') or '').strip().lower()
    name = (data.get('name') or 'Google Member').strip()
    google_id = (data.get('google_id') or '').strip()
    avatar = (data.get('avatar') or '').strip()

    if not email:
        return jsonify({
            'success': False,
            'error': 'Google account email is required.'
        }), 400

    user = query_one(
        "SELECT id, name, email, phone, role, avatar "
        "FROM `users` WHERE `email` = %s LIMIT 1",
        (email,)
    )

    if user:
        # Update Google ID and avatar
        execute(
            "UPDATE `users` SET `google_id` = %s, `avatar` = COALESCE(%s, `avatar`) WHERE `id` = %s",
            (google_id, avatar or None, user['id'])
        )
    else:
        # Register new client via Google
        user_id = execute(
            "INSERT INTO `users` (`name`, `email`, `google_id`, `avatar`, `role`) "
            "VALUES (%s, %s, %s, %s, 'client')",
            (name, email, google_id, avatar or None)
        )
        user = {
            'id': user_id,
            'name': name,
            'email': email,
            'phone': None,
            'role': 'client',
            'avatar': avatar
        }

    user['id'] = int(user['id'])
    session['kartik_user'] = user

    return jsonify({
        'success': True,
        'message': 'Google authentication verified.',
        'user': user
    })


@auth_bp.route('/logout', methods=['POST'])
def logout():
    """
    POST /api/auth/logout
    Clear the current session.

    Response 200:
        { "success": true, "message": "Logged out successfully." }
    """
    session.pop('kartik_user', None)
    session.clear()

    return jsonify({
        'success': True,
        'message': 'Logged out successfully.'
    })
