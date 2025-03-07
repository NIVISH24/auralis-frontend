"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FaPaperPlane } from "react-icons/fa";

const AiTeaches = () => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [formData, setFormData] = useState({
    topicName: "",
    tags: [] as string[],
    autoSearch: false,
    file: null as File | null,
  });
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSubtopic, setSelectedSubtopic] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const GEMINI_API_KEY = ""; //process.env.NEXT_PUBLIC_GEMINI_API_KEY || "YOUR_API_KEY_HERE";

  // Handle form field changes
  const handleFormChange = (field: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Tag management functions
  const handleAddTag = (tag: string) => {
    if (tag.trim() && !formData.tags.includes(tag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tag],
      }));
    }
  };

  const handleDeleteTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  const handleTagInputChange = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleAddTag((e.target as HTMLInputElement).value);
      (e.target as HTMLInputElement).value = "";
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({
        ...prev,
        file: e.target.files ? e.target.files[0] : null,
      }));
    }
  };

  // Fetch subtopics from Gemini API
  const fetchSubtopics = async (topic: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
      const promptData = {
        contents: [
          {
            parts: [
              {
                text: `Generate a list of 10 educational subtopics for the main topic: "${topic}". 
                Format the response as a plain array of strings with no numbering or bullets.
                For example, if the topic is "DBMS", return subtopics like ["Introduction to DBMS", "Database Architecture", "Normalization in DBMS", etc.]`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 1024,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch subtopics");
      }

      const data = await response.json();

      // Extract the text response from Gemini
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error("Invalid response from Gemini API");
      }

      // Process the response text to extract subtopics
      try {
        const extractedArray = responseText.match(/\[(.*)\]/s)?.[1];
        if (extractedArray) {
          // Parse the array string into actual array
          const parsedArray = JSON.parse(`[${extractedArray}]`);
          setSubtopics(parsedArray);
        } else {
          // Fallback: split by new lines and clean up
          const lines = responseText
            .split("\n")
            .map((line: string) => line.replace(/^[0-9]+[\.\)-]\s*/, "").trim())
            .filter((line: string | unknown[]) => line.length > 0);
          setSubtopics(lines);
        }
      } catch (parseError) {
        console.error("Error parsing response:", parseError);
        // Fallback method if JSON parsing fails
        const lines = responseText
          .split("\n")
          .map((line: string) => line.replace(/^[0-9]+[\.\)-]\s*/, "").trim())
          .filter((line: string | unknown[]) => line.length > 0);
        setSubtopics(lines);
      }
    } catch (err) {
      setError("Failed to fetch subtopics. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch detailed explanation for a subtopic
  const fetchExplanation = async (subtopic: string) => {
    setIsExplanationLoading(true);
    setError(null);

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

      const promptData = {
        contents: [
          {
            parts: [
              {
                text: `Provide a detailed explanation of the subtopic: "${subtopic}". 
                The explanation should be comprehensive and educational, suitable for a student.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 2048,
        },
      };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promptData),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch explanation");
      }

      const data = await response.json();

      // Extract the text response from Gemini
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!responseText) {
        throw new Error("Invalid response from Gemini API");
      }

      setExplanation(responseText);
    } catch (err) {
      setError("Failed to fetch explanation. Please try again.");
      console.error(err);
    } finally {
      setIsExplanationLoading(false);
    }
  };

  // Handle starting the chat
  const handleStartChatting = async () => {
    if (!formData.topicName.trim()) {
      setError("Please enter a topic name.");
      return;
    }

    await fetchSubtopics(formData.topicName);
    setIsModalOpen(false);
  };

  // Return to topic selection
  const handleReset = () => {
    setIsModalOpen(true);
    setSubtopics([]);
    setError(null);
  };

  // Handle subtopic click
  const handleSubtopicClick = async (subtopic: string) => {
    setSelectedSubtopic(subtopic);
    await fetchExplanation(subtopic);
  };

  // Close explanation modal
  const handleCloseExplanation = () => {
    setSelectedSubtopic(null);
    setExplanation(null);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white">
      <div className="w-[90vw] h-[90vh] rounded-3xl border border-white/[0.3] overflow-hidden backdrop-blur-3xl bg-opacity-50 flex flex-col">
        {/* Header with topic name */}
        {!isModalOpen && (
          <div className="p-4 border-b border-white/[0.2] flex justify-between items-center">
            <h1 className="text-xl font-bold">Topic: {formData.topicName}</h1>
            <button
              onClick={handleReset}
              className="px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm"
            >
              Change Topic
            </button>
          </div>
        )}

        {/* Initial Modal */}
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="p-6 rounded-2xl bg-gray-900 border border-white/[0.3] w-1/3 max-w-lg shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-5 text-white">
                Enter Topic Name
              </h3>

              {/* Topic Name Input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Topic Name
                </label>
                <input
                  type="text"
                  value={formData.topicName}
                  onChange={(e) =>
                    handleFormChange("topicName", e.target.value)
                  }
                  className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter topic name"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleStartChatting();
                  }}
                />
              </div>

              {/* File Upload */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Upload image/docs
                </label>
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700"
                />
              </div>

              {/* Website Links/Tags */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Enter website links (press Enter to add)
                </label>
                <input
                  type="text"
                  onKeyDown={handleTagInputChange}
                  className="mt-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 w-full text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter website link"
                />

                {formData.tags.length > 0 && (
                  <div className="overflow-y-auto max-h-40 border border-gray-700 p-3 rounded-lg mt-3 bg-gray-800/50">
                    <div className="flex flex-wrap">
                      {formData.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="bg-blue-600 text-white rounded-full py-1 px-3 mr-2 mb-2 inline-flex items-center"
                        >
                          {tag}
                          <button
                            onClick={() => handleDeleteTag(tag)}
                            className="ml-2 bg-blue-700 hover:bg-blue-800 rounded-full w-5 h-5 flex items-center justify-center"
                          >
                            x
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Automatic Search Toggle */}
              <div className="mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.autoSearch}
                    onChange={() =>
                      handleFormChange("autoSearch", !formData.autoSearch)
                    }
                    className="mr-3 h-4 w-4 rounded border-gray-300"
                  />
                  <span className="text-gray-300">Automatic Search</span>
                </label>
              </div>

              {/* Error Message */}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              {/* Start Chatting Button */}
              <button
                onClick={handleStartChatting}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg w-full font-medium transition-colors duration-200 flex items-center justify-center"
              >
                <span>Generate </span>
                <FaPaperPlane className="ml-2" />
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* Subtopic Cards */}
        {!isModalOpen && (
          <div className="flex-1 overflow-y-auto p-6">
            <h2 className="text-2xl font-semibold mb-6">
              Subtopics for {formData.topicName}
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="text-gray-400 ml-4">Generating subtopics...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-full flex-col">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={() => fetchSubtopics(formData.topicName)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subtopics.map((subtopic, index) => (
                  <motion.div
                    key={index}
                    className="bg-gradient-to-r from-black via-gray-900 to-black border border-gray-700 rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:border-blue-500/50 cursor-pointer"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onClick={() => handleSubtopicClick(subtopic)}
                  >
                    <h3 className="text-lg font-medium text-white">
                      {subtopic}
                    </h3>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Explanation Modal */}
        {selectedSubtopic && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="p-6 rounded-2xl bg-gray-900 border border-white/[0.3] w-1/2 max-w-2xl shadow-xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <h3 className="text-xl font-semibold mb-5 text-white">
                {selectedSubtopic}
              </h3>

              {isExplanationLoading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                  <p className="text-gray-400 ml-4">
                    Generating explanation...
                  </p>
                </div>
              ) : (
                <div className="overflow-y-auto max-h-[60vh]">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {explanation}
                  </p>
                </div>
              )}

              <button
                onClick={handleCloseExplanation}
                className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg w-full font-medium transition-colors duration-200"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AiTeaches;
