"use client";

import { useState, useRef } from "react";
import { Send, Paperclip } from "lucide-react";
import { Button } from "../ui/button";
import Papa from "papaparse";
import type { CSVData } from "../enrichment-workflow";

interface ChatInputProps {
  onSend: (message: string) => void;
  onFileUpload: (data: CSVData) => void;
  isProcessing: boolean;
}

export function ChatInput({ onSend, onFileUpload, isProcessing }: ChatInputProps) {
  const [message, setMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;
    onSend(message);
    setMessage("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, string>[];

        onFileUpload({
          headers,
          rows,
          fileName: file.name,
        });
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        alert("Failed to parse CSV file");
      },
    });

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="icon"
        onClick={() => fileInputRef.current?.click()}
        className="flex-shrink-0"
        style={{ borderColor: "#C4CBF2" }}
      >
        <Paperclip className="w-5 h-5" style={{ color: "#626262" }} />
      </Button>

      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Describe what you'd like to enrich..."
          rows={1}
          className="w-full px-4 py-3 rounded-md border resize-none focus:outline-none focus:ring-2 focus:ring-offset-0"
          style={{
            backgroundColor: "#FFFFFF",
            borderColor: "#C4CBF2",
            color: "#0D0D0D",
            maxHeight: "120px",
          }}
          disabled={isProcessing}
        />
      </div>

      <Button
        type="submit"
        size="icon"
        disabled={!message.trim() || isProcessing}
        className="flex-shrink-0"
        style={{ backgroundColor: "#0528F2" }}
      >
        <Send className="w-5 h-5 text-white" />
      </Button>
    </form>
  );
}
