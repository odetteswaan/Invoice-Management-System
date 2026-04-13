from ..models import Invoice

def process_query(query):
    query = query.lower()

    if "pending" in query:
        data = Invoice.query.filter_by(status="PENDING").count()
        return {"response": f"{data} pending invoices"}

    if "approved" in query:
        data = Invoice.query.filter_by(status="APPROVED").count()
        return {"response": f"{data} approved invoices"}

    if "rejected" in query:
        data = Invoice.query.filter_by(status="REJECTED").count()
        return {"response": f"{data} rejected invoices"}

    return {"response": "Sorry, I didn't understand"}