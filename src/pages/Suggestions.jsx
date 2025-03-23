import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Suggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const answers = localStorage.getItem('rawAnswers');
    const prompt = localStorage.getItem('userPrompt');

    const fetchSuggestions = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            reflections: answers,
            prompt: prompt || '',
          }),
        });

        const data = await res.json();
        const raw = data.suggestions || '';

        // Split by blank lines or numbered bullets and keep full paragraphs
        const list = raw
          .split(/\n\n+/)
          .map(s => s.trim())
          .filter(Boolean);

        setSuggestions(list);
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
        setSuggestions(['Oops! Something went wrong.']);
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, []);

  return (
    <div className="min-h-screen bg-beige text-charcoal font-body px-6 py-10 flex flex-col items-center">
      <motion.h2 
        className="text-4xl font-display font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        AI Suggestions
      </motion.h2>

      {loading ? (
        <p className="text-lg italic">Thinking…</p>
      ) : (
        <motion.ul 
          className="w-full max-w-3xl space-y-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {suggestions.map((s, idx) => {
            const isActive = selected === idx;

            return (
              <motion.li
                key={idx}
                onClick={() => {
                  setSelected(idx);
                  localStorage.setItem('selectedSuggestion', s);
                }}
                className={`cursor-pointer p-6 rounded-lg border whitespace-pre-wrap transition shadow-md ${
                  isActive
                    ? 'bg-charcoal text-beige border-charcoal'
                    : 'bg-white text-charcoal border-charcoal/10 hover:bg-charcoal/5'
                }`}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
              >
                {s}
              </motion.li>
            );
          })}
        </motion.ul>
      )}

      <motion.div className="mt-10">
        <Link
          to="/editor"
          className="px-8 py-3 bg-charcoal text-beige text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition"
        >
          Start Writing →
        </Link>
      </motion.div>
    </div>
  );
}
