import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowLeft, Download, Maximize2, Minimize2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Gallery: React.FC = () => {
  const { boardId } = useParams<{ boardId: string }>();
  const navigate = useNavigate();
  const { boards } = useApp();
  
  const board = boards.find(b => b.id === boardId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    // Preload next/prev images
    if (board) {
      const nextIndex = (currentIndex + 1) % board.images.length;
      const prevIndex = (currentIndex - 1 + board.images.length) % board.images.length;
      const img1 = new Image();
      const img2 = new Image();
      img1.src = board.images[nextIndex].url;
      img2.src = board.images[prevIndex].url;
    }
  }, [currentIndex, board]);

  if (!board) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-white" style={{ minHeight: '100vh', backgroundColor: 'black' }}>
        <p style={{ fontSize: '1.125rem' }}>Board not found.</p>
        <button onClick={() => navigate('/')} style={{ marginTop: '1rem', color: '#60a5fa', background: 'none', border: 'none', cursor: 'pointer' }}>Go Home</button>
      </div>
    );
  }

  const handleNext = () => {
    setDirection(1);
    setIsZoomed(false); // Reset zoom on navigate
    setCurrentIndex((prev) => (prev + 1) % board.images.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setIsZoomed(false); // Reset zoom on navigate
    setCurrentIndex((prev) => (prev - 1 + board.images.length) % board.images.length);
  };

  const handleDownload = async () => {
    const currentImage = board.images[currentIndex];
    try {
      const response = await fetch(currentImage.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ria-image-${board.humanName}-${currentIndex}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <div className="gallery-overlay">
      {/* Top Bar */}
      <div className="gallery-top">
        <button 
          onClick={() => navigate('/')} 
          className="icon-btn"
        >
          <ArrowLeft size={24} />
        </button>
        
        <div className="gallery-title-box">
          <h2 className="gallery-title">{board.humanName}</h2>
          <p className="gallery-counter">{currentIndex + 1} / {board.images.length}</p>
        </div>

        <button 
          onClick={handleDownload}
          className="icon-btn"
        >
          <Download size={24} />
        </button>
      </div>

      {/* Main Image View */}
      <div className="gallery-main">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            className="absolute inset-0 flex items-center justify-center cursor-grab active:cursor-grabbing"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = Math.abs(offset.x) * velocity.x;

              if (swipe < -100 || offset.x < -100) {
                handleNext();
              } else if (swipe > 100 || offset.x > 100) {
                handlePrev();
              }
            }}
          >
             <div 
              style={{ 
                position: 'relative', 
                transition: 'transform 0.3s ease-out',
                transform: isZoomed ? 'scale(2)' : 'scale(1)',
                cursor: isZoomed ? 'zoom-out' : 'zoom-in'
              }}
              onClick={() => setIsZoomed(!isZoomed)}
             >
                <img
                  src={board.images[currentIndex].url}
                  alt={`${board.humanName} - ${currentIndex}`}
                  style={{ maxWidth: '100%', maxHeight: '100vh', objectFit: 'contain', userSelect: 'none' }}
                  draggable={false}
                />
             </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation Areas */}
        <div 
          className="nav-arrow nav-arrow-left hidden sm:flex"
          onClick={(e) => { e.stopPropagation(); handlePrev(); }}
        >
           <ChevronLeft color="white" size={40} />
        </div>
        <div 
          className="nav-arrow nav-arrow-right hidden sm:flex"
          onClick={(e) => { e.stopPropagation(); handleNext(); }}
        >
            <ChevronRight color="white" size={40} />
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="gallery-bottom">
        <button
          onClick={() => setIsZoomed(!isZoomed)}
          className="zoom-btn"
        >
          {isZoomed ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          {isZoomed ? 'Reset' : 'Zoom'}
        </button>
      </div>
    </div>
  );
};
