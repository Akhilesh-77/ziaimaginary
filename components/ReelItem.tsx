import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageItem } from '../types';

interface ReelItemProps {
  image: ImageItem;
  boardId: string;
  humanName: string;
}

export const ReelItem: React.FC<ReelItemProps> = ({ image, boardId, humanName }) => {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/gallery/${boardId}`)}
      className="reel-item cursor-pointer"
    >
      <img
        src={image.url}
        alt={humanName}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      <div className="reel-overlay">
        <p className="reel-text">{humanName}</p>
      </div>
    </div>
  );
};
