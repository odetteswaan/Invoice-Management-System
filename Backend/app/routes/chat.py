from flask import Blueprint, request, jsonify
from ..services.chatbot_service import process_query

chat_bp = Blueprint("chat", __name__)

@chat_bp.route("/", methods=["POST"])
def chat():
    message = request.json["message"]
    return jsonify(process_query(message))