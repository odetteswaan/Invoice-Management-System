from langchain_community.vectorstores import Chroma
from langchain_core.documents import Document
from .embeddings import embedding

PERSIST_DIR = "./chroma_db"


def get_vector_db():
    return Chroma(
        persist_directory=PERSIST_DIR,
        embedding_function=embedding
    )


def build_vector_db(invoices):
    docs = []

    for inv in invoices:
        docs.append(Document(
            page_content=f"""
            Invoice ID: {inv.invoice_id}
            Name: {inv.name}
            Description: {inv.description}
            Amount: {inv.amount}
            GST: {inv.GST}
            Status: {inv.status}
            """,
            metadata={"invoice_id": inv.invoice_id}
        ))

    db = Chroma.from_documents(
        docs,
        embedding,
        persist_directory=PERSIST_DIR
    )
    db.persist()


# 🔥 ADD NEW INVOICE
def add_invoice_to_vector_db(invoice):
    db = get_vector_db()

    doc = Document(
        page_content=f"""
        Invoice ID: {invoice.invoice_id}
        Name: {invoice.name}
        Description: {invoice.description}
        Amount: {invoice.amount}
        GST: {invoice.GST}
        Status: {invoice.status}
        """,
        metadata={"invoice_id": invoice.invoice_id}
    )

    db.add_documents([doc])
    db.persist()


# 🔥 DELETE INVOICE
def delete_invoice_from_vector_db(invoice_id):
    db = get_vector_db()
    db.delete(where={"invoice_id": invoice_id})