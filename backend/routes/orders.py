"""
Kartik Watch Shop — Orders API
Handles order placement (with line items), single order lookup, and listing.

Endpoints:
    POST /api/orders                    — Place a new order
    GET  /api/orders                    — List recent orders
    GET  /api/orders/<order_number>     — Get single order by reference number
"""

from flask import Blueprint, request, jsonify, session
import uuid
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import get_connection, query, query_one

orders_bp = Blueprint('orders', __name__, url_prefix='/api/orders')


def generate_order_number():
    """
    Generate a collision-resistant order number using UUID.
    BUG FIX: Replaced mt_rand() which could produce duplicate UNIQUE key collisions.
    Format: KWS-ORD-XXXXXX (6-char hex from UUID)
    """
    return 'KWS-ORD-' + uuid.uuid4().hex[:6].upper()


@orders_bp.route('', methods=['POST'])
def create_order():
    """
    POST /api/orders
    Place a new order with payment details and line items.

    Request Body (JSON):
        {
            "client_name": "Aarav Patel",           (required)
            "client_email": "aarav@example.com",    (required)
            "client_phone": "+91 98250 54321",      (required)
            "shipping_address": "Radhanpur Road",   (optional, default: "Radhanpur Road, Mehsana")
            "city": "Mehsana",                      (optional, default: "Mehsana")
            "state": "Gujarat",                     (optional, default: "Gujarat")
            "pincode": "384002",                    (optional, default: "384002")
            "payment_method": "UPI (Google Pay)",   (optional, default: "UPI")
            "payment_status": "verified",           (optional, default: "verified")
            "transaction_id": "TXN-UPI-...",        (optional, auto-generated)
            "total_amount": 68000.00,               (required, must be > 0)
            "notes": "Gift wrapping please",        (optional)
            "items": [                              (optional)
                {
                    "id": 1,
                    "name": "Seiko Prospex Speedtimer",
                    "price": 68000,
                    "qty": 1
                }
            ]
        }

    Response 201:
        {
            "success": true,
            "message": "Order registered successfully with Mehsana Boutique.",
            "order_number": "KWS-ORD-A1B2C3",
            "order_id": 2,
            "total_amount": 68000.0,
            "transaction_id": "TXN-A1B2C3D4"
        }

    Error 400: Missing required fields
    Error 500: Database error
    """
    data = request.get_json(silent=True) or {}

    client_name = (data.get('client_name') or '').strip()
    client_email = (data.get('client_email') or '').strip().lower()
    client_phone = (data.get('client_phone') or '').strip()
    shipping_address = (data.get('shipping_address') or 'Radhanpur Road, Mehsana').strip()
    city = (data.get('city') or 'Mehsana').strip()
    state = (data.get('state') or 'Gujarat').strip()
    pincode = (data.get('pincode') or '384002').strip()
    payment_method = (data.get('payment_method') or 'UPI').strip()
    payment_status = (data.get('payment_status') or 'verified').strip()
    transaction_id = (data.get('transaction_id') or ('TXN-' + uuid.uuid4().hex[:8].upper())).strip()
    try:
        total_amount = float(data.get('total_amount') or 0)
    except (TypeError, ValueError):
        return jsonify({
            'success': False,
            'error': 'Total amount must be a valid number.'
        }), 400
    notes = (data.get('notes') or '').strip()
    items = data.get('items') or []

    # Validation
    if not client_name or not client_email or not client_phone or total_amount <= 0:
        return jsonify({
            'success': False,
            'error': 'Missing required order details (name, email, phone, and valid total are required).'
        }), 400

    user_id = (session.get('kartik_user') or {}).get('id')
    order_number = generate_order_number()

    conn = get_connection()
    try:
        conn.begin()
        with conn.cursor() as cursor:
            # Insert order
            cursor.execute(
                "INSERT INTO `orders` "
                "(`order_number`, `user_id`, `client_name`, `client_email`, `client_phone`, "
                "`shipping_address`, `city`, `state`, `pincode`, `payment_method`, "
                "`payment_status`, `transaction_id`, `total_amount`, `order_status`, `notes`) "
                "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'placed', %s)",
                (order_number, user_id, client_name, client_email, client_phone,
                 shipping_address, city, state, pincode, payment_method,
                 payment_status, transaction_id, total_amount, notes or None)
            )
            order_id = cursor.lastrowid

            # Insert order items
            if items and isinstance(items, list):
                for item in items:
                    try:
                        product_id = int(item.get('id', 1))
                        product_name = str(item.get('name', 'Luxury Watch')).strip() or 'Luxury Watch'
                        price = float(item.get('price', 0))
                        qty = max(1, int(item.get('qty', item.get('quantity', 1))))
                    except (AttributeError, TypeError, ValueError):
                        conn.rollback()
                        return jsonify({
                            'success': False,
                            'error': 'Each order item must include valid id, price, and quantity values.'
                        }), 400

                    if price < 0:
                        conn.rollback()
                        return jsonify({
                            'success': False,
                            'error': 'Order item prices cannot be negative.'
                        }), 400
                    subtotal = price * qty

                    cursor.execute(
                        "INSERT INTO `order_items` "
                        "(`order_id`, `product_id`, `product_name`, `price`, `quantity`, `subtotal`) "
                        "VALUES (%s, %s, %s, %s, %s, %s)",
                        (order_id, product_id, product_name, price, qty, subtotal)
                    )

        conn.commit()

        return jsonify({
            'success': True,
            'message': 'Order registered successfully with Mehsana Boutique.',
            'order_number': order_number,
            'order_id': order_id,
            'total_amount': total_amount,
            'transaction_id': transaction_id
        }), 201

    except Exception as e:
        conn.rollback()
        return jsonify({
            'success': False,
            'error': f'Failed to save order: {str(e)}'
        }), 500
    finally:
        conn.close()


