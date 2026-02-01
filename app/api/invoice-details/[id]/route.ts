import { db } from "@/db";
import { NextRequest, NextResponse } from "next/server";
import { clients, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET(req: NextRequest, context: { params: { id: string } }) {
    const { params } = context;
    const invoice_id = Number(params.id);
    const session = await getServerSession(authOptions);
    const user_id = session?.user?.id;

    try {
        const userId = Number(user_id);
        if (!userId || !Number.isFinite(invoice_id)) {
            return NextResponse.json({ error: "Unauthorized or invalid invoice id" }, { status: 401 });
        }

        const result = await db
            .select()
            .from(invoices)
            .leftJoin(clients, eq(clients.client_id, invoices.client_id))
            .where(eq(invoices.invoice_id, invoice_id));

        if (!result || result.length === 0) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // return combined invoice + client details
        return NextResponse.json(result[0], { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch invoice details" }, { status: 500 });
    }
}