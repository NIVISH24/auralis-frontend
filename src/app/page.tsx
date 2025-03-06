"use client";

import { NextPage } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white relative">
      <motion.h1
        className="text-6xl font-extrabold text-center mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Welcome to AI Learning
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
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        <Link
          href="/select-mode"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 via-white-500 to-blue-400 text-white rounded-lg shadow-lg hover:from-blue-400 hover:to-blue-500 transition-all transform hover:scale-105"
        >
          Start a New Conversation
        </Link>
      </motion.div>
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
