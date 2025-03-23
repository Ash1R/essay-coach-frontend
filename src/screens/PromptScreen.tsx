// PromptScreen.tsx - Step 2: Quick Prompts
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function PromptScreen() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    const data = { q1, q2, q3 };
    localStorage.setItem('prompts', JSON.stringify(data));
    navigate('/ideas');
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Step 2: Quick Prompts</h2>
      <Textarea placeholder="Something you've built, fixed, or improved" value={q1} onChange={(e) => setQ1(e.target.value)} className="mb-4" />
      <Textarea placeholder="A challenge you've faced outside class" value={q2} onChange={(e) => setQ2(e.target.value)} className="mb-4" />
      <Textarea placeholder="A time you helped someone meaningfully" value={q3} onChange={(e) => setQ3(e.target.value)} className="mb-4" />
      <Button onClick={handleNext} disabled={!q1 || !q2 || !q3}>Next</Button>
    </motion.div>
  );
}
