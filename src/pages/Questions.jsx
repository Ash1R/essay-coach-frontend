import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const initialQuestions = [
  {
    id: 0,
    type: 'text',
    q: 'Is there any prompt that you are trying to answer in particular? (optional)',
    noFollowup: true,
  },
  { id: 1, type: 'multi', q: 'Pick something you’ve done recently:', options: ['Helped a friend', 'Learned something new', 'Solved a problem', 'Tried something hard'] },
  { id: 2, type: 'multi', q: 'Which word feels most like you?', options: ['Curious', 'Kind', 'Focused', 'Creative'] },
  { id: 3, type: 'text', q: "What's something you're into right now? (A class, hobby, show, etc.)" },
  { id: 4, type: 'multi', q: 'Pick a strength you’re proud of:', options: ['Thinking deeply', 'Getting things done', 'Caring about people', 'Being original'] },
  { id: 5, type: 'text', q: "Write a short sentence about a time you felt accomplished." },
  { id: 6, type: 'multi', q: 'How do you usually learn best?', options: ['By doing', 'By watching', 'By explaining', 'By trying and failing'] },
  { id: 7, type: 'text', q: "Any little moment that’s stuck with you? (recent or old — just a sentence)" },
];

export default function Questions() {
  const [questions, setQuestions] = useState(initialQuestions);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [debounceTimers, setDebounceTimers] = useState({});

  const handleChange = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value }));

    const question = questions.find(q => q.id === id);
    if (question?.type !== 'text' || question?.noFollowup) return;

    if (debounceTimers[id]) clearTimeout(debounceTimers[id]);

    const newTimer = setTimeout(async () => {
      const alreadyFollowedUp = questions.some(q => q.id === id + 0.5);
      if (alreadyFollowedUp) return;

      try {
        const res = await fetch('https://6c60-128-84-124-174.ngrok-free.app/api/followup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: question?.q || '',
            answer: value,
          }),
        });

        const data = await res.json();
        const followUp = {
          id: id + 0.5,
          type: 'text',
          q: data.followup || 'Can you tell me more about that?',
        };

        const insertIndex = questions.findIndex(q => q.id === id) + 1;
        setQuestions(prev => [
          ...prev.slice(0, insertIndex),
          followUp,
          ...prev.slice(insertIndex),
        ]);
      } catch (err) {
        console.error('Failed to fetch follow-up:', err);
      }
    }, 1000);

    setDebounceTimers(prev => ({ ...prev, [id]: newTimer }));
  };

  const handleNext = async () => {
    setLoading(true);
    try {
      const prompt = answers[0];
      const reflections = { ...answers };
      delete reflections[0];

      const res = await fetch('https://6c60-128-84-124-174.ngrok-free.app/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          reflections: JSON.stringify(reflections),
        }),
      });

      localStorage.setItem('rawAnswers', JSON.stringify(reflections));
      if (prompt) localStorage.setItem('userPrompt', prompt);
      navigate('/suggestions');
    } catch (err) {
      console.error('Failed to fetch suggestions:', err);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-beige text-charcoal font-body px-6 py-10">
      <div className="max-w-3xl mx-auto space-y-10">
        <motion.h2
          className="text-4xl font-display font-bold text-center"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Tell us about yourself
        </motion.h2>

        {questions.map((q, index) => (
          <motion.div
            key={q.id}
            className="space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            <p className="text-lg font-medium">{q.q}</p>
            {q.type === 'text' ? (
              <textarea
                className="w-full p-3 border border-charcoal rounded-lg focus:outline-none focus:ring-2 focus:ring-charcoal/50 transition"
                rows="4"
                placeholder="Your answer..."
                onChange={e => handleChange(q.id, e.target.value)}
              />
            ) : (
              <div className="flex flex-wrap gap-3">
                {q.options.map(opt => (
                  <button
                    key={opt}
                    onClick={() => handleChange(q.id, opt)}
                    className={`px-4 py-2 rounded-full border font-medium transition ${
                      answers[q.id] === opt
                        ? 'bg-charcoal text-beige'
                        : 'bg-white text-charcoal hover:bg-charcoal/10'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        ))}

        <div className="text-center pt-6">
          <button
            onClick={handleNext}
            disabled={loading}
            className={`px-8 py-3 text-lg font-semibold rounded-full shadow transition ${
              loading
                ? 'bg-charcoal/50 text-beige cursor-not-allowed'
                : 'bg-charcoal text-beige hover:shadow-md hover:bg-opacity-90'
            }`}
          >
            {loading ? 'Thinking…' : 'See Suggestions →'}
          </button>
        </div>
      </div>
    </div>
  );
}
