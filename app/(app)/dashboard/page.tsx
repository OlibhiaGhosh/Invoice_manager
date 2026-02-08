import { MessageThreadFull } from "@/src/components/tambo/message-thread-full";
import { TamboProvider } from "@tambo-ai/react";
import { invoiceTools } from "@/src/lib/tamboTools";
import { components } from "@/src/lib/tambo";

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] rounded-xl border bg-muted/30">
      <header className="p-4 border-b">
        <h1 className="text-lg font-semibold">AI Assistant</h1>
        <p className="text-sm text-muted-foreground">
          Use the chat below to analyze your invoices and data.
        </p>
      </header>
      <main className="flex-1 overflow-hidden" style={{ height: "100%" }}>
        <TamboProvider apiKey={process.env.NEXT_PUBLIC_TAMBO_API_KEY || ""} tools={invoiceTools} components={components}>
          <MessageThreadFull />
        </TamboProvider>
      </main>
    </div>
  );
}

