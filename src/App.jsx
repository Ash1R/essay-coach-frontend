import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home.jsx';
import Questions from './pages/Questions.jsx';
import Suggestions from './pages/Suggestions.jsx';
import Editor from './pages/Editor.jsx';
import './index.css';


export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/suggestions" element={<Suggestions />} />
        <Route path="/editor" element={<Editor />} />
      </Routes>
    </Router>
  );
}
