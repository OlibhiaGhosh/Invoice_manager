import { MessageThreadFull } from "@/src/components/tambo/message-thread-full";
import { TamboProvider } from "@tambo-ai/react";
import { invoiceTools } from "@/src/lib/tamboTools";
import { components } from "@/src/lib/tambo";

export default function DashboardPage() {
  return (
    <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""} tools={invoiceTools} components={components}>
      <MessageThreadFull />
    </TamboProvider>
  );
}

