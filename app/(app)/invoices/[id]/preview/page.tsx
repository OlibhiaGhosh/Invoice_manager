"use client";
import { InvoicePreview } from "@/components/invoices/invoice-preview"
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
const invoice = {
  id: "INV-00126",
  date: "2025-08-26",
  clientName: "Acme Co.",
  clientEmail: "contact@acme.com",
  companyLogo: "",
  items: [
    { name: "Design work", quantity: 5, amount: 400.0 },
    { name: "Landing page implementation", quantity: 6, amount: 600.0 },
  ],
  totalAmount: 1000.0034,
  notes: "Payment by bank transfer within 15 days. Thank you!",
};

export default function InvoicePreviewPage() {
  const [invoiceDetails, setinvoiceDetails] = useState({});
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const params = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try{
        setLoading(true);
        const invoice_id = params?.id as string;
        const response = await axios.get(`/api/invoice-details/${invoice_id}`);
        if (response.status !== 200) {
          throw new Error("Failed to fetch invoice details");
        }
        const data = response.data;
            const parsedItems = JSON.parse(data.invoices.items);
            setinvoiceDetails({
              invoice_id: data.invoices.invoice_id,
              user_company_name: data.invoices.user_company_name,
              client_company_name: data.clients.client_company_name,
              client_email: data.clients.client_email,
              client_address: data.clients.client_address,
              issue_date: data.invoices.issue_date.split("T")[0],
              due_date: data.invoices.due_date.split("T")[0],
              items: parsedItems,
              total_amount: data.invoices.total_amount,
              status: data.invoices.status,
              notes: data.invoices.notes,
            });
            setItems(parsedItems);
      }catch(error){
        console.error("Failed to fetch invoice details: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])
  return (
    <div className="p-4">
      {loading ? (
        <div className="text-center">Loading invoice details...</div>
      ) : (
        <InvoicePreview invoice={invoiceDetails} />
      )}
    </div>
  );
}