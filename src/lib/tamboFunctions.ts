"use server";

import { db } from "@/db";
import { invoices, clients } from "@/db/schema";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";
import { Graph } from "@/components/ui/graph";

/* -------------------- TABLE TOOL -------------------- */

export async function get_all_invoices() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!userId) {
    return "Please login to view invoices.";
  }

  const result = await db
    .select()
    .from(invoices)
    .innerJoin(clients, eq(invoices.client_id, clients.client_id))
    .where(eq(invoices.user_id, userId));

  return {
    component: "Datagrid",
    props: {
      columns: ["invoice_id", "client_company_name", "total_amount", "status"],
      data: result.map(r => ({
        invoice_id: r.invoices.invoice_id,
        client_company_name: r.clients.client_company_name,
        total_amount: r.invoices.total_amount,
        status: r.invoices.status
      })),
    },
  };
}

/* -------------------- GRAPH TOOL -------------------- */

export async function get_invoice_graph() {
  const session = await auth();
  const userId = Number(session?.user?.id);

  if (!userId) {
    return "Please login to view graphs.";
  }

  const result = await db
    .select()
    .from(invoices)
    .innerJoin(clients, eq(invoices.client_id, clients.client_id))
    .where(eq(invoices.user_id, userId));

  const nodes = result.map(r => ({
        id: String(r.invoices.invoice_id),
        label: `${r.clients.client_company_name} ₹${r.invoices.total_amount}`,
      }));

      const edges = result.slice(1).map((inv, i) => ({
              from: String(result[i].invoices.invoice_id),
              to: String(inv.invoices.invoice_id),
            }));

  return {
    component: Graph,
    props: {
      nodes,
      edges,
    },
  };
}

/* -------------------- TEXT TOOL -------------------- */

export async function text_tool() {
  return "I can show your invoices as tables or graphs.";
}
