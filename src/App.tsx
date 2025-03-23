import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Questions from './pages/Questions';
import Suggestions from './pages/Suggestions';
import Editor from './pages/Editor';
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
