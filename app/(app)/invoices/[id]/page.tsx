import { InvoiceForm } from "@/components/invoices/invoice-form"

export default function EditInvoicePage() {
  // UI-only: in real app you'd load invoice by id
  return <InvoiceForm mode="edit" />
}
