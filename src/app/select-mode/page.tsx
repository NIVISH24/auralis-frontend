"use client";

import { NextPage } from "next";
import Link from "next/link";

const SelectMode: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-100">
      <h1 className="text-3xl font-semibold mb-6">Choose Learning Mode</h1>
      <div className="space-y-4">
        <Link
          href="/ai-teaches"
          className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition block text-center"
        >
          AI Teaches Student
        </Link>
        <Link
          href="/student-teaches"
          className="px-6 py-3 bg-purple-500 text-white rounded-lg shadow-md hover:bg-purple-600 transition block text-center"
        >
          Student Teaches AI
        </Link>
      </div>
    </div>
  );
};

export default SelectMode; 
