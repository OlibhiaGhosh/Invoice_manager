import { Graph } from "@/components/ui/graph";
import { detectIntent, ListInvoices } from "./functions";
export async function POST(req: Request) {
  const { message, userId } = await req.json();

  const intent = await detectIntent(message);

  let result;

//   if (intent.type === "CREATE_INVOICE") {
//     result = await createInvoice(intent.data, userId);
//   }

//   if (intent.type === "ADD_ITEM") {
//     result = await addInvoiceItem(intent.invoiceId, intent.item);
//   }
if (intent.type === "LIST_INVOICES") {
  result = await ListInvoices(intent.data); // result type: [{invoices:{}, clients:{}}, {}]
}

  // 3️⃣ Return data to frontend / Tambo
  return Response.json({
    intent: intent.type,
    data: result,
    ui: [Graph]
  });
}
