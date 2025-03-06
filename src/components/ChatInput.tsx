"use client";

import { FC, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FaTimes } from "react-icons/fa";

interface ChatInputProps {
  value: string;
  onChange: (text: string) => void;
  onSendChunk: (text: string) => void;
  onSendMessage: (message: string) => void;
}

const ChatInput: FC<ChatInputProps> = ({ value, onChange, onSendChunk }) => {
  const [minimized, setMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Set up debounced submission
  useEffect(() => {
    if (value.trim()) {
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for 3 seconds
      timeoutRef.current = setTimeout(() => {
        const words = value.trim().split(/\s+/).filter(Boolean);
        if (words.length > 0) {
          onSendChunk(value);
          onChange("");
        }
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value, onSendChunk, onChange]);

  // Function to handle text input
  const handleTextChange = (newText: string) => {
    onChange(newText);

    // Split into words and check if we have 10+ words
    const words = newText.trim().split(/\s+/).filter(Boolean);
    if (words.length >= 10) {
      const wordsToSend = words.slice(0, 10).join(" ");
      const remainingWords = words.slice(10).join(" ");

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Send the chunk and update input
      onSendChunk(wordsToSend);
      onChange(remainingWords);
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      dragConstraints={{ left: -100, right: 100, top: -100, bottom: 100 }}
      className="absolute bottom-8 right-8 z-10"
      animate={{
        width: minimized ? "40px" : "300px",
        height: minimized ? "40px" : "auto",
      }}
      onDragEnd={(_, info) => {
        setPosition({
          x: position.x + info.offset.x,
          y: position.y + info.offset.y,
        });
      }}
      style={{
        x: position.x,
        y: position.y,
      }}
    >
      <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden">
        <div className="flex justify-between items-center bg-gray-800 p-2 cursor-move">
          <div className="text-white text-sm">
            {minimized ? "Input" : "Message Input"}
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setMinimized(!minimized)}
              className="text-white text-xs bg-gray-700 hover:bg-gray-600 p-1 rounded"
            >
              {minimized ? "+" : "-"}
            </button>
            <button className="text-white text-xs bg-gray-700 hover:bg-red-600 p-1 rounded">
              <FaTimes size={12} />
            </button>
          </div>
        </div>

        {!minimized && (
          <div className="p-2">
            <textarea
              value={value}
              onChange={(e) => handleTextChange(e.target.value)}
              className="w-full p-2 bg-gray-800 text-white border border-gray-700 rounded resize-none"
              placeholder="Type a message..."
              rows={3}
            />
            <div className="text-xs text-gray-400 mt-1 flex justify-between">
              <span>
                {value.trim().split(/\s+/).filter(Boolean).length} words
              </span>
              <span>Auto-sends at 10 words</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChatInput;
