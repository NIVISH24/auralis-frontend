"use client";

import { NextPage } from "next";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Conversation {
  id: number;
  name: string;
}

const Home: NextPage = () => {
  const [conversations] = useState<Conversation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [models, setModels] = useState<string[]>([]);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  //const [selectedMode, setSelectedMode] = useState<"Validation" | "Generation" | null>(null);
  const [isNewModelModalOpen, setIsNewModelModalOpen] = useState(false);
  const router = useRouter();

  // New Model Creation States
  const [newModelName, setNewModelName] = useState("");
  const [fileSelection, setFileSelection] = useState<"single" | "folder">(
    "single"
  );
  const [websiteInput, setWebsiteInput] = useState("");
  const [websiteLinks, setWebsiteLinks] = useState<string[]>([]);
  const [automaticSearch, setAutomaticSearch] = useState(false);

  // Fetch models when modal opens
  useEffect(() => {
    if (isModalOpen) {
      axios
        .get("https://auralispy.shervintech.me/models")
        .then((res) => res.data)
        .then((data) => setModels(data.models))
        .catch((error) => console.error("Error fetching models:", error));
    }
  }, [isModalOpen]);

  const half = Math.ceil(models.length / 2);
  const firstRow = models.slice(0, half);
  const secondRow = models.slice(half);

  // Handle model selection
  const handleModelClick = (model: string) => {
    setSelectedModel(model);
  };

  // Handle mode selection; navigate as needed
  const handleModeSelect = (mode: "Validation" | "Generation") => {
    if (mode === "Validation") {
      router.push(`/student-teaches?model=${selectedModel}`);
    } else if (mode === "Generation") {
      router.push(`/ai-teaches?model=${selectedModel}`);
    }
  };

  // New model creation submission (only sends model_name and automatic search)
  const handleNewModelSubmit = async () => {
    const formData = new FormData();
    formData.append("model_name", newModelName);
    formData.append("topic", newModelName);
    // formData.append("rag_files", fileSelection);
    for (const [key, value] of formData.entries()) {
      console.log(key, value);
    }
    const fileInput = document.querySelector(
      'input[type="file"]'
    ) as HTMLInputElement;
    if (fileInput && fileInput.files && fileInput.files.length > 0) {
      formData.append("rag_files", fileInput.files[0]);
    }

    try {
      const res = await axios.post(
        "https://auralispy.shervintech.me/upload",
        formData,
        {
          timeout: 30 * 60 * 1000,
        }
      );

      if (res.status === 200) {
        setModels((prev) => [...prev, newModelName]);
        setIsNewModelModalOpen(false);
        setNewModelName("");
        setWebsiteLinks([]);
        setWebsiteInput("");
        setAutomaticSearch(false);
      } else {
        console.error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading model:", error);
      if (axios.isAxiosError(error) && error.response?.data?.detail) {
        console.error("Backend error details:", error.response.data.detail);
      }
    }
  };

  // Add website links on comma press
  const handleWebsiteInputKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === ",") {
      e.preventDefault();
      const trimmed = websiteInput.trim();
      if (trimmed && isValidUrl(trimmed)) {
        setWebsiteLinks((prev) => [...prev, trimmed]);
        setWebsiteInput("");
      }
    }
  };

  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const removeWebsiteLink = (link: string) => {
    setWebsiteLinks((prev) => prev.filter((l) => l !== link));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-[#21124b] to-black text-white relative">
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
      <motion.div
        className="flex flex-col items-center space-y-4 mb-8"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-8 py-4 bg-gradient-to-r from-blue-600 via-white-500 to-blue-400 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
        >
          Start your journey
        </button>
      </motion.div>

      {/* Model Selection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-r from-black via-[#21124b] to-black bg-opacity-75 z-50">
          {!selectedModel ? (
            <div className="w-full h-full flex flex-col justify-center items-center relative">
              {/* Plus sign to open new model creation modal */}
              <div className="absolute top-24 right-24">
                <button
                  onClick={() => setIsNewModelModalOpen(true)}
                  className="text-9xl text-white cursor-pointer border border-white/[0.3] rounded-3xl px-8 pb-4"
                >
                  +
                </button>
              </div>
              <div className="grid  grid-rows-2 gap-4 w-full px-4">
                <div className="flex justify-center space-x-4">
                  {firstRow.map((model) => (
                    <motion.div
                      key={model}
                      onClick={() => handleModelClick(model)}
                      className="p-4 bg-blue-800 rounded-lg text-white cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      {model}
                    </motion.div>
                  ))}
                </div>
                <div className="flex justify-center space-x-4">
                  {secondRow.map((model) => (
                    <motion.div
                      key={model}
                      onClick={() => handleModelClick(model)}
                      className="p-4 bg-blue-800 rounded-lg text-white cursor-pointer"
                      whileHover={{ scale: 1.05 }}
                    >
                      {model}
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Mode Selection View
            <div className="w-full h-full flex flex-col justify-center items-center">
              <div className="bg-gradient-to-r from-black via-[#21124b] to-black border border-gray-700 rounded-lg p-6 shadow-lg">
                <h2 className="text-xl font-bold mb-4">
                  Selected Model: {selectedModel}
                </h2>
                <p className="mb-4">Choose a mode:</p>
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleModeSelect("Validation")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                  >
                    Mode1: Validation
                  </button>
                  <button
                    onClick={() => handleModeSelect("Generation")}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
                  >
                    Mode2: Generation
                  </button>
                </div>
                <button
                  onClick={() => {
                    setSelectedModel(null);
                  }}
                  className="mt-4 text-gray-400 hover:text-white"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* New Model Creation Modal */}
      {isNewModelModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-60">
          <div className="bg-gradient-to-r from-black via-[#21124b] to-black border border-gray-700 rounded-lg p-6 shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Create New Model</h2>
            <div className="mb-4">
              <label className="block mb-1">Model Name</label>
              <input
                type="text"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                placeholder="Enter model name"
                className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1">PDF File</label>
              <div className="flex items-center space-x-4">
                <label>
                  <input
                    type="radio"
                    name="fileSelection"
                    value="single"
                    checked={fileSelection === "single"}
                    onChange={() => setFileSelection("single")}
                  />
                  Single PDF
                </label>
                <label>
                  <input
                    type="radio"
                    name="fileSelection"
                    value="folder"
                    checked={fileSelection === "folder"}
                    onChange={() => setFileSelection("folder")}
                  />
                  Select Folder
                </label>
              </div>
              {fileSelection === "single" ? (
                <input type="file" accept=".pdf" className="mt-2" />
              ) : (
                <input
                  type="file"
                  ref={(input) => {
                    if (input) input.webkitdirectory = true;
                  }}
                  className="mt-2"
                />
              )}
            </div>
            <div className="mb-4">
              <label className="block mb-1">Website Links</label>
              <input
                type="text"
                value={websiteInput}
                onChange={(e) => setWebsiteInput(e.target.value)}
                onKeyDown={handleWebsiteInputKeyDown}
                disabled={automaticSearch}
                placeholder="Type a link and press comma"
                className="w-full px-3 py-2 bg-transparent border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none"
              />
              <div className="flex flex-wrap mt-2">
                {websiteLinks.map((link) => (
                  <div
                    key={link}
                    className="bg-gray-800 px-2 py-1 mr-2 mb-2 rounded-full flex items-center"
                  >
                    <span className="mr-1">{link}</span>
                    <button
                      onClick={() => removeWebsiteLink(link)}
                      className="text-red-500"
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4 flex items-center">
              <input
                type="checkbox"
                checked={automaticSearch}
                onChange={(e) => setAutomaticSearch(e.target.checked)}
                id="automaticSearch"
              />
              <label htmlFor="automaticSearch" className="ml-2">
                Automatic Search (overrides website links)
              </label>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setIsNewModelModalOpen(false)}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleNewModelSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Conversations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-4xl px-4">
        {conversations.map((conv) => (
          <motion.div
            key={conv.id}
            className="bg-gradient-to-r from-black via-[#21124b] to-black border border-gray-700 rounded-lg p-4 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">{conv.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.footer
        className="absolute bottom-4 text-sm text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
      >
        <p>Powered by AI — The Future of Education</p>
      </motion.footer>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full h-56 bg-gradient-to-r from-black via-[#21124b] to-black rounded-b-full shadow-2xl opacity-60 animate-pulse z-0"></div>
    </div>
  );
};

export default Home;
