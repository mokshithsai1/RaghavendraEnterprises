@auth_bp.route("/login", methods=["POST"])
def login():
    from models import AdminUser

    data = request.get_json()

    # ADD THESE TWO LINES
    print("LOGIN DATA:", data)

    username = data.get("username", "")
    password = data.get("password", "")

    user = AdminUser.query.filter_by(username=username).first()

    # ADD THIS LINE
    print("USER FOUND:", user)

    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid credentials"}), 401

    session["admin_id"] = user.id
    return jsonify({"success": True, "user": user.to_dict()})