from flask import Blueprint, jsonify, request
from extensions import db
from datetime import date

orders_bp = Blueprint("orders", __name__)


@orders_bp.route("/orders", methods=["GET"])
def list_orders():
    from models import Order
    query = Order.query

    status = request.args.get("status")
    date_filter = request.args.get("date")

    if status:
        query = query.filter(Order.status == status)
    if date_filter:
        try:
            filter_date = date.fromisoformat(date_filter)
            query = query.filter(Order.pickup_date == filter_date)
        except ValueError:
            pass

    orders = query.order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@orders_bp.route("/orders/<int:order_id>", methods=["GET"])
def get_order(order_id):
    from models import Order
    order = Order.query.get_or_404(order_id)
    return jsonify(order.to_dict())


@orders_bp.route("/orders", methods=["POST"])
def create_order():
    from models import Order, OrderItem, Product
    data = request.get_json()

    try:
        pickup_date = date.fromisoformat(data["pickup_date"])
    except (ValueError, KeyError):
        return jsonify({"error": "Invalid pickup_date format. Use YYYY-MM-DD"}), 400

    order = Order(
        customer_name=data["customer_name"],
        customer_phone=data["customer_phone"],
        customer_email=data.get("customer_email"),
        pickup_date=pickup_date,
        notes=data.get("notes"),
        status="pending",
    )
    db.session.add(order)
    db.session.flush()

    total = 0.0
    items_data = data.get("items", [])
    if not items_data:
        return jsonify({"error": "Order must have at least one item"}), 400

    for item_data in items_data:
        product = Product.query.get(item_data["product_id"])
        if not product:
            return jsonify({"error": f"Product {item_data['product_id']} not found"}), 404

        qty = item_data["quantity"]
        item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=qty,
            unit_price=product.price,
        )
        db.session.add(item)
        total += float(product.price) * qty

    order.total_amount = total
    db.session.commit()
    return jsonify(order.to_dict()), 201


@orders_bp.route("/orders/<int:order_id>/status", methods=["PATCH"])
def update_order_status(order_id):
    from models import Order
    order = Order.query.get_or_404(order_id)
    data = request.get_json()

    valid_statuses = ["pending", "confirmed", "ready", "completed", "cancelled"]
    new_status = data.get("status")
    if new_status not in valid_statuses:
        return jsonify({"error": f"Invalid status. Must be one of: {valid_statuses}"}), 400

    order.status = new_status
    db.session.commit()
    return jsonify(order.to_dict())


@orders_bp.route("/orders/by-phone", methods=["GET"])
def orders_by_phone():
    from models import Order
    phone = request.args.get("phone", "").strip()
    if not phone:
        return jsonify({"error": "phone is required"}), 400
    orders = Order.query.filter_by(customer_phone=phone).order_by(Order.created_at.desc()).all()
    return jsonify([o.to_dict() for o in orders])


@orders_bp.route("/orders/<int:order_id>/cancel", methods=["PATCH"])
def cancel_order(order_id):
    from models import Order
    order = Order.query.get_or_404(order_id)
    cancellable = {"pending", "confirmed", "ready"}
    if order.status not in cancellable:
        return jsonify({"error": f"Order cannot be cancelled in '{order.status}' status"}), 400
    order.status = "cancelled"
    db.session.commit()
    return jsonify(order.to_dict())
