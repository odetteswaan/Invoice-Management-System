from langchain_community.llms import Ollama

llm = Ollama(model="llama3")

def generate_answer(query, docs):
    context = "\n".join([doc.page_content for doc in docs])

    prompt = f"""
    You are an invoice assistant.
    Answer only using given data.

    {context}

    Question: {query}
    """

    return llm.invoke(prompt)