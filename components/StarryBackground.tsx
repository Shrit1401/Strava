"use client";

const StarryBackground = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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

