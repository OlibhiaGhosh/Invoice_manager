import { detectIntent } from "./functions";
export async function POST(req: Request) {
  const { message, userId } = await req.json();

  // 1️⃣ Ask AI: what does the user want?
  const intent = await detectIntent(message);

  // 2️⃣ Call backend based on intent
  let result;

//   if (intent.type === "CREATE_INVOICE") {
//     result = await createInvoice(intent.data, userId);
//   }

//   if (intent.type === "ADD_ITEM") {
//     result = await addInvoiceItem(intent.invoiceId, intent.item);
//   }
if (intent.type === "GET_INVOICE_STATUS") {

}

  // 3️⃣ Return data to frontend / Tambo
  return Response.json({
    intent: intent.type,
    data: result,
  });
}
