from .extensions import db
from werkzeug.security import generate_password_hash, check_password_hash

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(50), unique=True)
    password = db.Column(db.String(200))
    role = db.Column(db.String(20))

    def set_password(self, password):
        self.password = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password, password)


class Invoice(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    invoice_id=db.Column(db.String(50), unique=True)
    name = db.Column(db.String(100))
    description = db.Column(db.String(200))
    amount = db.Column(db.Float)
    GST = db.Column(db.Float)
    status = db.Column(db.String(20), default="Pending")
    file_url = db.Column(db.String(200))
    created_by = db.Column(db.String(50))