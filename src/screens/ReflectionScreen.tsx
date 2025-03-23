// src/screens/ReflectionScreen.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function ReflectionScreen() {
  const [q1, setQ1] = useState('');
  const [q2, setQ2] = useState('');
  const [q3, setQ3] = useState('');
  const navigate = useNavigate();

  const handleNext = () => {
    localStorage.setItem("reflections", JSON.stringify({ q1, q2, q3 }));
    navigate("/stories");
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">🪞 Reflect on Your Experiences</h2>
      <Textarea placeholder="A time you led or motivated others" value={q1} onChange={(e) => setQ1(e.target.value)} className="mb-4" />
      <Textarea placeholder="A meaningful challenge you overcame" value={q2} onChange={(e) => setQ2(e.target.value)} className="mb-4" />
      <Textarea placeholder="A time you made someone’s life better" value={q3} onChange={(e) => setQ3(e.target.value)} className="mb-4" />
      <Button disabled={!q1 || !q2 || !q3} onClick={handleNext}>Get Stories</Button>
    </motion.div>
  );
}
