"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "./chat-message";
import { ChatInput } from "./chat-input";
import { FileUploadMessage } from "./file-upload-message";
import { EnrichmentPlanMessage } from "./enrichment-plan-message";
import { SampleResultsMessage } from "./sample-results-message";
import { ProgressMessage } from "./progress-message";
import type { CSVData } from "../enrichment-workflow";

export type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  type?: "text" | "file-upload" | "plan" | "sample" | "progress" | "complete";
  data?: any;
  timestamp: Date;
};

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Hi! I'm your AI data enrichment assistant. Upload a CSV file to get started, or describe what you'd like to enrich.",
      type: "text",
      timestamp: new Date(),
    },
  ]);
  const [csvData, setCSVData] = useState<CSVData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (message: Omit<Message, "id" | "timestamp">) => {
    setMessages((prev) => [
      ...prev,
      {
        ...message,
        id: Date.now().toString(),
        timestamp: new Date(),
      },
    ]);
  };

  const handleFileUpload = (data: CSVData) => {
    setCSVData(data);
    
    // User message
    addMessage({
      role: "user",
      content: `Uploaded ${data.fileName}`,
      type: "file-upload",
      data,
    });

    // AI response
    setTimeout(() => {
      addMessage({
        role: "assistant",
        content: `📊 I see you've uploaded "${data.fileName}" with ${data.rows.length.toLocaleString()} rows and ${data.headers.length} columns:\n\n${data.headers.map(h => `• ${h}`).join('\n')}\n\nWhat would you like me to help you enrich?`,
        type: "text",
      });
    }, 500);
  };

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;

    addMessage({
      role: "user",
      content,
      type: "text",
    });

    setIsProcessing(true);

    // Simulate AI response
    setTimeout(() => {
      if (!csvData) {
        addMessage({
          role: "assistant",
          content: "Please upload a CSV file first so I can help you enrich it.",
          type: "text",
        });
        setIsProcessing(false);
        return;
      }

      // Generate enrichment plan
      addMessage({
        role: "assistant",
        content: "Perfect! Let me create an enrichment plan for you...",
        type: "plan",
        data: {
          csvData,
          userRequest: content,
        },
      });
      setIsProcessing(false);
    }, 1000);
  };

  const handleRunSample = () => {
    addMessage({
      role: "assistant",
      content: "Running sample enrichment on 5 rows...",
      type: "sample",
      data: { csvData },
    });
  };

  const handleRunFull = () => {
    addMessage({
      role: "assistant",
      content: "Starting full enrichment...",
      type: "progress",
      data: { csvData },
    });
  };

  return (
    <div className="h-full flex flex-col max-w-4xl mx-auto">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
        {messages.map((message) => {
          if (message.type === "file-upload" && message.role === "user") {
            return (
              <FileUploadMessage
                key={message.id}
                data={message.data}
                timestamp={message.timestamp}
              />
            );
          }

          if (message.type === "plan") {
            return (
              <EnrichmentPlanMessage
                key={message.id}
                data={message.data}
                onRunSample={handleRunSample}
                onRunFull={handleRunFull}
              />
            );
          }

          if (message.type === "sample") {
            return (
              <SampleResultsMessage
                key={message.id}
                data={message.data}
                onRunFull={handleRunFull}
              />
            );
          }

          if (message.type === "progress") {
            return (
              <ProgressMessage
                key={message.id}
                data={message.data}
              />
            );
          }

          return (
            <ChatMessage
              key={message.id}
              message={message}
            />
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t px-6 py-4" style={{ 
        backgroundColor: "#FFFFFF",
        borderColor: "#C4CBF2"
      }}>
        <ChatInput
          onSend={handleSendMessage}
          onFileUpload={handleFileUpload}
          isProcessing={isProcessing}
        />
      </div>
    </div>
  );
}
