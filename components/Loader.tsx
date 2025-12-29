"use client";

import React, { useState, useEffect } from "react";

const quotes = [
  "The sky is a mirror",
  "Time flows like water",
  "Stars whisper secrets",
  "Night holds the truth",
  "Moonlight reveals all",
  "Darkness brings clarity",
  "Cosmos guides the way",
  "Silence speaks volumes",
];

const Loader = () => {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setCurrentQuote((prev) => (prev + 1) % quotes.length);
        setFade(true);
      }, 300);
    }, 2500);

    return () => clearInterval(quoteInterval);
  }, []);

  return (
    <>
      <style>{`
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .moon-rotating {
          animation: rotate 3s linear infinite;
        }
        .moon-container {
          position: relative;
          width: 120px;
          height: 120px;
        }
      `}</style>
      <div className="fixed inset-0 bg-[#f7f7f7] flex flex-col items-center justify-center z-50">
        <div className="moon-container mb-8">
          <img
            src="/icons/11.png"
            alt="Moon"
            className="moon-image moon-rotating w-full h-full object-contain"
          />
          <div className="moon-grain-overlay" />
        </div>
        <p
          className={`text-gray-600 text-lg cormorant transition-opacity duration-500 ${
            fade ? "opacity-100" : "opacity-0"
          }`}
        >
          {quotes[currentQuote]}
        </p>
      </div>
    </>
  );
};

export default Loader;
