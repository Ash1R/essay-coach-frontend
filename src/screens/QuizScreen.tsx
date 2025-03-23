import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"; // optional, we style our own here

const quizPairs = [
  ["Build something new", "Perfect something existing"],
  ["Lead the group", "Support from behind the scenes"],
  ["Logic and planning", "Emotion and intuition"],
  ["Try everything once", "Master one thing"],
  ["Talk it out", "Think it through"]
];

export function QuizScreen() {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(""));
  const navigate = useNavigate();

  const handleSelect = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    localStorage.setItem("quizAnswers", JSON.stringify(answers));
    navigate("/prompts");
  };

  return (
    <div className="min-h-screen bg-[#fdf6ee] font-serif flex flex-col items-center">
      {/* Header */}
      <div className="w-full max-w-6xl px-6 py-6 border-b bg-white shadow-sm text-center">
        <h1 className="text-4xl font-bold tracking-tight text-neutral-900">AboutYou</h1>
      </div>

      {/* Main Content */}
      <div className="w-full flex justify-center px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-2xl bg-white rounded-2xl p-10 shadow-md border border-neutral-200"
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-10 text-center text-neutral-800">
            Step 1: Personality Quiz
          </h2>

          <div className="grid grid-cols-1 gap-8">
            {quizPairs.map(([a, b], i) => (
              <div key={i} className="text-center">
                <p className="mb-3 text-lg text-neutral-700">{i + 1}. Choose one:</p>
                <div className="flex flex-wrap justify-center gap-4">
                  {[a, b].map((option) => {
                    const isSelected = answers[i] === option;
                    return (
                      <button
                        key={option}
                        onClick={() => handleSelect(i, option)}
                        className={`px-6 py-3 rounded-full border text-base font-medium transition duration-150
                          ${
                            isSelected
                              ? "bg-black text-white border-black"
                              : "bg-white text-black border-black hover:bg-neutral-100"
                          }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* More space before next button */}
          <div className="mt-16 text-center">
            <button
              onClick={handleNext}
              disabled={answers.includes("")}
              className={`px-8 py-3 text-lg font-medium rounded-full transition
                ${
                  answers.includes("")
                    ? "bg-neutral-300 text-white cursor-not-allowed"
                    : "bg-black text-white hover:bg-neutral-800"
                }`}
            >
              Next →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
