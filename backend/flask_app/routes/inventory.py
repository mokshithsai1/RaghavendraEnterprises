from flask import Blueprint, jsonify, request
from extensions import db

inventory_bp = Blueprint("inventory", __name__)


@inventory_bp.route("/inventory/summary", methods=["GET"])
def get_inventory_summary():
    from models import Product, Category
    products = Product.query.filter_by(is_active=True).all()

    items = []
    low_stock_count = 0
    out_of_stock_count = 0

    for p in products:
        is_low = p.stock_quantity <= p.min_stock_alert
        is_out = p.stock_quantity == 0
        if is_out:
            out_of_stock_count += 1
        elif is_low:
            low_stock_count += 1

        items.append({
            "id": p.id,
            "name": p.name,
            "category_name": p.category.name if p.category else "",
            "stock_quantity": p.stock_quantity,
            "min_stock_alert": p.min_stock_alert,
            "godown_location": p.godown_location,
            "unit": p.unit,
            "is_low_stock": is_low,
        })

    return jsonify({
        "total_products": len(products),
        "low_stock_count": low_stock_count,
        "out_of_stock_count": out_of_stock_count,
        "items": items,
    })


@inventory_bp.route("/inventory/<int:product_id>", methods=["PATCH"])
def update_stock(product_id):
    from models import Product
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    if "stock_quantity" in data:
        product.stock_quantity = data["stock_quantity"]
    if "min_stock_alert" in data:
        product.min_stock_alert = data["min_stock_alert"]
    if "godown_location" in data:
        product.godown_location = data["godown_location"]

    db.session.commit()
    return jsonify(product.to_dict())
