"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";

const AiTeaches = () => {
  const searchParams = useSearchParams();
  const modelName = searchParams.get("model");
  const [subtopics, setSubtopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [content, setContent] = useState<string[][][]>([]);
  const [selectedGroupIndex, setSelectedGroupIndex] = useState<number | null>(null);
  const [isExplanationLoading, setIsExplanationLoading] = useState(false);
  const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  // Fetch subtopics from Gemini API on mount
  useEffect(() => {
    const fetchSubtopics = async () => {
      try {
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;
    
        const promptData = {
          contents: [
            {
              parts: [
                {
                  text: `Generate a list of 10 educational subtopics for the main topic: "${modelName}". 
                  Format the response as a plain array of strings with no numbering or bullets.`,
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

        if (!response.ok) throw new Error("Failed to fetch subtopics");
        
        const data = await response.json();
        const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (!responseText) throw new Error("Invalid response from Gemini API");
        
        // Process response text to extract subtopics
        const extractedArray = responseText.match(/\[(.*)\]/s)?.[1];
        const parsedArray = extractedArray ? JSON.parse(`[${extractedArray}]`) : [];
        setSubtopics(parsedArray);
      } catch (err) {
        setError("Failed to fetch subtopics. Please refresh the page.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (modelName) fetchSubtopics();
    else setError("Missing model parameter in URL");
  }, [modelName]);

  // Handle subtopic click
  const handleSubtopicClick = async (subtopic: string) => {
    setIsLoading(true);
    try {
      // Fetch from RAG endpoint
      const ragResponse = await fetch("https://auralispy.shervintech.me/rag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model_name: modelName,
          query: subtopic
        }),
      });
      
      if (!ragResponse.ok) throw new Error("RAG request failed");
      const ragData = await ragResponse.json();
      console.log(ragData);
      // Process through split endpoint
      const splitResponse = await fetch("https://auralis.shervintech.me/split", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: ragData.results }),
      });

      if (!splitResponse.ok) throw new Error("Split request failed");
      const splitData = await splitResponse.json();
      
      setContent(splitData.splitted_paragraphs);
    } catch (err) {
      setError("Failed to load content. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle content expansion
  const handleExpand = async (groupIndex: number) => {
    setIsExplanationLoading(true);
    try {
      const groupContent = content[groupIndex];
      const flatContent = groupContent.flat();

      const explainResponse = await fetch("https://auralis.shervintech.me/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content_json: JSON.stringify({ splitted_paragraphs: content }),
          specific_content: flatContent.join(" ")
        }),
      });

      if (!explainResponse.ok) throw new Error("Explanation request failed");
      const explainData = await explainResponse.json();

      // Update content with new paragraphs
      const newContent = [...content];
      newContent.splice(groupIndex, 1, ...explainData.splitted_paragraphs);
      setContent(newContent);
    } catch (err) {
      setError("Failed to expand content. Please try again.");
      console.error(err);
    } finally {
      setIsExplanationLoading(false);
      setSelectedGroupIndex(null);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gradient-to-r from-black via-gray-800 to-black text-white">
      <div className="w-[90vw] h-[90vh] rounded-3xl border border-white/[0.3] overflow-hidden backdrop-blur-3xl bg-opacity-50 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.2]">
          <h1 className="text-xl font-bold">Model: {modelName}</h1>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {content.length > 0 ? (
            <div className="max-w-3xl mx-auto">
              {content.map((group, groupIndex) => (
                <motion.div
                  key={groupIndex}
                  className="mb-6 p-4 rounded-lg bg-gray-900/50 border border-gray-700"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {group.map((sentence, sentenceIndex) => (
                    <div
                      key={sentenceIndex}
                      className="mb-3 p-3 rounded-md hover:bg-gray-800/50 transition-colors cursor-pointer"
                      onClick={() => setSelectedGroupIndex(groupIndex)}
                    >
                      <p className="text-gray-300">{sentence}</p>
                    </div>
                  ))}
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">
                Subtopics for {modelName}
              </h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
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
            </>
          )}
        </div>

        {/* Expansion Modal */}
        {selectedGroupIndex !== null && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="bg-gray-900 p-6 rounded-lg max-w-md w-full">
              <h3 className="text-xl font-semibold mb-4">Options</h3>
              <button
                onClick={() => handleExpand(selectedGroupIndex)}
                className="w-full mb-3 p-3 bg-blue-600 hover:bg-blue-700 rounded-lg"
                disabled={isExplanationLoading}
              >
                {isExplanationLoading ? "Expanding..." : "Expand"}
              </button>
              <button
                className="w-full p-3 bg-gray-700 hover:bg-gray-600 rounded-lg"
                onClick={() => setSelectedGroupIndex(null)}
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AiTeaches;