from flask import Blueprint, jsonify

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("/categories", methods=["GET"])
def list_categories():
    from models import Category
    categories = Category.query.all()
    return jsonify([c.to_dict() for c in categories])
