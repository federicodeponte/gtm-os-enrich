"use client";

import { ChatInterface } from "@/components/chat/chat-interface";

export default function ChatPage() {
  return (
    <main className="h-screen flex flex-col" style={{ backgroundColor: "#F2F2F2" }}>
      <header className="border-b px-6 py-4" style={{ 
        backgroundColor: "#FFFFFF",
        borderColor: "#C4CBF2"
      }}>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-semibold" style={{ color: "#0D0D0D" }}>
            AI Data Enrichment
          </h1>
          <p className="text-sm mt-1" style={{ color: "#626262" }}>
            Chat with AI to enrich your data
          </p>
        </div>
      </header>
      
      <div className="flex-1 overflow-hidden">
        <ChatInterface />
      </div>
    </main>
  );
}
