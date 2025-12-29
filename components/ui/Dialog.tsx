"use client";

import { useEffect, useState } from "react";

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  category: string;
  children: React.ReactNode;
}

export const Dialog = ({
  isOpen,
  onClose,
  title,
  category,
  children,
}: DialogProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setIsAnimating(true), 10);
    } else {
      setIsAnimating(false);
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={onClose}
    >
      <div
        className={`fixed inset-0 bg-gray-200 transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative bg-white w-full max-w-4xl mx-6 max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-black/5 px-10 py-8 flex items-start justify-between z-10">
          <div className="space-y-2">
            <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
              {category}
            </p>
            <h2 className="cormorant text-4xl font-light text-black">
              {title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-black/40 cursor-pointer hover:text-black transition-colors text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="px-10 py-10 text-base text-black/70 leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
};
