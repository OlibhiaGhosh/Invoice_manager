"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { z } from "zod";
import axios from "axios";
import { useSession } from "next-auth/react";
import type { Session } from "next-auth";
import { useParams, useRouter } from "next/navigation";

type Props = { mode?: "new" | "edit" };
type Item = { id: string; description: string; qty: number; price: number };
const InvoiceDetails = z.object({
  invoice_id: z.string().optional(),
  user_company_name: z.string().min(1),
  client_company_name: z.string().min(1),
  client_email: z.string().email(),
  client_address: z.string().optional(),
  issue_date: z.string().min(1),
  due_date: z.string().min(1),
  items: z.array(
    z.object({
      id: z.string().min(1),
      description: z.string().min(1),
      qty: z.number().min(1),
      price: z.number().min(0),
    })
  ),
  total_amount: z.number().min(0),
  status: z.enum(["paid", "unpaid"]),
  notes: z.string().optional(),
});
type InvoiceDetails = z.infer<typeof InvoiceDetails>;
export function  InvoiceForm({ mode }: Props) {
  const { data: session } = useSession() as { data: Session | null };
  const router = useRouter();
  const params = useParams();

  const [invoiceDetails, setinvoiceDetails] = useState<InvoiceDetails>({
  invoice_id: "",
  user_company_name: "",
  client_company_name: "",
  client_email: "",
  client_address: "",
  issue_date: "",
  due_date: "",
  items: [],
  total_amount: 0,
  status: "unpaid",
  notes: "",
})
  const [items, setItems] = useState<Item[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const addItem = () =>
    setItems((prev) => [
      ...prev,
      { id: crypto.randomUUID(), description: "", qty: 1, price: 0 },
    ]);

  const rmItem = (id: string) =>
    setItems((prev) => prev.filter((i) => i.id !== id));

    useEffect(() => {
    const fetchInvoiceDetails = async () => {
      if (session?.user) {
        if (mode == "edit") {
          const invoice_id = params?.id;
          try {
            setLoading(true);
            const response = await axios.get(
              `/api/invoice-details/${invoice_id}`
            );
            const data = response.data;
            const parsedItems = JSON.parse(data.invoices.items);
            setinvoiceDetails({
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
          } catch (error) {
            console.error("Failed to load invoice details:", error);
          } finally {
            setLoading(false);
          }
        }
      } else {
        router.push("/signin");
      }
    };
    fetchInvoiceDetails();
  }, [session, mode, params?.id, router]); 

  const subtotal = (items ?? []).reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.0;
  const total = subtotal + tax;


  const handleChange = (e: any) => {
    setinvoiceDetails({ ...invoiceDetails, [e.target.id]: e.target.value });
    // if (e.target.id === "due_date") {
    //   setinvoiceDetails({
    //     ...invoiceDetails,
    //     [e.target.id]: new Date(e.target.value),
    //   });
    // }
  };
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const payload = {
      ...invoiceDetails,
      items: items,
      issue_date: new Date(),
      total_amount: total,
    };
    if (mode === "edit") {
      payload.invoice_id = Array.isArray(params?.id) ? params.id[0] : params?.id;
    }
    try {
      setSubmitting(true);
      const response = await axios.post("/api/create_invoice", payload);
      console.log(response.data);
    } catch (error) {
      console.error("There was an error creating the invoice:", error);
      setError("There was an error creating the invoice. Please try again.");
    } finally {
      setSubmitting(false);
      router.push("/invoices");
    }
  };
  if (loading) {
    return <div className="text-center"> Loading .... </div>;
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {mode === "edit" ? "Edit invoice" : "New invoice"}
        </h1>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link href="/invoices">Cancel</Link>
          </Button>
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="user_company_name">Your business</Label>
              <Input
                id="user_company_name"
                placeholder="Your name or company"
                value={invoiceDetails.user_company_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_company_name">Bill to</Label>
              <Input
                id="client_company_name"
                placeholder="Client company"
                value={invoiceDetails.client_company_name}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_email">Client email</Label>
              <Input
                id="client_email"
                type="email"
                placeholder="client@example.com"
                value={invoiceDetails.client_email}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="client_address">Client Address</Label>
              <Input
                id="client_address"
                placeholder="Client Address"
                value={invoiceDetails.client_address}
                onChange={handleChange}
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={invoiceDetails.status}
                onValueChange={(value) =>
                  setinvoiceDetails({
                    ...invoiceDetails,
                    status: value as "paid" | "unpaid",
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due_date">Due date</Label>
              <Input
                id="due_date"
                type="date"
                value={invoiceDetails.due_date}
                onChange={handleChange}
              />
            </div>
          </div>

          <Separator />

          <div className="grid gap-2">
            <Label>Line items</Label>
            <div className="grid gap-2">
              {items.map((it, idx) => (
                <div
                  key={it.id}
                  className="grid gap-2 grid-cols-1 md:grid-cols-[600px_100px_120px_80px]"
                >
                  <div>
                    <Label
                      className="m-2"
                      htmlFor={`item-description-${it.id}`}
                    >
                      Item description
                    </Label>
                    <Input
                      id={`item-description-${it.id}`}
                      placeholder={`Item ${idx + 1} description`}
                      value={it.description}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((p) =>
                            p.id === it.id
                              ? { ...p, description: e.target.value }
                              : p
                          )
                        )
                      }
                    />
                  </div>
                  <div>
                    <Label className="m-2" htmlFor={`item-quantity-${it.id}`}>
                      Quantity
                    </Label>
                    <Input
                      id={`item-quantity-${it.id}`}
                      type="number"
                      min={1}
                      value={it.qty}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((p) =>
                            p.id === it.id ? { ...p, qty: +e.target.value } : p
                          )
                        )
                      }
                      placeholder="Qty"
                    />
                  </div>
                  <div>
                    <Label className="m-2" htmlFor={`item-price-${it.id}`}>
                      Price
                    </Label>
                    <Input
                      id={`item-price-${it.id}`}
                      type="number"
                      min={0}
                      value={it.price}
                      onChange={(e) =>
                        setItems((prev) =>
                          prev.map((p) =>
                            p.id === it.id
                              ? { ...p, price: +e.target.value }
                              : p
                          )
                        )
                      }
                      placeholder="Price"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-sm text-muted-foreground grow">
                      ${(it.qty * it.price).toFixed(2)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => rmItem(it.id)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <Button variant="secondary" onClick={addItem}>
                Add item
              </Button>
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Payment terms or extra details"
              value={invoiceDetails.notes}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-end gap-2">
          <div className="text-sm text-muted-foreground">
            Subtotal: ${subtotal.toFixed(2)}
          </div>
          <div className="text-sm text-muted-foreground">
            Tax: ${tax.toFixed(2)}
          </div>
          <div className="text-lg font-semibold">
            Total: ${total.toFixed(2)}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
