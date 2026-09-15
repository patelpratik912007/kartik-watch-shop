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
from security import require_admin, sanitize_text

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


# ══════════════════════════════════════════════════════════
# SHOP OWNER / ADMIN PRODUCT MANAGEMENT ENDPOINTS
# ══════════════════════════════════════════════════════════

@products_bp.route('', methods=['POST'])
@require_admin
def create_product():
    """
    POST /api/products (Protected: Shop Owner Only)
    Upload/Add a new luxury timepiece to the boutique catalog.
    """
    data = request.get_json(silent=True) or {}

    name = sanitize_text(data.get('name') or '')
    brand = sanitize_text(data.get('brand') or '').lower()
    category = sanitize_text(data.get('category') or f"{brand}-mens")
    gender = sanitize_text(data.get('gender') or 'male').lower()
    specs = sanitize_text(data.get('specs') or 'Swiss / Japanese Calibre')
    desc = sanitize_text(data.get('desc') or data.get('description') or '')
    badge = sanitize_text(data.get('badge') or f"{brand.upper()} • BOUTIQUE")
    image = (data.get('image') or 'assets/watches/demo/front.jpg').strip()

    try:
        price = float(data.get('price') or 0)
        mrp = float(data.get('mrp') or (price * 1.18))
        stock = int(data.get('stock') or 10)
        is_featured = 1 if data.get('is_featured') else 0
        rating = float(data.get('rating') or 5.0)
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'Invalid numeric price, mrp, or stock values.'}), 400

    if not name or not brand or price <= 0:
        return jsonify({
            'success': False,
            'error': 'Product name, brand, and a valid selling price are required.'
        }), 400

    # Determine next available ID
    from db import scalar, execute
    max_id = scalar("SELECT MAX(id) FROM `products`") or 0
    next_id = int(max_id) + 1

    try:
        execute(
            "INSERT INTO `products` "
            "(`id`, `name`, `brand`, `category`, `gender`, `price`, `mrp`, `rating`, `reviews`, "
            "`specs`, `description`, `image`, `badge`, `stock`, `is_featured`) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)",
            (next_id, name, brand, category, gender, price, mrp, rating, 1,
             specs, desc, image, badge, stock, is_featured)
        )
        new_prod = query_one("SELECT * FROM `products` WHERE id = %s LIMIT 1", (next_id,))
        return jsonify({
            'success': True,
            'message': f'Timepiece "{name}" added to boutique catalog.',
            'product': format_product(new_prod)
        }), 201
    except Exception as e:
        return jsonify({'success': False, 'error': f'Failed to create watch: {str(e)}'}), 500


@products_bp.route('/<int:product_id>', methods=['PUT'])
@require_admin
def update_product(product_id):
    """
    PUT /api/products/<id> (Protected: Shop Owner Only)
    Update price, discount, stock, or details of an existing timepiece.
    """
    data = request.get_json(silent=True) or {}
    existing = query_one("SELECT * FROM `products` WHERE id = %s LIMIT 1", (product_id,))
    if not existing:
        return jsonify({'success': False, 'error': 'Product not found.'}), 404

    from db import execute

    updates = []
    params = []

    if 'name' in data:
        updates.append("`name` = %s")
        params.append(sanitize_text(data['name']))

    if 'brand' in data:
        updates.append("`brand` = %s")
        params.append(sanitize_text(data['brand']).lower())

    if 'price' in data:
        try:
            updates.append("`price` = %s")
            params.append(float(data['price']))
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid price'}), 400

    if 'mrp' in data:
        try:
            updates.append("`mrp` = %s")
            params.append(float(data['mrp']))
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid MRP'}), 400

    if 'stock' in data:
        try:
            updates.append("`stock` = %s")
            params.append(int(data['stock']))
        except ValueError:
            return jsonify({'success': False, 'error': 'Invalid stock'}), 400

    if 'badge' in data:
        updates.append("`badge` = %s")
        params.append(sanitize_text(data['badge']))

    if 'specs' in data:
        updates.append("`specs` = %s")
        params.append(sanitize_text(data['specs']))

    if 'desc' in data or 'description' in data:
        desc = data.get('desc') or data.get('description')
        updates.append("`description` = %s")
        params.append(sanitize_text(desc))

    if 'image' in data:
        updates.append("`image` = %s")
        params.append(str(data['image']).strip())

    if 'is_featured' in data:
        updates.append("`is_featured` = %s")
        params.append(1 if data['is_featured'] else 0)

    if not updates:
        return jsonify({'success': False, 'error': 'No fields provided to update.'}), 400

    params.append(product_id)
    sql = f"UPDATE `products` SET {', '.join(updates)} WHERE id = %s"

    try:
        execute(sql, tuple(params))
        updated = query_one("SELECT * FROM `products` WHERE id = %s LIMIT 1", (product_id,))
        return jsonify({
            'success': True,
            'message': 'Timepiece details updated successfully.',
            'product': format_product(updated)
        })
    except Exception as e:
        return jsonify({'success': False, 'error': f'Failed to update watch: {str(e)}'}), 500


