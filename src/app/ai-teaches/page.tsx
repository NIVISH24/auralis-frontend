"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "@/components/ChatBubble";
import ChatInput from "@/components/ChatInput";
import { FaMicrophone } from "react-icons/fa";
import { motion } from "framer-motion";

const StudentTeaches = () => {
  const [messages, setMessages] = useState<
    { text: string; sender: "user" | "ai" }[]
  >([]);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [tags, setTags] = useState<string[]>([]);
  const [autoSearch, setAutoSearch] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const messageContainerRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const unsentWordsRef = useRef<string[]>([]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const sendPostRequest = async (text: string) => {
    setMessages((prev) => [...prev, { text, sender: "user" }]);

    try {
      const response = await fetch("/api/interrupt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: text }),
      });
      const data = await response.json();
      if (data.response) {
        setMessages((prev) => [...prev, { text: data.response, sender: "ai" }]);
      } else {
        setMessages((prev) => [
          ...prev,
          { text: "No response from server.", sender: "ai" },
        ]);
      }
    } catch (error) {
      console.error("Error sending post request:", error);
      setMessages((prev) => [
        ...prev,
        { text: "Error sending post request.", sender: "ai" },
      ]);
    }
  };

  const handleInputChange = (text: string) => {
    setInputValue(text);

    const words = text.trim().split(/\s+/).filter(Boolean);
    unsentWordsRef.current = words;

    if (words.length >= 10) {
      const wordsToSend = words.slice(0, 10).join(" ");
      const remainingWords = words.slice(10).join(" ");
      setInputValue(remainingWords);
      unsentWordsRef.current = remainingWords
        .trim()
        .split(/\s+/)
        .filter(Boolean);

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      sendPostRequest(wordsToSend);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        const unsent = unsentWordsRef.current;
        if (unsent.length > 0 && unsent.length < 10) {
          const textToSend = unsent.join(" ");
          sendPostRequest(textToSend);
          setInputValue("");
          unsentWordsRef.current = [];
        }
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white">
      <div className="w-[90vw] h-[90vh] rounded-3xl border border-white/[0.3] overflow-hidden backdrop-blur-3xl bg-opacity-50">
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-opacity-50 flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="p-6 rounded-3xl backdrop-blur-3xl bg-opacity-50 border border-white/[0.3] w-1/3 max-w-lg"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-lg font-semibold mb-4 text-white">
                Enter Details
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-black-700">
                  Upload image/docs
                </label>
                <input type="file" className="mt-2 border rounded p-2 w-full" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-black-700">
                  Enter website links (press Enter to add)
                </label>
                <input
                  type="text"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      const tag = (e.target as HTMLInputElement).value;
                      if (tag.trim() && !tags.includes(tag)) {
                        setTags((prevTags) => [...prevTags, tag]);
                      }
                      (e.target as HTMLInputElement).value = "";
                    }
                  }}
                  className="mt-2 border rounded p-2 w-full"
                  placeholder="Enter website link"
                />
                {tags.length > 0 && (
                  <div
                    className="overflow-y-auto max-h-40 border p-2 mb-2 rounded mt-2"
                    style={{ maxHeight: "200px" }}
                  >
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-500 text-white rounded-full py-1 px-3 mr-2 mb-2 flex items-center"
                        style={{
                          display: "inline-flex",
                          padding: "0.2rem 0.5rem",
                          minWidth: "auto",
                        }}
                      >
                        {tag}
                        <button
                          onClick={() => setTags(tags.filter((t) => t !== tag))}
                          className="ml-2 text-red-500 text-xs"
                        >
                          X
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={autoSearch}
                    onChange={() => setAutoSearch((prev) => !prev)}
                    className="mr-2"
                  />
                  Automatic Search
                </label>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md w-full"
              >
                Submit
              </button>
            </motion.div>
          </motion.div>
        )}

        <div
          ref={messageContainerRef}
          className="overflow-y-auto p-4 justify-end flex flex-col space-y-4 h-[calc(90vh-8rem)]"
        >
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <ChatBubble text={msg.text} sender={msg.sender} />
            </motion.div>
          ))}
        </div>

        <div className="flex items-center p-4 w-full">
          <div className="flex-grow">
            <ChatInput
              value={inputValue}
              onChange={handleInputChange}
              onSendChunk={(text) => {
                if (text.trim()) {
                  sendPostRequest(text.trim());
                }
              }}
              onSendMessage={() => {
                if (inputValue.trim()) {
                  if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                    timeoutRef.current = null;
                  }
                  const textToSend = inputValue.trim();
                  setInputValue("");
                  unsentWordsRef.current = [];
                  sendPostRequest(textToSend);
                }
              }}
            />
          </div>
          <div className="ml-2">
            <FaMicrophone className="text-white cursor-pointer" size={20} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTeaches;
