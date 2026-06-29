import os
from pathlib import Path
from flask import Flask, redirect
from flask_cors import CORS
from extensions import db
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().parent.parent / ".env")


def create_app():
    app = Flask(__name__)

    database_url = os.environ.get("DATABASE_URL", "sqlite:///raghavendra.db")
    if database_url.startswith("postgres://"):
        database_url = database_url.replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_DATABASE_URI"] = database_url
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.environ.get("SESSION_SECRET", "dev-secret-key")

    app.config["SESSION_COOKIE_SAMESITE"] = "None"
    app.config["SESSION_COOKIE_SECURE"] = True

    CORS(
    app,
    supports_credentials=True,
    origins=["https://raghavendraenterprises.vercel.app"]
    )

    db.init_app(app)

    from routes.health import health_bp
    from routes.auth import auth_bp
    from routes.categories import categories_bp
    from routes.products import products_bp
    from routes.orders import orders_bp
    from routes.inventory import inventory_bp
    from routes.dashboard import dashboard_bp

    app.register_blueprint(health_bp, url_prefix="/api")
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(categories_bp, url_prefix="/api")
    app.register_blueprint(products_bp, url_prefix="/api")
    app.register_blueprint(orders_bp, url_prefix="/api")
    app.register_blueprint(inventory_bp, url_prefix="/api")
    app.register_blueprint(dashboard_bp, url_prefix="/api")

    @app.route("/")
    def index():
        return {
            "message": "Raghavendra Enterprises Backend is Running",
            "frontend": "https://raghavendraenterprises.vercel.app",
            "status": "success"
        }, 200

    with app.app_context():
        import models  # noqa: F401 — must import before create_all so SQLAlchemy registers all tables
        db.create_all()
        from seed import seed_data, update_admin_credentials
        seed_data()
        update_admin_credentials()

    return app


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    app = create_app()
    app.run(host="0.0.0.0", port=port, debug=False)
