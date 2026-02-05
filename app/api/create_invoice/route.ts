import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, saved_details, clients } from "@/db/schema";
import { z } from "zod";
import { auth } from "@/auth";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest, res: NextResponse) {
  const session = await auth();
  if (session?.user) {
    const body = await req.json();
    const invoiceSchema = z.object({
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
    try {
      const parsedData = invoiceSchema.parse(body);
      if (parsedData.invoice_id && parsedData.invoice_id !== "") {
        // Update existing invoice
        const invoiceUpdate = await db
          .update(invoices)
          .set({
            user_company_name: parsedData.user_company_name,
            issue_date: new Date(parsedData.issue_date),
            due_date: new Date(parsedData.due_date),
            items: JSON.stringify(parsedData.items),
            total_amount: parsedData.total_amount,
            status: parsedData.status,
            notes: parsedData.notes,
          })
          .where(eq(invoices.invoice_id, parseInt(parsedData.invoice_id, 10)))
          .returning({ client_id: invoices.client_id });

        if (!invoiceUpdate) {
          return NextResponse.json(
            {
              error: "Failed to update invoice",
            },
            { status: 500 }
          );
        }
        const client_id = invoiceUpdate[0].client_id;
        // Update client details
        const clientUpdate = await db
          .update(clients)
          .set({
            client_company_name: parsedData.client_company_name,
            client_email: parsedData.client_email,
            client_address: parsedData.client_address,
          })
          .where(eq(clients.client_id, client_id));
        if (!clientUpdate) {
          return NextResponse.json(
            {
              error: "Failed to update client",
            },
            { status: 500 }
          );
        }
        return NextResponse.json(
          {
            message: "Invoice updated successfully",
          },
          { status: 200 }
        );
      }
      // Insert client
      const client_insert = await db
        .insert(clients)
        .values({
          user_id: parseInt(session.user.id),
          client_company_name: parsedData.client_company_name,
          client_email: parsedData.client_email,
          client_address: parsedData.client_address,
        })
        .returning({ client_id: clients.client_id });
        if(!client_insert){
        return NextResponse.json(
          {
            error: "Failed to create client",
          },
          { status: 500 }
        );
        }
      const client_id = client_insert[0].client_id;
      const invoice_insert = await db.insert(invoices).values({
        user_id: parseInt(session.user.id),
        client_id: client_id,
        user_company_name: parsedData.user_company_name,
        issue_date: new Date(parsedData.issue_date),
        due_date: new Date(parsedData.due_date),
        items: JSON.stringify(parsedData.items),
        total_amount: parsedData.total_amount,
        status: parsedData.status,
        notes: parsedData.notes,
      } as any);
      if (!invoice_insert) {
        return NextResponse.json(
          {
            error: "Failed to create invoice",
          },
          { status: 500 }
        );
      }
      return NextResponse.json(
        {
          message: "Invoice created successfully",
        },
        { status: 201 }
      );
    } catch (e) {
      if (e instanceof z.ZodError) {
        return NextResponse.json(
          {
            error: e.errors,
          },
          { status: 400 }
        );
      } else {
        return NextResponse.json(
          {
            error: `Internal Server Error: ${e}`,
          },
          { status: 500 }
        );
      }
    }
  } else {
    return NextResponse.json(
      {
        error:
          "You must be signed in to view the protected content on this page.",
      },
      { status: 403 }
    );
  }
}