@orders_bp.route('/<order_number>', methods=['GET'])
def get_order(order_number):
    """
    GET /api/orders/<order_number>
    Retrieve a single order by its reference number.

    URL Params:
        order_number (str): e.g., "KWS-ORD-A1B2C3"

    Response 200:
        { "success": true, "order": { ..., "items": [...] } }

    Error 404: Order not found
    """
    order = query_one(
        "SELECT * FROM `orders` WHERE `order_number` = %s LIMIT 1",
        (order_number,)
    )

    if not order:
        return jsonify({'success': False, 'error': 'Order not found.'}), 404

    order['id'] = int(order['id'])
    order['total_amount'] = float(order['total_amount'])

    # Fetch line items
    items = query(
        "SELECT * FROM `order_items` WHERE `order_id` = %s",
        (order['id'],)
    )
    order['items'] = items

    return jsonify({'success': True, 'order': order})


@orders_bp.route('', methods=['GET'])
def list_orders():
    """
    GET /api/orders
    List the 50 most recent orders with item counts.

    Query Parameters:
        order_number (str): If provided, fetches a single order (redirect to detail).

    Response 200:
        {
            "success": true,
            "count": 5,
            "orders": [ {...}, ... ]
        }
    """
    # Support legacy ?order_number= query param
    ref = request.args.get('order_number', '').strip()
    if ref:
        return get_order(ref)

    orders = query(
        "SELECT o.*, COUNT(oi.id) as item_count "
        "FROM `orders` o "
        "LEFT JOIN `order_items` oi ON o.id = oi.order_id "
        "GROUP BY o.id "
        "ORDER BY o.created_at DESC "
        "LIMIT 50"
    )

    for order in orders:
        order['id'] = int(order['id'])
        order['total_amount'] = float(order['total_amount'])
        order['item_count'] = int(order['item_count'])

    return jsonify({
        'success': True,
        'count': len(orders),
        'orders': orders
    })
