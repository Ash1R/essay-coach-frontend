// CompareScreen.tsx - Step 4: Compare Drafts
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function CompareScreen() {
  const [oldDraft, setOldDraft] = useState('');
  const [newDraft, setNewDraft] = useState('');
  const [feedback, setFeedback] = useState('');
  const [loading, setLoading] = useState(false);

  const compareDrafts = async () => {
    setLoading(true);
    const res = await fetch('/api/compare-drafts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oldDraft, newDraft })
    });
    const data = await res.json();
    setFeedback(data.feedback);
    setLoading(false);
  };

  return (
    <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }} transition={{ duration: 0.5 }} className="bg-white rounded-xl p-6 shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Step 4: Compare Essay Drafts</h2>
      <Textarea placeholder="Old Draft" value={oldDraft} onChange={(e) => setOldDraft(e.target.value)} className="mb-4" />
      <Textarea placeholder="New Draft" value={newDraft} onChange={(e) => setNewDraft(e.target.value)} className="mb-4" />
      <Button onClick={compareDrafts} disabled={!oldDraft || !newDraft || loading}>{loading ? 'Comparing...' : 'Compare Drafts'}</Button>
      <pre className="bg-beige p-4 mt-6 rounded whitespace-pre-wrap text-sm">{feedback}</pre>
    </motion.div>
  );
}
