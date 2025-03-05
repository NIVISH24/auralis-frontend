"use client";

import { useState } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";

const StudentTeaches = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);

  const handleSendMessage = (message: string) => {
    setMessages([...messages, { text: message, sender: "user" }]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { text: `AI Response to: "${message}"`, sender: "ai" }]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-screen bg-black-100">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
};

export default StudentTeaches;
