import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide nav on gallery page for immersion
  if (location.pathname.startsWith('/gallery')) {
    return null;
  }

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bottom-nav">
      <button
        onClick={() => navigate('/')}
        className={`nav-btn ${isActive('/') ? 'nav-active' : 'nav-inactive'}`}
      >
        <Home size={24} strokeWidth={isActive('/') ? 2.5 : 2} />
        <span>Home</span>
      </button>

      <button
        onClick={() => navigate('/create')}
        className={`nav-btn ${isActive('/create') ? 'nav-active' : 'nav-inactive'}`}
      >
        <PlusCircle size={32} strokeWidth={isActive('/create') ? 2.5 : 1.5} className={isActive('/create') ? "text-purple" : ""} />
        <span>Plus</span>
      </button>
    </nav>
  );
};
