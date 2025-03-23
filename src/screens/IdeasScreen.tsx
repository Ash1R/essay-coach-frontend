// IdeasScreen.tsx - Step 3: Essay Idea Suggestions
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";

export function IdeasScreen() {
  const [ideas, setIdeas] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const quizAnswers = JSON.parse(localStorage.getItem('quizAnswers') || '[]');
    const prompts = JSON.parse(localStorage.getItem('prompts') || '{}');

    const profile = `Personality: ${quizAnswers.join(', ')}\nBuilt/fixed: ${prompts.q1}\nChallenge: ${prompts.q2}\nHelped: ${prompts.q3}`;

    const fetchIdeas = async () => {
      const res = await fetch("https://pleasant-rooster-illegally.ngrok-free.app/api/ideas", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile })
      });
      const data = await res.json();
      setIdeas(data.ideas);
    };

    fetchIdeas();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Step 3: Suggested Essay Topics</h2>
      <pre className="bg-beige p-4 rounded whitespace-pre-wrap text-sm">{ideas || 'Loading suggestions...'}</pre>
      <Button className="mt-6" onClick={() => navigate('/compare')}>Next</Button>
    </motion.div>
  );
}
