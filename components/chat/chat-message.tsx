"use client";

import type { Message } from "./chat-interface";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#0528F2" }}
        >
          <Bot className="w-5 h-5 text-white" />
        </div>
      )}

      <div
        className={`max-w-[70%] rounded-xl px-4 py-3 ${
          isUser ? "rounded-tr-sm" : "rounded-tl-sm"
        }`}
        style={{
          backgroundColor: isUser ? "#0528F2" : "#FFFFFF",
          color: isUser ? "#FFFFFF" : "#0D0D0D",
          border: isUser ? "none" : "1px solid #C4CBF2",
        }}
      >
        <p className="text-md whitespace-pre-wrap leading-relaxed">
          {message.content}
        </p>
        <p
          className="text-xs mt-2 opacity-60"
          style={{ color: isUser ? "#FFFFFF" : "#626262" }}
          suppressHydrationWarning
        >
          {message.timestamp.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>

      {isUser && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#C4CBF2" }}
        >
          <User className="w-5 h-5" style={{ color: "#0528F2" }} />
        </div>
      )}
    </div>
  );
}
