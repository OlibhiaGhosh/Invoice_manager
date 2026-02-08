import { MessageThreadFull } from "@/src/components/tambo/message-thread-full";
import { TamboProvider } from "@tambo-ai/react";
import { invoiceTools } from "@/src/lib/tamboTools";
import { InvoiceTrends } from "@/components/Graphcomp";

export default function App() {
  return (
    <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""} tools={invoiceTools}  >
      <MessageThreadFull />
    </TamboProvider>
  );
}
