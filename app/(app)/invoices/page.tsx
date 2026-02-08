"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import axios from "axios";

type Invoice = {
  id: string;
  number: string;
  client: string;
  date: string;
  due: string;
  amount: string;
  status: "paid" | "unpaid" | "overdue";
};

export default function InvoicesPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "overdue">(
    "all"
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInvoices = async () => {
      setLoading(true);
      try {
        const result = await axios.get("/api/getInvoices");
        const fulldata = result.data;
        const formattedInvoices = fulldata.map((data: any) => ({
          id: data.invoices.invoice_id,
          number: data.invoices.invoice_id,
          client: data.clients.client_company_name,
          date: new Date(data.invoices.issue_date).toLocaleDateString(),
          due: new Date(data.invoices.due_date).toLocaleDateString(),
          amount: new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(data.invoices.total_amount),
          status: data.invoices.status as "paid" | "unpaid" | "overdue",
        }));
        setInvoices(formattedInvoices);
      } catch (error) {
        console.error("Failed to fetch invoices:", error);
        // Optionally, handle the error in the UI
      } finally {
        setLoading(false);
      }
    };
    getInvoices();
  }, []);

  const filtered = invoices.filter((inv) => {
    const matches = [inv.number, inv.client].some((s) =>
      String(s).toLowerCase().includes(String(q).toLowerCase())
    );
    const statusOk = filter === "all" ? true : inv.status === filter;
    return matches && statusOk;
  });

  const StatusBadge = ({ status }: { status: Invoice["status"] }) => (
    <Badge
      variant={
        status === "paid"
          ? "default"
          : status === "overdue"
          ? "destructive"
          : "secondary"
      }
      className="capitalize"
    >
      {status}
    </Badge>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Invoices</h1>
          <p className="text-muted-foreground">
            View and manage all your invoices.
          </p>
        </div>
        <Button asChild>
          <Link href="/invoices/new">Create Invoice</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by client or number..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              className="max-w-xs"
            />
            <Tabs value={filter} onValueChange={(v) => setFilter(v as any)}>
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="paid">Paid</TabsTrigger>
                <TabsTrigger value="unpaid">Unpaid</TabsTrigger>
                <TabsTrigger value="overdue">Overdue</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="w-[1%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No invoices found.
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.number}</TableCell>
                      <TableCell>{inv.client}</TableCell>
                      <TableCell>{inv.date}</TableCell>
                      <TableCell>{inv.due}</TableCell>
                      <TableCell>
                        <StatusBadge status={inv.status} />
                      </TableCell>
                      <TableCell className="text-right">{inv.amount}</TableCell>
                      <TableCell>
                        <div className="flex justify-end">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/invoices/${inv.id}`}>View</Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
