from flask import Blueprint, request, jsonify
from ..rag.llm import generate_sql,generate_answer
from flask_jwt_extended import get_jwt_identity, jwt_required
from ..extensions import db
from sqlalchemy import text
import re

chat_bp = Blueprint("chat", __name__)
chat_memory = {}


def extract_sql(response_str):
    pattern = r"```sql\s*(.*?)\s*```"
    match = re.search(pattern, response_str, re.DOTALL)
    if match:
        return match.group(1).strip()
    return response_str.strip()  # fallback if no ```sql block


def is_safe_query(query):
    query = query.strip().lower()
    return query.startswith("select")  # allow only SELECT


@chat_bp.route("/", methods=["POST"])
@jwt_required()
def chat():
    user_query = request.json.get("query")

    user = get_jwt_identity()
    final_result="no result"
    if user not in chat_memory:
        chat_memory[user] = []

    history = chat_memory[user]

    # build context
    full_query = "\n".join(history) + f"\nUser: {user_query}"

    try:
        llm_response = generate_sql(user, full_query)

        sql_query = extract_sql(llm_response)
        print(sql_query)

        if not is_safe_query(sql_query):
            return jsonify({"error": "Unsafe query detected"}), 400

        result = db.session.execute(text(sql_query))

        # handle scalar vs rows
        if result.returns_rows:
            data = [dict(row._mapping) for row in result.fetchall()]
            print(data)
            final_result=generate_answer(full_query, data)
        else:
             print({"message": "Query executed successfully"})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

    # update memory
    history.append(f"User: {user_query}")
    history.append(f"SQL: {sql_query}")

    chat_memory[user] = history[-6:]  # limit memory

    return jsonify({"response": final_result})


@chat_bp.route("/test", methods=["GET"])
def test():
    try:
        result = db.session.execute(text("SELECT * FROM Invoice"))
        data = [dict(row._mapping) for row in result.fetchall()]
        return jsonify({"msg": data})
    except Exception as e:
        return jsonify({"msg": str(e)}), 500