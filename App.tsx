import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Play from './pages/Play';
import Admin from './pages/Admin';
import Results from './pages/Results';
import Presenter from './pages/Presenter';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-slate-100 font-sans text-slate-900">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/play" element={<Play />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/results" element={<Results />} />
            <Route path="/presenter" element={<Presenter />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;