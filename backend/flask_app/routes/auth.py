from flask import Blueprint, jsonify, request, session
from werkzeug.security import check_password_hash

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/login", methods=["POST"])
def login():
    from models import AdminUser
    data = request.get_json()
    username = data.get("username", "")
    password = data.get("password", "")

    user = AdminUser.query.filter_by(username=username).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    session["admin_id"] = user.id
    return jsonify({"success": True, "user": user.to_dict()})


@auth_bp.route("/logout", methods=["POST"])
def logout():
    session.pop("admin_id", None)
    return jsonify({"success": True})


@auth_bp.route("/me", methods=["GET"])
def me():
    from models import AdminUser
    admin_id = session.get("admin_id")
    if not admin_id:
        return jsonify({"error": "Not authenticated"}), 401

    user = AdminUser.query.get(admin_id)
    if not user:
        return jsonify({"error": "Not authenticated"}), 401

    return jsonify(user.to_dict())
