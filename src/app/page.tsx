"use client";

import { NextPage } from "next";
import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface Conversation {
  id: number;
  name: string;
}

const Home: NextPage = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newConversationName, setNewConversationName] = useState("");
  const [editingConversationId, setEditingConversationId] = useState<
    number | null
  >(null);
  const router = useRouter();

  // Function to start a new conversation
  const handleStartNewConversation = () => {
    setIsModalOpen(true); // Open the modal
  };

  // Function to submit the new conversation name
  const handleSubmitConversationName = () => {
    if (newConversationName.trim()) {
      const newConversation = {
        id: Date.now(), // Unique ID for the conversation
        name: newConversationName,
      };
      setConversations((prev) => [...prev, newConversation]);
      setNewConversationName(""); // Reset the input field
      setIsModalOpen(false); // Close the modal
      router.push("/select-mode"); // Navigate to the select-mode route
    }
  };

  // Function to rename a conversation
  const handleRenameConversation = (id: number, newName: string) => {
    setConversations((prev) =>
      prev.map((conv) => (conv.id === id ? { ...conv, name: newName } : conv))
    );
    setEditingConversationId(null);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white relative">
      <motion.h1
        className="text-8xl font-extrabold text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Auralis
      </motion.h1>
      <motion.p
        className="text-lg font-medium text-center mb-10 max-w-xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        &quot;Embrace the future of learning with AI — where knowledge meets
        innovation.&quot;
      </motion.p>
      {/* New Conversation Button */}
      <motion.div
        className="flex flex-col items-center space-y-4 mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <button
          onClick={handleStartNewConversation}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 via-white-500 to-blue-400 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
        >
          Start a New Conversation
        </button>
      </motion.div>
      {/* Modal for New Conversation Name */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <motion.div
            className="bg-gradient-to-r from-black via-gray-900 to-black border border-gray-700 rounded-lg p-6 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h2 className="text-xl font-bold mb-4">Enter Conversation Name</h2>
            <input
              type="text"
              value={newConversationName}
              onChange={(e) => setNewConversationName(e.target.value)}
              placeholder="Conversation Name"
              className="w-full px-4 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 mb-4"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitConversationName}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
              >
                Submit
              </button>
            </div>
          </motion.div>
        </div>
      )}
      {/* Previous Conversations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {conversations.map((conv) => (
          <motion.div
            key={conv.id}
            className="bg-gradient-to-r from-black via-gray-900 to-black border border-gray-700 rounded-lg p-4 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {editingConversationId === conv.id ? (
              <input
                type="text"
                defaultValue={conv.name}
                onBlur={(e) =>
                  handleRenameConversation(conv.id, e.target.value)
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    handleRenameConversation(conv.id, e.currentTarget.value);
                  }
                }}
                className="w-full bg-transparent text-white focus:outline-none"
                autoFocus
              />
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">{conv.name}</span>
                <button
                  onClick={() => setEditingConversationId(conv.id)}
                  className="text-gray-400 hover:text-white"
                >
                  ✏️
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      {/* Footer with small animated text */}
      <motion.footer
        className="absolute bottom-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p>Powered by AI — The Future of Education</p>
      </motion.footer>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-56 bg-gradient-to-r from-black via-gray-900 to-black rounded-b-full shadow-2xl opacity-60 animate-pulse z-0"></div>{" "}
    </div>
  );
};

export default Home;
