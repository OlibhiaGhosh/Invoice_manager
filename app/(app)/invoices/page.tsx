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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

//const MOCK: Invoice[] =

export default function InvoicesPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState<"all" | "paid" | "unpaid" | "overdue">(
    "all"
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const getinvoices = async () => {
    setLoading(true);
    const result = await axios.get("/api/getInvoices");
    console.log("result: ", result)
    const fulldata = await result.data;
    console.log("full data: ", fulldata)
    fulldata.map((data: any) => {
      setInvoices(prev => [...prev,
        {
          id: data.invoices.invoice_id,
          number: data.invoices.invoice_id,
          client: data.clients.client_company_name,
          date: new Date(data.invoices.issue_date).toLocaleDateString(),
          due: new Date(data.invoices.due_date).toLocaleDateString(),
          amount: data.invoices.total_amount.toFixed(2),
          status: data.invoices.status as "paid" | "unpaid" | "overdue",
        }
      ]);
      console.log("invoice set", invoices)
    });
    setLoading(false);
  };
  useEffect(() => {
    getinvoices();
  }, []);
  const filtered = invoices.filter((inv) => {
    console.log("invoices: ", invoices)
    const matches = [inv.number, inv.client].some((s) =>
      String(s).toLowerCase().includes(String(q).toLowerCase())
    );
    const statusOk = filter === "all" ? true : inv.status === filter;
    return matches && statusOk;
  });

  const badge = (s: Invoice["status"]) => (
    <Badge
      variant={
        s === "paid" ? "default" : s === "overdue" ? "destructive" : "secondary"
      }
    >
      {s}
    </Badge>
  );
  if (loading) {
    return <div className="text-center"> Loading .... </div>;
  }
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-balance">Invoices</h1>
        <Button asChild>
          <Link href="/invoices/new">New Invoice</Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">All invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <Input
              placeholder="Search by client or number"
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

          <div className="mt-4 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Client</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Due</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[1%]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((inv) => (
                  <TableRow key={inv.id}>
                    <TableCell className="font-medium">{inv.number}</TableCell>
                    <TableCell>{inv.client}</TableCell>
                    <TableCell>{inv.date}</TableCell>
                    <TableCell>{inv.due}</TableCell>
                    <TableCell className="text-right">{inv.amount}</TableCell>
                    <TableCell>{badge(inv.status)}</TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="secondary">
                          <Link href={`/invoices/${inv.id}`}>Edit</Link>
                        </Button>
                        <Button asChild size="sm" variant="ghost">
                          <Link href={`/invoices/${inv.id}/preview`}>
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
