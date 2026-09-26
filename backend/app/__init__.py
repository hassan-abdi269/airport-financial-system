import os
from flask import Flask, jsonify

from app.config import Config
from app.extensions import db, migrate, cors


def create_app(config_class=Config):
    """Flask application factory for the Airport Financial Management System (AFMS)."""
    app = Flask(__name__, instance_relative_config=True)

    # 1. Load configuration
    app.config.from_object(config_class)

    # Ensure instance folder exists (for SQLite DB)
    os.makedirs(app.instance_path, exist_ok=True)

    # 2. Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    cors.init_app(
        app,
        resources={r"/api/*": {"origins": app.config['CORS_ORIGIN']}},
        supports_credentials=True,
    )

    # 3. Register blueprints (added in later steps)

    # 4. Register error handlers (added in later steps)

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({
            "success": True,
            "data": {"service": "AFMS Backend", "status": "ok"}
        }), 200

    return app