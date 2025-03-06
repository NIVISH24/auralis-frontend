"use client";

import { NextPage } from "next";
import Link from "next/link";
import { motion } from "framer-motion";

const SelectMode: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-black via-gray-900 to-black text-white">
      <motion.h1
        className="text-4xl font-extrabold mb-10 text-center"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Choose Learning Mode
      </motion.h1>

      <div className="space-y-50">
        <Link href="/ai-teaches">
          <motion.div
            className="bg-gradient-to-r from-black-800 via-gray-900 to-black-800 rounded-lg shadow-xl p-6 w-full max-w-md cursor-pointer transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center">
              AI Teaches Student
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Experience how AI can guide and teach you interactively.
            </p>
          </motion.div>
        </Link>
        <Link href="/student-teaches">
          <motion.div
            className="bg-gradient-to-r from-black-800 via-gray-900 to-black-800 rounded-lg shadow-xl p-6 w-full max-w-md cursor-pointer transform hover:scale-105 transition-all duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-center ">
              Student Teaches AI
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Explore how teaching AI can enhance your understanding and skills.
            </p>
          </motion.div>
        </Link>
      </div>
    </div>
  );
};

export default SelectMode;
