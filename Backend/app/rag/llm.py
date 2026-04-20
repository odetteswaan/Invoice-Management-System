from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()
llm = ChatGroq(
    model="openai/gpt-oss-120b",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_sql(username, user_query):
    prompt = f""" 
    You are an expert SQL query generator.

Your task is to convert a natural language query into a valid SQL query.

Rules:
1. Output ONLY the SQL query. No explanation, no comments.
2. The query must be directly executable.
3. Always use table name: Invoice
4. Always include user filter:
   created_by = '<username>'
5. Use only columns from schema. Do not invent columns.
6. Use single quotes for string values.
7. Do not use SELECT * unless user explicitly asks for all fields.
8. If query mentions invoice ID, filter using invoice_id.
9. Only generate SELECT queries. No INSERT, UPDATE, DELETE, ALTER, DROP.
10. Do not add LIMIT unless explicitly asked.
11. Status values must ALWAYS be same case as : 'Pending', 'approved', 'rejected'
12. Convert user-provided status values to uppercase before comparison.
13. Return only required columns based on user query.
14. If query is ambiguous, return:
   SELECT 1 WHERE 1=0;
15. Generate only a single SQL statement. No multiple queries.

Schema:
- id (integer)
- invoice_id (string)
- name (string)
- description (string)
- amount (float)
- GST (float)
- status (string)
- file_url (string)
- created_by (string)

Context:
username = {username}

User Query:
{user_query}
    """

    return llm.invoke(prompt).content


import json


def generate_answer(query, docs):
    # Normalize docs into string context
    if not docs:
        context = "No data available."

    elif isinstance(docs, list):
        # list of dicts or strings
        if all(isinstance(item, dict) for item in docs):
            context = json.dumps(docs, indent=2)
        else:
            context = "\n".join(map(str, docs))

    elif isinstance(docs, dict):
        context = json.dumps(docs, indent=2)

    else:
        context = str(docs)

    prompt=f"""
you are an Invoice chatbot agent 
you will receive sql query output 
your task is to respond to the user by looking at the data 
what ever the data is present simply send it in textual form
if there Data is Empty :[] then respond data is not found
Data:
{context}

user_query:{query}
"""
    print(prompt)

    response = llm.invoke(prompt).content
    return response