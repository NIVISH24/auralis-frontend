"use client";

import { useState, useEffect, useRef } from "react";
import ChatBubble from "@/components/ChatBubble";
import { FaMicrophone, FaWindowRestore, FaMinus, FaStop } from "react-icons/fa";
import { motion } from "framer-motion";

interface Message {
  text: string;
  sender: "user" | "ai";
}

const StudentTeaches = () => {
  const [messages, setMessages] = useState<Message[]>([]); // For chat history
  const [mainChat, setMainChat] = useState<Message[]>([]); // For main chat window
  const [inputText, setInputText] = useState(""); // For the input field
  const [isApiProcessing, setIsApiProcessing] = useState(false); // To track API requests
  const [historyMinimized, setHistoryMinimized] = useState(false); // For chat history window
  const [historyPosition, setHistoryPosition] = useState({ x: 0, y: 0 }); // For draggable history
  const [isSessionActive, setIsSessionActive] = useState(true); // To track session state
  const [sentLength, setSentLength] = useState(0); // To track how much text has been sent
  const messageContainerRef = useRef<HTMLDivElement>(null); // For auto-scrolling
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // For debounced submission

  // Auto-scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle text input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setInputText(newText);

    // Split into words and check if we have 10+ words beyond the sent length
    const words = newText.trim().split(/\s+/).filter(Boolean);
    const unsentWords = words.slice(sentLength); // Only consider unsent words

    if (unsentWords.length >= 10) {
      const wordsToSend = unsentWords.slice(0, 10).join(" ");

      // Clear any pending timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      // Send the next 10 words
      sendPostRequest(wordsToSend);

      // Update the sent length
      setSentLength((prev) => prev + 10);
    } else {
      // Set up debounced submission
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set new timeout for 5 seconds
      timeoutRef.current = setTimeout(() => {
        if (unsentWords.length > 0) {
          sendPostRequest(unsentWords.join(" "));
          setSentLength(words.length); // Mark all words as sent
        }
      }, 5000);
    }
  };

  // Function to send a POST request for a chunk of text
  const sendPostRequest = async (text: string) => {
    if (!text.trim() || isApiProcessing) return;

    setIsApiProcessing(true);

    try {
      const response = await fetch("https://auralis.shervintech.me/interrupt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_input: text }),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch response from API.");
      }

      let data = await response.json();
      try {
        data = JSON.parse(data.response);

        // Append AI response to the main chat window
        setMainChat((prev) => [
          ...prev,
          { text: data.response || "No response from AI.", sender: "ai" },
        ]);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (parseError) {
        // Handle case where response isn't valid JSON
        setMainChat((prev) => [
          ...prev,
          { text: data.response || "No response from AI.", sender: "ai" },
        ]);
      }
    } catch (error) {
      console.error("Error sending post request:", error);
      setMainChat((prev) => [
        ...prev,
        { text: "Error fetching response. Please try again.", sender: "ai" },
      ]);
    } finally {
      setIsApiProcessing(false);
    }
  };

  // Handle key press in input field
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey && inputText.trim()) {
      e.preventDefault();
      const words = inputText.trim().split(/\s+/).filter(Boolean);
      const unsentWords = words.slice(sentLength);

      if (unsentWords.length > 0) {
        sendPostRequest(unsentWords.join(" "));
        setSentLength(words.length); // Mark all words as sent
      }
    }
  };

  // Handle stop button click
  const handleStop = () => {
    const words = inputText.trim().split(/\s+/).filter(Boolean);
    const unsentWords = words.slice(sentLength);

    if (unsentWords.length > 0) {
      sendPostRequest(unsentWords.join(" "));
    }

    // Add the full user text to the chat history
    setMessages((prev) => [...prev, { text: inputText, sender: "user" }]);

    // Clear input and end the session
    setInputText("");
    setSentLength(0);
    setIsSessionActive(false);

    // Clear any pending timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white">
      <div className="w-[90vw] h-[90vh] rounded-3xl border border-white/[0.3] overflow-hidden backdrop-blur-3xl bg-opacity-50 relative">
        {/* Draggable Chat History Box */}
        <motion.div
          drag
          dragMomentum={false}
          className="absolute top-8 right-8 z-10"
          animate={{
            width: historyMinimized ? "60px" : "300px",
            height: historyMinimized ? "60px" : "400px",
          }}
          onDragEnd={(_, info) => {
            setHistoryPosition({
              x: historyPosition.x + info.offset.x,
              y: historyPosition.y + info.offset.y,
            });
          }}
          style={{
            x: historyPosition.x,
            y: historyPosition.y,
          }}
        >
          <div className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
            <div className="flex justify-between items-center bg-gray-800 p-2 cursor-move">
              {!historyMinimized && (
                <div className="text-white text-sm">Chat History</div>
              )}
              <div className="flex space-x-2">
                <button
                  onClick={() => setHistoryMinimized(!historyMinimized)}
                  className="text-white text-xs bg-gray-700 hover:bg-gray-600 p-1 rounded"
                >
                  {historyMinimized ? (
                    <FaWindowRestore size={12} />
                  ) : (
                    <FaMinus size={12} />
                  )}
                </button>
              </div>
            </div>

            {!historyMinimized && (
              <div
                ref={messageContainerRef}
                className="flex-1 overflow-y-auto p-2 flex flex-col space-y-3"
              >
                {messages.length === 0 && (
                  <div className="text-gray-500 text-xs text-center py-2">
                    No messages yet
                  </div>
                )}

                {messages.map((msg, index) => (
                  <ChatBubble key={index} text={msg.text} sender={msg.sender} />
                ))}
              </div>
            )}

            {historyMinimized && (
              <div className="flex items-center justify-center h-full">
                <button
                  onClick={() => setHistoryMinimized(!historyMinimized)}
                  className="text-white text-xs bg-gray-700 hover:bg-gray-600 p-1 rounded"
                >
                  Chat History
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Chat Window */}
        <div className="p-4 h-[calc(90vh-80px)] overflow-y-auto">
          {mainChat.map((msg, index) => (
            <ChatBubble key={index} text={msg.text} sender={msg.sender} />
          ))}
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900 border-t border-gray-800">
          <div className="flex items-center">
            <button className="p-2 rounded-full bg-gray-800 mr-3">
              <FaMicrophone className="text-white" size={18} />
            </button>

            <div className="flex-1 relative">
              <input
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type a message... (auto-sends at 10 words or after 5s)"
                disabled={!isSessionActive} // Disable input if session is inactive
              />

              <div className="absolute right-3 top-3 text-xs text-gray-400">
                {inputText.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            <button
              className="ml-3 p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"
              onClick={handleStop}
              disabled={!isSessionActive} // Disable button if session is inactive
            >
              <FaStop className="text-white" size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentTeaches;
