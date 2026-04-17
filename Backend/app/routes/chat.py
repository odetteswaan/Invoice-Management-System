from flask import Blueprint, request, jsonify
from ..rag.vector_store import get_vector_db
from ..rag.llm import generate_answer
from ..models import Invoice

chat_bp = Blueprint("chat", __name__)

# 🔥 INITIAL TRAIN (RUN ONCE)
@chat_bp.route("/train", methods=["GET"])
def train():
    invoices = Invoice.query.all()

    from ..rag.vector_store import build_vector_db
    build_vector_db(invoices)

    return jsonify({"msg": "trained"})


# 🤖 CHAT
@chat_bp.route("/", methods=["POST"])
def chat():
    query = request.json.get("query")

    db = get_vector_db()
    docs = db.similarity_search(query, k=10)

    answer = generate_answer(query, docs).content

    return jsonify({"response": answer})