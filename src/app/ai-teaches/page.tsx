"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { FaMicrophone, FaUpload } from "react-icons/fa"; 

const AiTeaches = () => {
  const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
  const messageContainerRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = (message: string) => {
    setMessages((prevMessages) => [...prevMessages, { text: message, sender: "user" }]);

    setTimeout(() => {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: `AI Response to: ${message}`, sender: "ai" },
      ]);
    }, 1000);
  };

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex justify-end flex-col h-screen bg-black-100">
      <div
        ref={messageContainerRef}
        className=" overflow-y-auto p-4 flex flex-col"
      >
        {messages.map((msg, index) => (
          <ChatBubble key={index} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <div className="flex items-center p-4 w-full">
        <div className="mr-2">
          <FaUpload className="text-white cursor-pointer" size={20} />
        </div>
        <div className="flex-grow">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
        <div className="ml-2">
          <FaMicrophone className="text-white cursor-pointer" size={20} />
        </div>
      </div>
    </div>
  );
};

export default AiTeaches;
