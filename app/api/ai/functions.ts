import { OpenAI } from "openai";
import { db } from "@/db";
import { clients, invoices } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
export async function detectIntent(message: string) {
  const SYSTEM_PROMPT = `You are an AI assistant that helps users manage their invoices. 
    You can understand user requests and determine their intent related to invoice management.
    Possible intents include:
    1. CREATE_INVOICE: When the user wants to create a new invoice.
    2. ADD_ITEM: When the user wants to add an item to an existing invoice.
    3. GET_INVOICE_STATUS: When the user wants to know the status of an invoice or invoices.
    4. LIST_INVOICES: When the user wants to see a list of their invoices based on any provided parameter and if no parameter then provide all the invoice details of the user.
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
      "labels": ["Invoice 1", "Invoice 2"],
      "data": {
        "status": "paid",// optional filter
        "dueDate": "2023-12-31" // optional filter
        "issueDate": "2023-01-01" // optional filter
        "client_company_name": "Acme Corp" // optional filter
        "total_amount": 5000 // optional filter
        "client_email": "acme@gmail.com" // optional filter
        "client_id": 12 // optional filter
        "client_address": "123 Main St" // optional filter
        "user_company_name": "My Company" // optional filter
      }
      ui: [Graph] // suggest a UI component for displaying the results from this set - [Graph, Table, List, Text]
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

export const ListInvoices = async(mydata:any) => {
    const session = await auth();
    const user_id = session?.user?.id;
    try {
        const userId = Number(user_id); 
        if (!userId) {
            return { error: "Unauthorized" };
        }
        let query = db.select().from(invoices).leftJoin(clients, eq(clients.client_id, invoices.client_id)).where(eq(invoices.user_id, userId));
        let filteredResults:any = [];
        if(mydata.length === 0){
            return await query;
        }
        for (const key in mydata) {
            if (mydata[key]) {
                (await query).map((row: any) => {
                    if (row.invoices[key] === mydata[key] || row.clients[key] === mydata[key]) {
                        filteredResults.push(row);
                    }
                });
            }
        }
        if (filteredResults.length === 0) {
            return { error: "No invoices found matching the criteria" };
        }
        return filteredResults;
    } catch (error) {
        console.error(error);
        return { error: "Failed to fetch invoices" };
    }
}