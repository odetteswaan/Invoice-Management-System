from flask import Blueprint, request, jsonify
from ..models import Invoice
from ..extensions import db
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
from flask import send_from_directory, current_app
invoice_bp = Blueprint("invoice", __name__)

@invoice_bp.route("/upload", methods=["POST"])
@jwt_required()
def upload_invoice():
    user = get_jwt_identity()
    invoice_id = request.form.get("invoice_id")
    name = request.form.get("name")
    description = request.form.get("description")
    amount = request.form.get("amount")
    GST = request.form.get("GST")
    file = request.files.get("file")

    if not file:
        return jsonify({"msg": "File is required"}), 400

    # Save file
    path = os.path.join("uploads", file.filename)
    file.save(path)

    # Create invoice
    invoice = Invoice(
        invoice_id=invoice_id,
        name=name,
        description=description,
        GST=GST,
        amount=float(amount),
        file_url=file.filename,
        status="Pending",
        created_by=user
    )
    db.session.add(invoice)
    db.session.commit()
    return jsonify({
        "msg": "Invoice uploaded successfully",
        "file_url": path
    })


# GET ALL + FILTER + PAGINATION
@invoice_bp.route("/", methods=["GET"])
@jwt_required()
def get_invoices():
    status = request.args.get("status")
    name = request.args.get("name")
    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 5))

    query = Invoice.query

    # Filter by status
    if status:
        query = query.filter_by(status=status)

    # Filter by name
    if name:
        query = query.filter(Invoice.name.contains(name))

    # Pagination
    pagination = query.paginate(page=page, per_page=limit)
    base_url = request.host_url

    result = [{
        "id": i.id,
        "invoice_id": i.invoice_id,
        "name": i.name,
        "description": i.description,
        "amount": i.amount,
        "GST": i.GST,
        "status": i.status,
        "file_url": f"{base_url}api/invoices/file/{i.file_url}",
        "created_by": i.created_by
    } for i in pagination.items]

    return jsonify({
        "data": result,
        "total": pagination.total,
        "page": page,
        "limit": limit
    })


# UPDATE STATUS (REVIEWER)
@invoice_bp.route("/<string:invoice_id>/status", methods=["PUT"])
@jwt_required()
def update_status(invoice_id):
    data = request.json

    invoice = Invoice.query.filter_by(invoice_id=invoice_id).first()

    if not invoice:
        return jsonify({"msg": "Invoice not found"}), 404

    invoice.status = data.get("status")
    if invoice.status.capitalize() not in ["Pending","Approved","Rejected"]:
        return jsonify({"msg":"status must be Pending or Approved or Rejected"}), 400
    db.session.commit()

    return jsonify({"msg": "Status updated"})



@invoice_bp.route("/<string:invoice_id>", methods=["GET"])
@jwt_required()
def get_invoice(invoice_id):
    invoice = Invoice.query.filter_by(invoice_id=invoice_id).first()

    if not invoice:
        return jsonify({"msg": "Invoice not found"}), 404

    return jsonify({
        "invoice_id": invoice.invoice_id,
        "status": invoice.status,
        "name": invoice.name,
        "description": invoice.description,
        "GST": invoice.GST,
        "amount": invoice.amount,
        "created_by": invoice.created_by
    })

@invoice_bp.route("/my-invoices", methods=["GET"])
@jwt_required()
def get_my_invoices():
    user = get_jwt_identity()

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 5))

    query = Invoice.query.filter_by(created_by=user)

    pagination = query.paginate(page=page, per_page=limit)

    base_url = request.host_url

    result = [{
        "invoice_id": i.invoice_id,
        "name": i.name,
        "description": i.description,
        "amount": i.amount,
        "GST": i.GST,
        "status": i.status,
        "created_by": i.created_by,

        # 🔥 ADD THIS
        "file_url": f"{base_url}api/invoices/file/{i.file_url}"
    } for i in pagination.items]

    return jsonify({
        "data": result,
        "total": pagination.total,
        "page": page,
        "limit": limit
    })

@invoice_bp.route("/file/<filename>", methods=["GET"])
def get_file(filename):
    import os

    BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../"))
    upload_folder = os.path.join(BASE_DIR, "uploads")

    return send_from_directory(upload_folder, filename)