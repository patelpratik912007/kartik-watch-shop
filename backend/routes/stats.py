"""
Kartik Watch Shop — Statistics & Summary API
Aggregates live database metrics for the administration dashboard.

Endpoints:
    GET /api/stats  — Get all dashboard metrics + recent activity
"""

from flask import Blueprint, jsonify
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
from db import scalar, query

stats_bp = Blueprint('stats', __name__, url_prefix='/api/stats')


@stats_bp.route('', methods=['GET'])
def get_stats():
    """
    GET /api/stats
    Returns aggregated business metrics and recent activity for the admin dashboard.

    Response 200:
        {
            "success": true,
            "metrics": {
                "total_orders": 5,
                "total_revenue": 340000.0,
                "total_products": 31,
                "total_services": 3,
                "total_valuations": 1,
                "total_users": 4
            },
            "recent_orders": [ ... ],
            "recent_bookings": [ ... ]
        }

    Error 500: Database error
    """
    try:
        total_orders = int(scalar("SELECT COUNT(*) FROM `orders`") or 0)
        total_revenue = float(scalar(
            "SELECT COALESCE(SUM(`total_amount`), 0) FROM `orders` WHERE `payment_status` = 'verified'"
        ) or 0)
        total_products = int(scalar("SELECT COUNT(*) FROM `products`") or 0)
        total_services = int(scalar("SELECT COUNT(*) FROM `service_bookings`") or 0)
        total_valuations = int(scalar("SELECT COUNT(*) FROM `sell_inquiries`") or 0)
        total_users = int(scalar("SELECT COUNT(*) FROM `users`") or 0)

        # Recent 5 orders
        recent_orders = query(
            "SELECT order_number, client_name, client_phone, total_amount, "
            "payment_method, order_status, created_at "
            "FROM `orders` ORDER BY created_at DESC LIMIT 5"
        )

        # Recent 5 service bookings
        recent_bookings = query(
            "SELECT booking_reference, client_name, client_phone, watch_brand, "
            "service_name, appointment_date, booking_status "
            "FROM `service_bookings` ORDER BY created_at DESC LIMIT 5"
        )

        return jsonify({
            'success': True,
            'metrics': {
                'total_orders': total_orders,
                'total_revenue': total_revenue,
                'total_products': total_products,
                'total_services': total_services,
                'total_valuations': total_valuations,
                'total_users': total_users
            },
            'recent_orders': recent_orders,
            'recent_bookings': recent_bookings
        })

    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500
