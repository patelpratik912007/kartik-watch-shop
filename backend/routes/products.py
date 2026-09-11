"""
Kartik Watch Shop — Products API
Product catalog listing, filtering, sorting, and single product detail.

Endpoints:
    GET /api/products        — List products with optional filters
    GET /api/products/<id>   — Get single product + related items
"""

from flask import Blueprint, request, jsonify
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import query, query_one

products_bp = Blueprint('products', __name__, url_prefix='/api/products')


def format_product(p):
    """Cast database row fields to proper Python types for JSON serialization."""
    if not p:
        return p
    p['id'] = int(p['id'])
    p['price'] = float(p['price'])
    p['mrp'] = float(p['mrp'])
    p['rating'] = float(p['rating'])
    p['reviews'] = int(p.get('reviews', 0))
    p['stock'] = int(p.get('stock', 0))
    p['is_featured'] = bool(p.get('is_featured', 0))

    # Map 'description' column to 'desc' in API response
    # (BUG FIX: PHP backend used wrong column alias causing SQL errors)
    if 'description' in p:
        p['desc'] = p.pop('description')

    return p


@products_bp.route('/<int:product_id>', methods=['GET'])
def get_product(product_id):
    """
    GET /api/products/<id>
    Retrieve a single product by its numeric ID, with related products.

    URL Params:
        id (int): Product ID

    Response 200:
        {
            "success": true,
            "product": {
                "id": 1,
                "name": "Seiko Prospex Speedtimer",
                "brand": "seiko",
                "category": "seiko-mens",
                "gender": "male",
                "price": 68000.0,
                "mrp": 80200.0,
                "rating": 5.0,
                "reviews": 24,
                "specs": "39mm • Solar Chrono Cal. V192",
                "desc": "Solar-powered precision...",
                "image": "assets/watches/seiko_speedtimer.jpg",
                "badge": "SEIKO • JAPAN",
                "stock": 8,
                "is_featured": true,
                "related": [...]
            }
        }

    Error 404: Product not found
    """
    product = query_one("SELECT * FROM `products` WHERE `id` = %s LIMIT 1", (product_id,))

    if not product:
        return jsonify({'success': False, 'error': 'Product not found'}), 404

    product = format_product(product)

    # Fetch related products (same brand, excluding current)
    # BUG FIX: Use correct column name 'description' instead of broken alias
    related = query(
        "SELECT id, name, brand, category, gender, price, mrp, rating, specs, "
        "description, image, badge "
        "FROM `products` WHERE `brand` = %s AND `id` != %s LIMIT 3",
        (product['brand'], product_id)
    )
    product['related'] = [format_product(r) for r in related]

    return jsonify({'success': True, 'product': product})


@products_bp.route('', methods=['GET'])
def list_products():
    """
    GET /api/products
    List all products with optional filtering, sorting, and pagination.

    Query Parameters:
        brand    (str): Filter by brand (e.g., "seiko", "tissot")
        gender   (str): Filter by gender ("male", "female", "unisex")
        category (str): Filter by category slug (e.g., "seiko-mens")
        search   (str): Search by name, specs, or brand (substring match)
        sort     (str): Sort order — "price_asc", "price_desc", "rating", "name", "default"
        limit    (int): Maximum number of products to return

    Response 200:
        {
            "success": true,
            "count": 31,
            "products": [ {...}, {...}, ... ]
        }
    """
    where_clauses = []
    params = []

    # ── Filters ──
    brand = request.args.get('brand', '').strip().lower()
    if brand:
        where_clauses.append("`brand` = %s")
        params.append(brand)

    gender = request.args.get('gender', '').strip().lower()
    if gender:
        where_clauses.append("`gender` = %s")
        params.append(gender)

    category = request.args.get('category', '').strip()
    if category:
        where_clauses.append("`category` = %s")
        params.append(category)

    search = request.args.get('search', '').strip()
    if search:
        where_clauses.append(
            "(`name` LIKE %s OR `specs` LIKE %s OR `brand` LIKE %s)"
        )
        search_pattern = f'%{search}%'
        params.extend([search_pattern, search_pattern, search_pattern])

    # ── Build SQL ──
    sql = (
        "SELECT id, name, brand, category, gender, price, mrp, rating, reviews, "
        "specs, description, image, badge, stock, is_featured FROM `products`"
    )

    if where_clauses:
        sql += " WHERE " + " AND ".join(where_clauses)

    # ── Sorting ──
    sort = request.args.get('sort', 'default')
    sort_map = {
        'price_asc': ' ORDER BY `price` ASC',
        'price_desc': ' ORDER BY `price` DESC',
        'rating': ' ORDER BY `rating` DESC, `reviews` DESC',
        'name': ' ORDER BY `name` ASC',
    }
    sql += sort_map.get(sort, ' ORDER BY `id` ASC')

    # ── Limit (BUG FIX: parameterized instead of string concatenation) ──
    limit = request.args.get('limit', '').strip()
    if limit and limit.isdigit():
        limit_val = int(limit)
        sql += " LIMIT %s"
        params.append(limit_val)

    products = query(sql, tuple(params))
    products = [format_product(p) for p in products]

    return jsonify({
        'success': True,
        'count': len(products),
        'products': products
    })
