import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Enigma from './pages/Enigma';
import NotFound from './pages/NotFound';
import NewMachine from './pages/NewMachine';

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen bg-zinc-900 text-gray-200 font-sans">
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enigma/:machineId?" element={<Enigma />} />
        <Route path="/new-machine" element={<NewMachine />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;