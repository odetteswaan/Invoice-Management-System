export const baseURL="http://localhost:5000/api"
export const loginEndpoint="/auth/login"
export const signupEndpoint="/auth/register"
export const getInvoicesEndpoint="/invoices/"
export const updateStatus=(invoiceID)=>(`/invoices/${invoiceID}/status`)
export const uploadInvoice="/invoices/upload"