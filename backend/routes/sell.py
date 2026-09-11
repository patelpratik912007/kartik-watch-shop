"""
Kartik Watch Shop — Sell / Valuation API
Handles pre-owned watch valuation and buyback inquiries.

Endpoints:
    POST /api/sell              — Submit a new valuation inquiry
    GET  /api/sell              — List recent inquiries
    GET  /api/sell/<reference>  — Get single inquiry by reference number
"""

from flask import Blueprint, request, jsonify, session
import uuid
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import query, query_one, execute

sell_bp = Blueprint('sell', __name__, url_prefix='/api/sell')


def generate_reference():
    """
    Generate a collision-resistant valuation reference using UUID.
    BUG FIX: Replaced mt_rand() which could produce duplicates.
    """
    return 'KWS-VAL-' + uuid.uuid4().hex[:6].upper()


@sell_bp.route('', methods=['POST'])
def create_inquiry():
    """
    POST /api/sell
    Submit a pre-owned watch valuation/buyback inquiry.

    Request Body (JSON):
        {
            "client_name": "Aarav Patel",           (required)
            "client_phone": "+91 98250 54321",       (required)
            "client_email": "aarav@example.com",     (optional)
            "watch_brand": "Tissot",                 (required)
            "model_name": "PRX Powermatic 80 Blue",  (optional)
            "condition_state": "Excellent",          (optional, default: "Good")
            "purchase_year": 2023,                   (optional)
            "has_box": true,                         (optional)
            "has_papers": true,                      (optional)
            "has_receipt": true,                     (optional)
            "has_extra_strap": false,                (optional)
            "expected_price": 48000.00,              (optional)
            "notes": "Complete set with warranty"    (optional)
        }

    Response 201:
        {
            "success": true,
            "message": "Valuation inquiry submitted successfully...",
            "reference_no": "KWS-VAL-A1B2C3",
            "inquiry_id": 2
        }

    Error 400: Missing required fields
    Error 500: Database error
    """
    data = request.get_json(silent=True) or {}

    client_name = (data.get('client_name') or '').strip()
    client_phone = (data.get('client_phone') or '').strip()
    client_email = (data.get('client_email') or '').strip().lower()
    watch_brand = (data.get('watch_brand') or '').strip()
    model_name = (data.get('model_name') or '').strip()
    condition_state = (data.get('condition_state') or 'Good').strip()
    try:
        purchase_year = int(data['purchase_year']) if data.get('purchase_year') else None
        expected_price = float(data['expected_price']) if data.get('expected_price') else None
    except (TypeError, ValueError):
        return jsonify({
            'success': False,
            'error': 'Purchase year and expected price must be valid numbers.'
        }), 400
    has_box = 1 if data.get('has_box') else 0
    has_papers = 1 if data.get('has_papers') else 0
    has_receipt = 1 if data.get('has_receipt') else 0
    has_extra_strap = 1 if data.get('has_extra_strap') else 0
    notes = (data.get('notes') or '').strip()

    # Validation
    if not client_name or not client_phone or not watch_brand:
        return jsonify({
            'success': False,
            'error': 'Client name, phone number, and watch brand are required.'
        }), 400

    if expected_price is not None and expected_price < 0:
        return jsonify({
            'success': False,
            'error': 'Expected price cannot be negative.'
        }), 400

    user_id = (session.get('kartik_user') or {}).get('id')
    reference_no = generate_reference()

    try:
        inquiry_id = execute(
            "INSERT INTO `sell_inquiries` "
            "(`reference_no`, `user_id`, `client_name`, `client_phone`, `client_email`, "
            "`watch_brand`, `model_name`, `condition_state`, `purchase_year`, "
            "`has_box`, `has_papers`, `has_receipt`, `has_extra_strap`, "
            "`expected_price`, `status`, `notes`) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'submitted', %s)",
            (reference_no, user_id, client_name, client_phone, client_email,
             watch_brand, model_name, condition_state, purchase_year,
             has_box, has_papers, has_receipt, has_extra_strap,
             expected_price, notes or None)
        )

        return jsonify({
            'success': True,
            'message': 'Valuation inquiry submitted successfully to Kartik Watch Shop appraisers.',
            'reference_no': reference_no,
            'inquiry_id': inquiry_id
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to submit valuation: {str(e)}'
        }), 500


@sell_bp.route('/<reference>', methods=['GET'])
def get_inquiry(reference):
    """
    GET /api/sell/<reference>
    Retrieve a single sell inquiry by its reference number.

    Response 200:
        { "success": true, "inquiry": { ... } }

    Error 404: Inquiry not found
    """
    inquiry = query_one(
        "SELECT * FROM `sell_inquiries` WHERE `reference_no` = %s LIMIT 1",
        (reference,)
    )

    if not inquiry:
        return jsonify({'success': False, 'error': 'Valuation inquiry not found.'}), 404

    inquiry['id'] = int(inquiry['id'])
    inquiry['has_box'] = bool(inquiry['has_box'])
    inquiry['has_papers'] = bool(inquiry['has_papers'])
    inquiry['has_receipt'] = bool(inquiry['has_receipt'])
    inquiry['has_extra_strap'] = bool(inquiry['has_extra_strap'])
    if inquiry.get('expected_price') is not None:
        inquiry['expected_price'] = float(inquiry['expected_price'])

    return jsonify({'success': True, 'inquiry': inquiry})


@sell_bp.route('', methods=['GET'])
def list_inquiries():
    """
    GET /api/sell
    List the 50 most recent sell/valuation inquiries.

    Query Parameters:
        reference (str): If provided, fetches a single inquiry.

    Response 200:
        {
            "success": true,
            "count": 3,
            "inquiries": [ {...}, ... ]
        }
    """
    # Support legacy ?reference= query param
    ref = request.args.get('reference', '').strip()
    if ref:
        return get_inquiry(ref)

    inquiries = query(
        "SELECT * FROM `sell_inquiries` ORDER BY `created_at` DESC LIMIT 50"
    )

    for inq in inquiries:
        inq['id'] = int(inq['id'])
        inq['has_box'] = bool(inq['has_box'])
        inq['has_papers'] = bool(inq['has_papers'])
        inq['has_receipt'] = bool(inq['has_receipt'])
        inq['has_extra_strap'] = bool(inq['has_extra_strap'])
        if inq.get('expected_price') is not None:
            inq['expected_price'] = float(inq['expected_price'])

    return jsonify({
        'success': True,
        'count': len(inquiries),
        'inquiries': inquiries
    })
