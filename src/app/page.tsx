"use client";

import { NextPage } from "next";
import Link from "next/link";

const Home: NextPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black-100">
      <h1 className="text-4xl font-bold mb-8">Welcome to AI Learning</h1>
      <Link
        href="/select-mode"
        className="px-6 py-3 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition"
      >
        Start a New Conversation
      </Link>
    </div>
  );
};

export default Home;