import React from 'react';
import { useApp } from '../context/AppContext';
import { ReelItem } from '../components/ReelItem';
import { BoardCard } from '../components/BoardCard';

export const Home: React.FC = () => {
  const { boards } = useApp();

  // Aggregate images for the "Reels" section - take the first image of each board
  const recentItems = boards.map(board => ({
    image: board.images[0],
    boardId: board.id,
    humanName: board.humanName
  })).filter(item => item.image);

  return (
    <div className="page-padding">
      {/* Horizontal Scroll Section */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 className="section-title">Recent Highlights</h2>
        <div className="reel-container no-scrollbar">
          {recentItems.map((item) => (
            <ReelItem 
              key={`${item.boardId}-reel`} 
              image={item.image} 
              boardId={item.boardId} 
              humanName={item.humanName} 
            />
          ))}
          {/* Skeleton/Placeholder if empty */}
          {recentItems.length === 0 && (
            <div className="w-full" style={{ height: '8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#262626', borderRadius: '0.75rem', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>No recent highlights</span>
            </div>
          )}
        </div>
      </div>

      {/* Vertical Feed Section */}
      <div>
        <h2 className="section-title">Collections</h2>
        <div className="flex flex-col">
          {boards.map((board) => (
            <BoardCard key={board.id} board={board} />
          ))}
          {boards.length === 0 && (
            <div className="text-center py-20" style={{ padding: '5rem 0', color: '#737373' }}>
              <p>No boards created yet.</p>
              <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Tap "Plus" to create one.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
