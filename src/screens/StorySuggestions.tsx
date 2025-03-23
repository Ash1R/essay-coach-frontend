// src/screens/StorySuggestions.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export function StorySuggestions() {
  const [stories, setStories] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStories = async () => {
      const reflections = JSON.parse(localStorage.getItem("reflections") || "{}");
      const traits = JSON.parse(localStorage.getItem("traits") || "[]");

      const profile = `Personality Traits: ${traits.join(", ")}\n\nReflections:\n${reflections.q1}\n${reflections.q2}\n${reflections.q3}`;

      try {
        const res = await fetch("https://pleasant-rooster-illegally.ngrok-free.app/api/stories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile })
        });

        if (!res.ok) throw new Error("API error");
        const data = await res.json();
        setStories(data.stories);
      } catch (err) {
        setStories("⚠️ Failed to load suggestions.");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">💡 Interview-Ready Stories</h2>
      <pre className="whitespace-pre-wrap text-sm bg-beige p-4 rounded">{loading ? "Loading..." : stories}</pre>
      <Button className="mt-4" onClick={() => navigate('/compare')}>Compare Drafts</Button>
    </motion.div>
  );
}
