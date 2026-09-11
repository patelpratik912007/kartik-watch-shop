"""
Kartik Watch Shop — Flask Application Entry Point
Luxury Horology Boutique • Mehsana, Gujarat

This is the main entry point for the Python backend server.
It serves:
    - All REST API endpoints under /api/*
    - The frontend static files (HTML, CSS, JS, images) directly from root and /frontend/
    - Health & config diagnostics endpoints

Usage:
    python app.py
    # -> Server starts at http://localhost:5000
    # -> Auto-opens browser when server is verified ready
"""

import os
import sys
import threading
import time
import urllib.request
import webbrowser
from datetime import timedelta
from flask import Flask, send_from_directory, redirect, jsonify, request
from flask_cors import CORS

# Ensure the backend/ directory is in the path
sys.path.insert(0, os.path.dirname(__file__))

from config import Config
from db import ensure_database

# ── Import Route Blueprints ──
from routes.auth import auth_bp
from routes.products import products_bp
from routes.orders import orders_bp
from routes.services import services_bp
from routes.sell import sell_bp
from routes.stats import stats_bp


def create_app():
    """Application factory — creates and configures the Flask app."""
    app = Flask(__name__, static_folder=None)

    # ── Configuration ──
    app.config['SECRET_KEY'] = Config.SECRET_KEY
    app.config['SESSION_COOKIE_SAMESITE'] = 'Lax'
    app.config['SESSION_COOKIE_HTTPONLY'] = True
    app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=7)

    # ── CORS ──
    CORS(app, supports_credentials=True, resources={
        r"/api/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization"],
        }
    })

    # ── Register API Blueprints ──
    app.register_blueprint(auth_bp)
    app.register_blueprint(products_bp)
    app.register_blueprint(orders_bp)
    app.register_blueprint(services_bp)
    app.register_blueprint(sell_bp)
    app.register_blueprint(stats_bp)

    # ── Frontend Static File Serving ──
    frontend_dir = Config.FRONTEND_DIR

    @app.route('/')
    def index():
        """Serve homepage directly from root."""
        return send_from_directory(frontend_dir, 'index.html')

    @app.route('/frontend/<path:filename>')
    def serve_frontend_compat(filename):
        """Backward compatibility for /frontend/* URLs."""
        return send_from_directory(frontend_dir, filename)

    @app.route('/frontend')
    def frontend_redirect():
        return redirect('/')

    @app.route('/<path:filename>')
    def serve_static(filename):
        """Serve static files (HTML, CSS, JS, images, fonts) from root."""
        if filename.startswith('api/'):
            return jsonify({
                'success': False,
                'error': 'API endpoint not found. Check URL.',
                'hint': 'API endpoints are at /api/* (e.g., /api/products, /api/health)'
            }), 404

        file_path = os.path.join(frontend_dir, filename)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return send_from_directory(frontend_dir, filename)

        # Allow URLs without .html extension (e.g., /collections -> collections.html)
        html_file = file_path + '.html'
        if os.path.exists(html_file) and os.path.isfile(html_file):
            return send_from_directory(frontend_dir, filename + '.html')

        return jsonify({
            'success': False,
            'error': f'Page or asset not found: {filename}'
        }), 404

    # ── Health Check ──
    @app.route('/api/health', methods=['GET'])
    def health_check():
        """Simple health check endpoint."""
        return jsonify({
            'status': 'ok',
            'server': 'Kartik Watch Shop — Python Flask Backend',
            'version': '2.0.0'
        })

    # ── Configuration & API Keys Status ──
    @app.route('/api/config-status', methods=['GET'])
    def config_status():
        return jsonify({
            'success': True,
            'environment': {
                'flask_debug': Config.DEBUG,
                'flask_port': Config.PORT,
            },
            'api_keys_status': {
                'google_oauth': {
                    'configured': bool(Config.GOOGLE_CLIENT_ID and Config.GOOGLE_CLIENT_SECRET),
                },
                'razorpay': {
                    'configured': bool(Config.RAZORPAY_KEY_ID and Config.RAZORPAY_KEY_SECRET),
                }
            }
        })

    # ── Public Configuration (Safe for Frontend) ──
    @app.route('/api/config/public', methods=['GET'])
    def config_public():
        return jsonify({
            'success': True,
            'google_client_id': Config.GOOGLE_CLIENT_ID,
            'razorpay_key_id': Config.RAZORPAY_KEY_ID,
            'google_maps_api_key': Config.GOOGLE_MAPS_API_KEY
        })

    return app


# Production WSGI application object (used by Gunicorn / Render / Railway)
app = create_app()


def open_browser_when_ready(port):
    """
    Polls the local health check endpoint and only launches the browser
    AFTER Flask is actively listening. Eliminates connection refused errors.
    """
    def poll_loop():
        url = f"http://localhost:{port}/"
        health_url = f"http://127.0.0.1:{port}/api/health"
        for _ in range(30):
            time.sleep(0.25)
            try:
                with urllib.request.urlopen(health_url, timeout=1) as res:
                    if res.status == 200:
                        webbrowser.open(url)
                        return
            except Exception:
                pass

    t = threading.Thread(target=poll_loop, daemon=True)
    t.start()


# ── Main Entry ──
if __name__ == '__main__':
    print("=" * 60)
    print("  Kartik Watch Shop — Luxury Horology Boutique")
    print("  Python Flask Backend Server")
    print("=" * 60)
    print()

    # Ensure database exists (MySQL or SQLite)
    try:
        ensure_database()
    except Exception as e:
        print(f"[DB NOTE] Database check: {e}")

    # Launch browser only once (avoid duplicate in Flask debug reloader)
    is_reloader_child = os.environ.get('WERKZEUG_RUN_MAIN') == 'true'
    is_plain_run = not Config.DEBUG

    if is_reloader_child or is_plain_run:
        open_browser_when_ready(Config.PORT)

    print(f"\n  Boutique Live: http://localhost:{Config.PORT}/")
    print(f"  API Base:      http://localhost:{Config.PORT}/api/")
    print(f"  Products:      http://localhost:{Config.PORT}/api/products")
    print(f"  Health:        http://localhost:{Config.PORT}/api/health")
    print(f"\n  Press Ctrl+C to stop the server.\n")

    app.run(
        host=Config.HOST,
        port=Config.PORT,
        debug=Config.DEBUG
    )
