import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()


class Config:
    """Base configuration for the AFMS backend."""

    SECRET_KEY = os.environ.get('SECRET_KEY', 'change-this-secret')

    BASE_DIR = os.path.abspath(os.path.dirname(os.path.dirname(__file__)))
    INSTANCE_DIR = os.path.join(BASE_DIR, 'instance')
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        'DATABASE_URL',
        f"sqlite:///{os.path.join(INSTANCE_DIR, 'airport.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {"pool_pre_ping": True}

    SESSION_COOKIE_HTTPONLY = os.environ.get(
        'SESSION_COOKIE_HTTPONLY', 'True'
    ).lower() == 'true'
    SESSION_COOKIE_SECURE = os.environ.get(
        'SESSION_COOKIE_SECURE', 'False'
    ).lower() == 'true'
    SESSION_COOKIE_SAMESITE = os.environ.get('SESSION_COOKIE_SAMESITE', 'Lax')
    PERMANENT_SESSION_LIFETIME = timedelta(hours=8)

    CORS_ORIGIN = os.environ.get('CORS_ORIGIN', 'http://localhost:5173')

    DEFAULT_CURRENCY = 'USD'
    DEFAULT_TIMEZONE = 'Africa/Nairobi'