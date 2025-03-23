import { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { motion } from 'framer-motion';
import Highlight from '@tiptap/extension-highlight';


const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function Editor() {
  const [review, setReview] = useState('');
  const [reference, setReference] = useState('');
  const [reviewLoading, setReviewLoading] = useState(false);
  const [highlightLoading, setHighlightLoading] = useState(false);
  const [speechLoading, setSpeechLoading] = useState(false);


  const oldDraftRef = useRef('');
  const finalTranscriptRef = useRef('');

  const editor = useEditor({
    extensions: [StarterKit, Highlight],
    content: '<p>Your story starts here...</p>',
  });

  // Load reference suggestion
  useEffect(() => {
    const stored = localStorage.getItem('selectedSuggestion');
    if (stored) setReference(stored);
  }, []);

  // Save old draft when editor initializes
  useEffect(() => {
    oldDraftRef.current = editor?.getText() || '';
  }, [editor]);

  const handleReview = async () => {
    const newDraft = editor?.getText() || '';
    const oldDraft = oldDraftRef.current;
//help
    setReviewLoading(true);
    try {
      const res = await fetch('https://6c60-128-84-124-174.ngrok-free.app/api/compare-drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldDraft, newDraft }),
      });

      const data = await res.json();
      setReview(data.feedback || 'No feedback returned.');
    } catch (err) {
      console.error('Review error:', err);
      setReview('Something went wrong. Try again.');
    } finally {
      setReviewLoading(false);
      oldDraftRef.current = newDraft;
    }
  };

  const [highlightedIssues, setHighlightedIssues] = useState([]);

const highlightErrors = async () => {
  const text = editor?.getText() || '';
  setHighlightLoading(true);
  setHighlightedIssues([]);

  try {
    const res = await fetch('https://6c60-128-84-124-174.ngrok-free.app/api/interview-review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transcript: text }),
    });

    const data = await res.json();
    const highlights = data.highlights || [];

    let updatedHTML = editor.getHTML();

    highlights.forEach(({ phrase, message }, i) => {
      const regex = new RegExp(`(${phrase})`, 'i');
      updatedHTML = updatedHTML.replace(
        regex,
        `<mark title="${message}" class="highlight-${i} bg-yellow-200">${phrase}</mark>`
      );
    });

    editor?.commands.setContent(updatedHTML);
    setHighlightedIssues(highlights);
  } catch (err) {
    console.error('Highlighting error:', err);
  } finally {
    setHighlightLoading(false);
  }
};

  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

const startSpeechToText = () => {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Speech recognition not supported in this browser.');
    return;
  }

  const recognition = new window.webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  let transcriptBuffer = '';

  recognition.onstart = () => {
    setIsRecording(true);
    setSpeechLoading(true);
    console.log('Speech recognition started');
  };

  recognition.onresult = (event) => {
    const transcript = Array.from(event.results)
      .map(result => result[0].transcript)
      .join(' ');

    transcriptBuffer += transcript + ' ';
  };

  recognition.onend = () => {
    if (transcriptBuffer.trim()) {
      editor?.commands.insertContent(`<p>${transcriptBuffer.trim()}</p>`);
    }
    setIsRecording(false);
    setSpeechLoading(false);
    console.log('Speech recognition ended');
  };

  recognition.onerror = (event) => {
    console.error('Speech recognition error:', event.error);
    setIsRecording(false);
    setSpeechLoading(false);
  };

  recognition.start();
  recognitionRef.current = recognition;
};

const stopSpeechToText = () => {
  recognitionRef.current?.stop();
  setIsRecording(false);
};

  return (
    <div className="min-h-screen bg-beige text-charcoal font-body px-6 py-10 flex flex-col items-center">
      <motion.h2
        className="text-4xl font-display font-bold mb-8 text-center"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Draft
      </motion.h2>

      <div className="w-full max-w-4xl space-y-6">
        {reference && (
          <div className="mb-4 bg-white border border-charcoal/20 rounded-lg p-4 shadow-sm text-sm italic">
            <p className="text-charcoal/80">💡 Reference Suggestion:</p>
            <p className="mt-1 whitespace-pre-wrap">{reference}</p>
          </div>
        )}

        <div className="rounded-lg border border-charcoal/20 bg-white shadow-md p-4">
          <EditorContent
            editor={editor}
            className="w-full resize-y prose prose-lg max-w-none [&_.ProseMirror]:min-h-[500px] [&_.ProseMirror]:h-full [&_.ProseMirror]:outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:gap-4 gap-2">
          <button
            onClick={handleReview}
            disabled={reviewLoading}
            className="px-6 py-3 bg-charcoal text-beige text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition"
          >
            {reviewLoading ? 'Thinking…' : 'Ask AI to Review'}
          </button>

          <button
            onClick={highlightErrors}
            disabled={highlightLoading}
            className="px-6 py-3 bg-charcoal text-beige text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition"
          >
            {highlightLoading ? 'Analyzing…' : 'Highlight Issues'}
          </button>

         {!isRecording ? (
  <button
    onClick={startSpeechToText}
    disabled={speechLoading}
    className="px-6 py-3 bg-charcoal text-beige text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition"
  >
    🎤 Start Speaking
  </button>
) : (
  <button
    onClick={stopSpeechToText}
    className="px-6 py-3 bg-red-600 text-white text-lg font-medium rounded-full shadow hover:shadow-md hover:bg-opacity-90 transition"
  >
    ⏹️ Stop Listening
  </button>
)}
        </div>

        {highlightedIssues.length > 0 && (
  <div className="bg-white border border-charcoal/10 p-6 rounded-lg shadow space-y-4">
    <h3 className="text-xl font-display font-semibold mb-4">Highlighted Suggestions</h3>
    <ul className="list-disc pl-4 space-y-2">
      {highlightedIssues.map((issue, i) => (
        <li key={i}>
          <strong className="text-charcoal">{issue.phrase}:</strong>{' '}
          <span className="text-charcoal/80">{issue.message}</span>
        </li>
      ))}
    </ul>
  </div>
)}

        {review && (
          <div className="bg-white border border-charcoal/10 p-6 rounded-lg shadow whitespace-pre-wrap">
            <h3 className="text-xl font-display font-semibold mb-2">AI Feedback</h3>
            <p>{review}</p>
          </div>
        )}
      </div>
    </div>
  );
}
