from flask import Blueprint, jsonify, request
from extensions import db

products_bp = Blueprint("products", __name__)


@products_bp.route("/products", methods=["GET"])
def list_products():
    from models import Product
    query = Product.query

    category_id = request.args.get("category_id", type=int)
    search = request.args.get("search", type=str)
    in_stock = request.args.get("in_stock")

    if category_id:
        query = query.filter(Product.category_id == category_id)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    if in_stock == "true":
        query = query.filter(Product.stock_quantity > 0)
    elif in_stock == "false":
        query = query.filter(Product.stock_quantity == 0)

    query = query.filter(Product.is_active == True)
    products = query.all()
    return jsonify([p.to_dict() for p in products])


@products_bp.route("/products/<int:product_id>", methods=["GET"])
def get_product(product_id):
    from models import Product
    product = Product.query.get_or_404(product_id)
    return jsonify(product.to_dict())


@products_bp.route("/products", methods=["POST"])
def create_product():
    from models import Product
    data = request.get_json()
    product = Product(
        name=data["name"],
        category_id=data["category_id"],
        description=data.get("description"),
        price=data["price"],
        unit=data.get("unit", "piece"),
        stock_quantity=data.get("stock_quantity", 0),
        min_stock_alert=data.get("min_stock_alert", 5),
        godown_location=data.get("godown_location"),
        image_url=data.get("image_url"),
        is_active=data.get("is_active", True),
    )
    db.session.add(product)
    db.session.commit()
    return jsonify(product.to_dict()), 201


@products_bp.route("/products/<int:product_id>", methods=["PUT"])
def update_product(product_id):
    from models import Product
    product = Product.query.get_or_404(product_id)
    data = request.get_json()

    for field in ["name", "category_id", "description", "price", "unit",
                  "stock_quantity", "min_stock_alert", "godown_location", "image_url", "is_active"]:
        if field in data:
            setattr(product, field, data[field])

    db.session.commit()
    return jsonify(product.to_dict())


@products_bp.route("/products/<int:product_id>", methods=["DELETE"])
def delete_product(product_id):
    from models import Product
    product = Product.query.get_or_404(product_id)
    product.is_active = False
    db.session.commit()
    return "", 204
