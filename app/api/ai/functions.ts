import { OpenAI } from "openai";
export async function detectIntent(message: string) {
  const SYSTEM_PROMPT = `You are an AI assistant that helps users manage their invoices. 
    You can understand user requests and determine their intent related to invoice management.
    Possible intents include:
    1. CREATE_INVOICE: When the user wants to create a new invoice.
    2. ADD_ITEM: When the user wants to add an item to an existing invoice.
    3. GET_INVOICE_STATUS: When the user wants to know the status of an invoice.
    4. LIST_INVOICES: When the user wants to see a list of their invoices.
    5. GET_ALL_INVOICE_DETAILS: When the user wants details about all invoices.
    For each intent, extract relevant data from the user's message.
    Respond in JSON format with the following structure:
    {
      "type": "INTENT_TYPE",
      "data": { ... } // relevant data based on intent
    }
    If the intent is not clear, respond with:
    {
      "type": "UNKNOWN",
      "data": {}
    }
    For example: For LIST_INVOICES, respond with:
    {
      "type": "LIST_INVOICES",
      "data": {
        "filter": "paid" // or "unpaid", "overdue", or "all"
        "invoiceId": "optional-invoice-id-if-specific"
      }
    } 
    `;


  const client = new OpenAI({
    baseURL: "https://api.tokenfactory.nebius.com/v1/",
    apiKey: process.env.NEBIUS_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: "MODEL_ID",
    messages: [
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: message,
      },
    ],
  });
  console.log(response);
  try {
    const intent = response.choices[0].message.content;
    if (!intent) throw new Error("No intent detected");
    return JSON.parse(intent);
  } catch (error) {
    return {
      type: "UNKNOWN",
      data: {},
    };
  }
}
