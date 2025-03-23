import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

const quizPairs = [
  ["Work in teams", "Work solo"],
  ["Lead", "Support"],
  ["Think fast", "Plan deeply"],
  ["Take initiative", "Follow instructions"],
  ["Emotion-driven", "Logic-driven"],
];

export function PersonalityScreen() {
  const [answers, setAnswers] = useState<string[]>(Array(5).fill(''));
  const navigate = useNavigate();

  const handleSelect = (index: number, value: string) => {
    const updated = [...answers];
    updated[index] = value;
    setAnswers(updated);
  };

  const handleNext = () => {
    localStorage.setItem('traits', JSON.stringify(answers));
    navigate('/reflect');
  };

  return (
    <div className="min-h-screen w-screen bg-[#fdf6ee] font-serif flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-neutral-200 p-10"
      >
        <h2 className="text-3xl font-bold mb-10 text-center">
          🧠 Discover Your Style
        </h2>

        <div className="space-y-6">
          {quizPairs.map(([a, b], i) => (
            <div key={i}>
              <p className="mb-2 text-lg">{i + 1}. Choose one:</p>
              <div className="flex flex-wrap gap-4">
                <Button
                  variant={answers[i] === a ? "default" : "outline"}
                  className="px-4 py-2 text-base"
                  onClick={() => handleSelect(i, a)}
                >
                  {a}
                </Button>
                <Button
                  variant={answers[i] === b ? "default" : "outline"}
                  className="px-4 py-2 text-base"
                  onClick={() => handleSelect(i, b)}
                >
                  {b}
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Button
            onClick={handleNext}
            disabled={answers.includes('')}
            className="px-6 py-2 text-lg font-medium rounded bg-black text-white hover:bg-neutral-800 transition"
          >
            Next
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
