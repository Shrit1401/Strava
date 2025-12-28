"use client";

import { useEffect, useState } from "react";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  opacity: number;
  twinkleDelay: number;
  duration: number;
  glow: number;
}

const StarryBackground = () => {
  const [stars, setStars] = useState<Star[]>([]);

  useEffect(() => {
    const generateStars = () => {
      const starCount = 250;
      const newStars: Star[] = [];

      for (let i = 0; i < starCount; i++) {
        const isBright = Math.random() < 0.15;
        const baseSize = isBright ? Math.random() * 3 + 1.5 : Math.random() * 2 + 0.5;
        const baseOpacity = isBright ? Math.random() * 0.4 + 0.6 : Math.random() * 0.5 + 0.3;
        
        newStars.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: baseSize,
          opacity: baseOpacity,
          twinkleDelay: Math.random() * 3,
          duration: 2 + Math.random() * 2,
          glow: isBright ? Math.random() * 3 + 2 : Math.random() * 1.5 + 0.5,
        });
      }

      setStars(newStars);
    };

    generateStars();
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="absolute rounded-full bg-white star-twinkle"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            opacity: star.opacity,
            animationDuration: `${star.duration}s`,
            animationDelay: `${star.twinkleDelay}s`,
            boxShadow: `0 0 ${star.glow}px ${star.glow * 0.5}px rgba(255, 255, 255, ${star.opacity * 0.8})`,
            filter: 'blur(0.3px)',
          }}
        />
      ))}
      <div
        className="absolute inset-0 noise-animate"
        style={{
          backgroundImage: 'url(/noise.png)',
          backgroundSize: '200px 200px',
          backgroundRepeat: 'repeat',
          imageRendering: 'pixelated',
          opacity: 0.7,
          mixBlendMode: 'screen',
        }}
      />
    </div>
  );
};

export default StarryBackground;

