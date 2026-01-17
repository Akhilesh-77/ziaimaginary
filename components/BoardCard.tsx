import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Board } from '../types';
import { ArrowRight, Images } from 'lucide-react';

interface BoardCardProps {
  board: Board;
}

export const BoardCard: React.FC<BoardCardProps> = ({ board }) => {
  const navigate = useNavigate();
  const mainImage = board.images[0]?.url;

  return (
    <div className="board-card">
      {/* Image Preview Area */}
      <div className="card-image-wrapper">
        {mainImage ? (
          <img
            src={mainImage}
            alt={board.humanName}
            className="card-image"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-500">
            <Images size={48} color="#525252" />
          </div>
        )}
        
        <div className="count-badge">
          <Images size={12} color="white" />
          <span className="count-text">{board.images.length}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="card-content">
        <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
          <h3 className="card-title">{board.humanName}</h3>
        </div>
        
        {board.description && (
          <p className="card-desc">{board.description}</p>
        )}

        <button
          onClick={() => navigate(`/gallery/${board.id}`)}
          className="btn-view-more"
        >
          View More <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
