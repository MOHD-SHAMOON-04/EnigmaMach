import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Enigma from './pages/Enigma';
import NotFound from './pages/NotFound';
import Header from './components/Header';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-200 font-sans">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enigma" element={<Enigma />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App;