from flask import Blueprint, jsonify
from datetime import date

dashboard_bp = Blueprint("dashboard", __name__)


@dashboard_bp.route("/dashboard/stats", methods=["GET"])
def get_dashboard_stats():
    from models import Product, Order, Category

    total_products = Product.query.filter_by(is_active=True).count()
    total_orders = Order.query.count()
    pending_orders = Order.query.filter_by(status="pending").count()
    total_categories = Category.query.count()

    today = date.today()
    todays_orders = Order.query.filter(Order.pickup_date == today).count()

    products = Product.query.filter_by(is_active=True).all()
    low_stock_items = sum(1 for p in products if p.stock_quantity <= p.min_stock_alert)

    recent_orders = (
        Order.query.order_by(Order.created_at.desc()).limit(5).all()
    )

    return jsonify({
        "total_products": total_products,
        "total_orders": total_orders,
        "pending_orders": pending_orders,
        "low_stock_items": low_stock_items,
        "todays_orders": todays_orders,
        "total_categories": total_categories,
        "recent_orders": [o.to_dict() for o in recent_orders],
    })
