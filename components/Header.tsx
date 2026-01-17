import React from 'react';
import { Camera } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="flex items-center" style={{ gap: '0.5rem' }}>
        <div className="logo-box">
             <Camera size={18} className="text-white" color="white" />
        </div>
        <h1 className="app-title">
          VR.ai
        </h1>
      </div>
    </header>
  );
};
