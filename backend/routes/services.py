"""
Kartik Watch Shop — Services API
Handles watch repair & calibration service bookings.

Endpoints:
    POST /api/services              — Book a new service appointment
    GET  /api/services              — List recent bookings
    GET  /api/services/<reference>  — Get single booking by reference
"""

from flask import Blueprint, request, jsonify, session
from datetime import datetime, timedelta
import uuid
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import query, query_one, execute

services_bp = Blueprint('services', __name__, url_prefix='/api/services')


def generate_booking_reference():
    """
    Generate a collision-resistant booking reference using UUID.
    BUG FIX: Replaced mt_rand() which could produce duplicates.
    """
    return 'KWS-SRV-' + uuid.uuid4().hex[:6].upper()


@services_bp.route('', methods=['POST'])
def create_booking():
    """
    POST /api/services
    Book a new watch repair/calibration service appointment.

    Request Body (JSON):
        {
            "client_name": "Aarav Patel",               (required)
            "client_phone": "+91 98250 54321",           (required)
            "client_email": "aarav@example.com",         (optional)
            "service_id": "mechanical-calib",            (optional, default: "general-service")
            "service_name": "Mechanical Calibration",    (optional)
            "service_price": 1500.00,                    (optional, default: 1500)
            "watch_brand": "Seiko",                      (required)
            "watch_model": "Prospex Speedtimer",         (optional)
            "appointment_date": "2026-09-11",            (optional, default: +3 days)
            "appointment_slot": "11:00 AM - 01:00 PM",   (optional)
            "delivery_mode": "Mehsana Boutique Walk-in", (optional)
            "payment_status": "paid",                    (optional, default: "paid")
            "payment_method": "UPI QR",                  (optional, default: "UPI QR")
            "notes": "Request accuracy tuning"           (optional)
        }

    Response 201:
        {
            "success": true,
            "message": "Atelier horology service appointment booked successfully.",
            "booking_reference": "KWS-SRV-A1B2C3",
            "booking_id": 2,
            "appointment_date": "2026-09-11",
            "appointment_slot": "11:00 AM - 01:00 PM"
        }

    Error 400: Missing required fields
    Error 500: Database error
    """
    data = request.get_json(silent=True) or {}

    client_name = (data.get('client_name') or '').strip()
    client_phone = (data.get('client_phone') or '').strip()
    client_email = (data.get('client_email') or '').strip().lower()
    service_id = (data.get('service_id') or 'general-service').strip()
    service_name = (data.get('service_name') or 'Watch Atelier Service').strip()
    try:
        service_price = float(data.get('service_price') or 1500.00)
    except (TypeError, ValueError):
        return jsonify({
            'success': False,
            'error': 'Service price must be a valid number.'
        }), 400
    watch_brand = (data.get('watch_brand') or 'Luxury Watch').strip()
    watch_model = (data.get('watch_model') or 'Standard Model').strip()
    default_date = (datetime.now() + timedelta(days=3)).strftime('%Y-%m-%d')
    appointment_date = (data.get('appointment_date') or default_date).strip()
    appointment_slot = (data.get('appointment_slot') or '11:00 AM - 01:00 PM').strip()
    delivery_mode = (data.get('delivery_mode') or 'Mehsana Boutique Walk-in').strip()
    payment_status = (data.get('payment_status') or 'paid').strip()
    payment_method = (data.get('payment_method') or 'UPI QR').strip()
    notes = (data.get('notes') or '').strip()

    # Validation
    if not client_name or not client_phone or not watch_brand:
        return jsonify({
            'success': False,
            'error': 'Client name, phone number, and watch brand are required.'
        }), 400

    if service_price < 0:
        return jsonify({
            'success': False,
            'error': 'Service price cannot be negative.'
        }), 400

    user_id = (session.get('kartik_user') or {}).get('id')
    booking_reference = generate_booking_reference()

    try:
        booking_id = execute(
            "INSERT INTO `service_bookings` "
            "(`booking_reference`, `user_id`, `client_name`, `client_phone`, `client_email`, "
            "`service_id`, `service_name`, `service_price`, `watch_brand`, `watch_model`, "
            "`appointment_date`, `appointment_slot`, `delivery_mode`, `payment_status`, "
            "`payment_method`, `booking_status`, `notes`) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, 'confirmed', %s)",
            (booking_reference, user_id, client_name, client_phone, client_email,
             service_id, service_name, service_price, watch_brand, watch_model,
             appointment_date, appointment_slot, delivery_mode, payment_status,
             payment_method, notes or None)
        )

        return jsonify({
            'success': True,
            'message': 'Atelier horology service appointment booked successfully.',
            'booking_reference': booking_reference,
            'booking_id': booking_id,
            'appointment_date': appointment_date,
            'appointment_slot': appointment_slot
        }), 201

    except Exception as e:
        return jsonify({
            'success': False,
            'error': f'Failed to book service: {str(e)}'
        }), 500


@services_bp.route('/<reference>', methods=['GET'])
def get_booking(reference):
    """
    GET /api/services/<reference>
    Retrieve a single service booking by its reference number.

    Response 200:
        { "success": true, "booking": { ... } }

    Error 404: Booking not found
    """
    booking = query_one(
        "SELECT * FROM `service_bookings` WHERE `booking_reference` = %s LIMIT 1",
        (reference,)
    )

    if not booking:
        return jsonify({'success': False, 'error': 'Service booking not found.'}), 404

    booking['id'] = int(booking['id'])
    booking['service_price'] = float(booking['service_price'])

    return jsonify({'success': True, 'booking': booking})


@services_bp.route('', methods=['GET'])
def list_bookings():
    """
    GET /api/services
    List the 50 most recent service bookings.

    Query Parameters:
        reference (str): If provided, fetches a single booking.

    Response 200:
        {
            "success": true,
            "count": 3,
            "bookings": [ {...}, ... ]
        }
    """
    # Support legacy ?reference= query param
    ref = request.args.get('reference', '').strip()
    if ref:
        return get_booking(ref)

    bookings = query(
        "SELECT * FROM `service_bookings` ORDER BY `created_at` DESC LIMIT 50"
    )

    for b in bookings:
        b['id'] = int(b['id'])
        b['service_price'] = float(b['service_price'])

    return jsonify({
        'success': True,
        'count': len(bookings),
        'bookings': bookings
    })
