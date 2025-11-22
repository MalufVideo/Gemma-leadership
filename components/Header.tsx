import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();
  const isGame = location.pathname === '/play';

  if (isGame) return null; // Don't show standard header during gameplay for immersion

  return (
    <nav className="bg-brand-900 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          GemmaConsult
        </Link>
        <div className="flex gap-4 text-sm font-medium">
          <Link to="/results" className="hover:text-brand-500 transition-colors">Resultados</Link>
          <Link to="/admin" className="hover:text-brand-500 transition-colors">Admin</Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;