import os
from datetime import timedelta
class Config:
    SECRET_KEY = "secret"
    SQLALCHEMY_DATABASE_URI = "sqlite:///invoice.db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=2)
    JWT_SECRET_KEY = "jwt-secret-key"
    UPLOAD_FOLDER = "uploads"
    JWT_HEADER_TYPE = ""