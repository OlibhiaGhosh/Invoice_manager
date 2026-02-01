import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { invoices, clients } from "@/db/schema";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  const user_id = session?.user?.id;
  try{
    const userId = Number(user_id);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const result = await db.select().from(invoices).innerJoin(clients, eq(invoices.client_id, clients.client_id)).where(eq(invoices.user_id, userId));
    if (!result) {
      return NextResponse.json({ error: "No invoices found" }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch invoices" }, { status: 500 });
  }
}