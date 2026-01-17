import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Board, AppState } from '../types';

const AppContext = createContext<AppState | undefined>(undefined);

const INITIAL_DATA: Board[] = [
  {
    id: '1',
    humanName: 'Neon Nights',
    description: 'Cyberpunk vibes from the downtown district.',
    createdAt: Date.now(),
    images: [
      { id: 'img1', url: 'https://picsum.photos/800/1200?random=1' },
      { id: 'img2', url: 'https://picsum.photos/800/1200?random=2' },
      { id: 'img3', url: 'https://picsum.photos/800/1200?random=3' },
    ],
  },
  {
    id: '2',
    humanName: 'Nature Zen',
    description: 'Peaceful moments in the wild.',
    createdAt: Date.now() - 100000,
    images: [
      { id: 'img4', url: 'https://picsum.photos/800/1200?random=4' },
      { id: 'img5', url: 'https://picsum.photos/800/1200?random=5' },
    ],
  },
  {
    id: '3',
    humanName: 'Urban Decay',
    description: 'Textures of the old city.',
    createdAt: Date.now() - 200000,
    images: [
      { id: 'img6', url: 'https://picsum.photos/800/1200?random=6' },
      { id: 'img7', url: 'https://picsum.photos/800/1200?random=7' },
      { id: 'img8', url: 'https://picsum.photos/800/1200?random=8' },
      { id: 'img9', url: 'https://picsum.photos/800/1200?random=9' },
    ],
  },
];

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [boards, setBoards] = useState<Board[]>(() => {
    // Try to load from local storage to persist created boards
    const saved = localStorage.getItem('ria_boards');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('ria_boards', JSON.stringify(boards));
  }, [boards]);

  const addBoard = (board: Board) => {
    setBoards((prev) => [board, ...prev]);
  };

  return (
    <AppContext.Provider value={{ boards, addBoard }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
