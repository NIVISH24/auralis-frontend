"use client";

import { FC } from "react";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "ai";
}

const ChatBubble: FC<ChatBubbleProps> = ({ text, sender }) => {
  return (
    <div
      className={`max-w-[80%] p-3 rounded-xl ${
        sender === "user"
          ? "bg-blue-600 ml-auto rounded-tr-none"
          : "bg-gray-700 mr-auto rounded-tl-none"
      }`}
    >
      <p className="text-white">{text}</p>
    </div>
  );
};

export default ChatBubble;
