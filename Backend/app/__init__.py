from flask import Flask
from .config import Config
from .extensions import db,jwt
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config['UPLOAD_FOLDER'] = 'uploads'

    db.init_app(app)
    jwt.init_app(app)
    CORS(app)

    from .routes.auth import auth_bp
    from .routes.invoice import invoice_bp
    from .routes.chat import chat_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(invoice_bp, url_prefix="/api/invoices")
    app.register_blueprint(chat_bp, url_prefix="/api/chat")

    return app