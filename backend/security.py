"""
Kartik Watch Shop — Security & Rate Limiting System
Protects backend APIs against brute-force attacks, unauthorized access, and malicious payloads.
"""

import time
import re
import html
from functools import wraps
from flask import request, jsonify, session
from config import Config

# In-memory storage for rate limiting: ip -> list of timestamps
_FAILED_ATTEMPTS = {}
_LOCKOUTS = {}

# Allowed image extensions
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}


def get_client_ip():
    """Retrieve client real IP, accounting for reverse proxies."""
    if request.headers.get('X-Forwarded-For'):
        return request.headers.get('X-Forwarded-For').split(',')[0].strip()
    return request.remote_addr or '127.0.0.1'


def is_rate_limited(endpoint_tag='auth', max_attempts=5, window_seconds=600, lockout_seconds=900):
    """
    Check if the client IP is currently rate-limited.
    - endpoint_tag: grouping key
    - max_attempts: failed attempts before lockout
    - window_seconds: sliding window (10 minutes)
    - lockout_seconds: penalty lockout (15 minutes)
    """
    ip = get_client_ip()
    key = f"{endpoint_tag}:{ip}"
    now = time.time()

    # Check if in lockout
    lockout_until = _LOCKOUTS.get(key, 0)
    if now < lockout_until:
        remaining = int(lockout_until - now)
        return True, remaining

    # Clean old attempts
    attempts = [t for t in _FAILED_ATTEMPTS.get(key, []) if now - t < window_seconds]
    _FAILED_ATTEMPTS[key] = attempts

    if len(attempts) >= max_attempts:
        _LOCKOUTS[key] = now + lockout_seconds
        return True, lockout_seconds

    return False, 0


def record_failed_attempt(endpoint_tag='auth'):
    """Record a failed security/authentication attempt for this IP."""
    ip = get_client_ip()
    key = f"{endpoint_tag}:{ip}"
    now = time.time()
    if key not in _FAILED_ATTEMPTS:
        _FAILED_ATTEMPTS[key] = []
    _FAILED_ATTEMPTS[key].append(now)


def reset_failed_attempts(endpoint_tag='auth'):
    """Reset attempts on successful login/authorization."""
    ip = get_client_ip()
    key = f"{endpoint_tag}:{ip}"
    _FAILED_ATTEMPTS.pop(key, None)
    _LOCKOUTS.pop(key, None)


def is_admin_authorized():
    """
    Verify whether the current request is from an authorized Shop Owner.
    Checks:
    1. 'X-Owner-Token' matching Config.OWNER_SECRET_TOKEN
    2. Authorization: Bearer <token>
    3. Active Flask session with role == 'admin'
    """
    # 1. Header token
    owner_token = request.headers.get('X-Owner-Token')
    if owner_token and owner_token == Config.OWNER_SECRET_TOKEN:
        return True

    # 2. Bearer token
    auth_header = request.headers.get('Authorization', '')
    if auth_header.startswith('Bearer '):
        token = auth_header.split(' ', 1)[1].strip()
        if token == Config.OWNER_SECRET_TOKEN:
            return True

    # 3. Session role
    user = session.get('kartik_user')
    if user and user.get('role') == 'admin':
        return True

    return False


def require_admin(f):
    """Decorator to enforce shop owner/admin permission on sensitive routes."""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not is_admin_authorized():
            return jsonify({
                'success': False,
                'error': 'Access denied: Shop Owner authentication required.',
                'code': 'UNAUTHORIZED_OWNER'
            }), 403
        return f(*args, **kwargs)
    return decorated_function


def sanitize_text(text):
    """Strip or escape dangerous HTML characters to prevent XSS."""
    if not text:
        return ''
    cleaned = str(text).strip()
    # Remove script and iframe tags completely
    cleaned = re.sub(r'<\s*script[^>]*>.*?<\s*/\s*script\s*>', '', cleaned, flags=re.IGNORECASE | re.DOTALL)
    cleaned = re.sub(r'<\s*iframe[^>]*>.*?<\s*/\s*iframe\s*>', '', cleaned, flags=re.IGNORECASE | re.DOTALL)
    # Basic HTML escape
    return html.escape(cleaned)


def allowed_file(filename):
    """Validate file extension for uploaded images."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
