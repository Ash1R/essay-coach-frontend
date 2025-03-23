// src/screens/AnswerCompareScreen.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export function AnswerCompareScreen() {
  const [oldDraft, setOldDraft] = useState('');
  const [newDraft, setNewDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const compareDrafts = async () => {
    setLoading(true);
    const res = await fetch("https://pleasant-rooster-illegally.ngrok-free.app/api/compare-drafts", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldDraft, newDraft }),
    });

    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }} className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">🔍 Compare Two Answers</h2>
      <Textarea placeholder="Old Version" value={oldDraft} onChange={(e) => setOldDraft(e.target.value)} className="mb-4" />
      <Textarea placeholder="New Version" value={newDraft} onChange={(e) => setNewDraft(e.target.value)} className="mb-4" />
      <Button onClick={compareDrafts} disabled={!oldDraft || !newDraft || loading}>{loading ? "Comparing..." : "Compare"}</Button>
      <pre className="mt-4 bg-beige p-4 whitespace-pre-wrap text-sm rounded">{feedback}</pre>
    </motion.div>
  );
}