@products_bp.route('/<int:product_id>', methods=['DELETE'])
@require_admin
def delete_product(product_id):
    """
    DELETE /api/products/<id> (Protected: Shop Owner Only)
    Remove a timepiece from the boutique catalog.
    """
    from db import execute
    existing = query_one("SELECT id, name FROM `products` WHERE id = %s LIMIT 1", (product_id,))
    if not existing:
        return jsonify({'success': False, 'error': 'Product not found.'}), 404

    try:
        execute("DELETE FROM `products` WHERE id = %s", (product_id,))
        return jsonify({
            'success': True,
            'message': f'Timepiece #{product_id} ("{existing["name"]}") removed from catalog.'
        })
    except Exception as e:
        return jsonify({'success': False, 'error': f'Failed to delete watch: {str(e)}'}), 500


@products_bp.route('/batch-discount', methods=['POST'])
@require_admin
def batch_discount():
    """
    POST /api/products/batch-discount (Protected: Shop Owner Only)
    Apply a promotional discount percentage across a brand or storewide.
    """
    from db import execute
    data = request.get_json(silent=True) or {}
    brand = (data.get('brand') or 'all').strip().lower()

    try:
        discount_percent = float(data.get('discount_percent') or 0)
    except (TypeError, ValueError):
        return jsonify({'success': False, 'error': 'Discount percent must be a valid number.'}), 400

    if discount_percent < 0 or discount_percent > 90:
        return jsonify({'success': False, 'error': 'Discount must be between 0% and 90%.'}), 400

    multiplier = (100.0 - discount_percent) / 100.0

    if brand == 'all':
        execute("UPDATE `products` SET `price` = ROUND(`mrp` * %s, 0)", (multiplier,))
    else:
        execute("UPDATE `products` SET `price` = ROUND(`mrp` * %s, 0) WHERE `brand` = %s", (multiplier, brand))

    return jsonify({
        'success': True,
        'message': f'Promotional discount of {discount_percent}% applied to {"all timepieces" if brand == "all" else brand.upper()}.'
    })


@products_bp.route('/upload-image', methods=['POST'])
@require_admin
def upload_image():
    """
    POST /api/products/upload-image (Protected: Shop Owner Only)
    Securely upload product visual into the boutique assets.
    """
    from werkzeug.utils import secure_filename
    from security import allowed_file
    from config import Config
    import uuid

    if 'image' not in request.files:
        return jsonify({'success': False, 'error': 'No image file uploaded.'}), 400

    file = request.files['image']
    if file.filename == '':
        return jsonify({'success': False, 'error': 'No image file selected.'}), 400

    if not allowed_file(file.filename):
        return jsonify({'success': False, 'error': 'Only JPG, PNG, WEBP, and GIF images are permitted.'}), 400

    clean_name = secure_filename(file.filename)
    unique_name = f"watch_{uuid.uuid4().hex[:8]}_{clean_name}"
    save_path = os.path.join(Config.UPLOAD_FOLDER, unique_name)

    os.makedirs(Config.UPLOAD_FOLDER, exist_ok=True)
    file.save(save_path)

    relative_url = f"assets/watches/uploads/{unique_name}"
    return jsonify({
        'success': True,
        'message': 'Image uploaded successfully.',
        'url': relative_url
    })

