import { FC } from "react";

interface ChatBubbleProps {
  text: string;
  sender: "user" | "ai";
}

const ChatBubble: FC<ChatBubbleProps> = ({ text, sender }) => {
  return (
    <div
      className={`flex ${sender === "user" ? "justify-end" : "justify-start"} mb-2`}
    >
      <div
        className={`px-4 py-2 rounded-lg max-w-xs ${
          sender === "user" ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
        }`}
      >
        {text}
      </div>
    </div>
  );
};

export default ChatBubble;
