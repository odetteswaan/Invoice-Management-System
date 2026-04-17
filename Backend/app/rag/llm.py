from langchain_groq import ChatGroq
import os
from dotenv import load_dotenv
load_dotenv()
llm = ChatGroq(
    model="meta-llama/llama-4-scout-17b-16e-instruct",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY")
)

def generate_answer(query, docs):
    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
    You are an invoice assistant.
    Answer only using given data.
    {context}

    Question: {query}
    """

    return llm.invoke(prompt)