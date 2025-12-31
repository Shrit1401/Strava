"use client";

import React, { useState, useEffect } from "react";
import StarryBackground from "@/components/StarryBackground";
import Image from "next/image";
import TransitChart from "@/components/TransitChart";
import { getRandomIcon } from "@/utils/astrology";

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

type Category = "SELF" | "LOVE" | "WORK" | "SOCIAL";

const categories: {
  id: Category;
  label: string;
  questions: string[];
}[] = [
  {
    id: "SELF",
    label: "SELF",
    questions: [
      "WHO AM I?",
      "WHAT DO I REALLY WANT?",
      "AM I HAPPY?",
      "WHAT AM I AFRAID OF?",
      "DO I LOVE MYSELF?",
      "WHAT IS MY PURPOSE?",
      "AM I BEING AUTHENTIC?",
      "WHAT DO I NEED TO LET GO OF?",
    ],
  },
  {
    id: "LOVE",
    label: "LOVE",
    questions: [
      "AM I READY FOR LOVE?",
      "WHAT AM I LOOKING FOR IN A PARTNER?",
      "DO I DESERVE LOVE?",
      "AM I IN THE RIGHT RELATIONSHIP?",
      "WHAT IS BLOCKING ME FROM LOVE?",
      "DO I LOVE MYSELF ENOUGH?",
      "WHAT PATTERNS AM I REPEATING?",
      "AM I OPEN TO RECEIVING LOVE?",
    ],
  },
  {
    id: "WORK",
    label: "WORK",
    questions: [
      "AM I FULFILLED IN MY CAREER?",
      "WHAT IS MY CALLING?",
      "AM I LIVING UP TO MY POTENTIAL?",
      "DO I NEED TO CHANGE JOBS?",
      "WHAT AM I AVOIDING?",
      "AM I BEING PAID WHAT I'M WORTH?",
      "WHAT SKILLS DO I NEED TO DEVELOP?",
      "IS MY WORK ALIGNED WITH MY VALUES?",
    ],
  },
  {
    id: "SOCIAL",
    label: "SOCIAL",
    questions: [
      "IS THIS THE YEAR TO LET SOME FRIENDSHIPS GO?",
      "DO I HAVE TOO MANY FRIENDS?",
      "DO I LIKE MY FRIENDS?",
      "AM I COOL?",
      "ARE PEOPLE TALKING ABOUT ME?",
      "DO PEOPLE BELIEVE IN ME?",
      "AM I THE BABY OF THE GROUP?",
      "IS MY FRIEND GROUP RIGHT FOR ME?",
    ],
  },
];

const AskPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("SOCIAL");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [inputValue, setInputValue] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [transit, setTransit] = useState<{
    planet1: { name: string; longitude: number; icon: string };
    planet2: { name: string; longitude: number; icon: string };
    aspect: { type: string; angle: number };
  } | null>(null);
  const [categoryIcons, setCategoryIcons] = useState<Record<Category, string>>({
    SELF: "",
    LOVE: "",
    WORK: "",
    SOCIAL: "",
  });

  useEffect(() => {
    setCategoryIcons({
      SELF: getRandomIcon(),
      LOVE: getRandomIcon(),
      WORK: getRandomIcon(),
      SOCIAL: getRandomIcon(),
    });
  }, []);

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);

  const handleSubmit = async () => {
    if (inputValue.trim()) {
      setCurrentQuestion(inputValue.trim());
      setIsDialogOpen(true);
      setIsLoading(true);
      setAnswer("");
      setTransit(null);

      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ question: inputValue.trim() }),
        });

        if (response.ok) {
          const data = await response.json();
          setAnswer(data.answer);
          setTransit(data.transit);
        } else {
          setAnswer(
            "The stars are aligning to reveal insights. Trust the process."
          );
        }
      } catch (error) {
        console.error("Error fetching answer:", error);
        setAnswer(
          "The stars are aligning to reveal insights. Trust the process."
        );
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="relative bg-black text-white flex-1 flex flex-col overflow-hidden pt-14">
      <StarryBackground />

      <div className="relative z-10 flex flex-col flex-1 min-h-0">
        <div className="flex items-center justify-center gap-4 px-6 py-6 shrink-0">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedQuestionIndex(0);
                setInputValue("");
              }}
              className={`flex flex-col items-center gap-2 cursor-pointer transition-all duration-300 px-4 py-2 rounded ${
                selectedCategory === category.id
                  ? "opacity-100 border border-white/30"
                  : "opacity-50 hover:opacity-70"
              }`}
            >
              <Image
                src={categoryIcons[category.id] || "/icons/1.png"}
                alt={category.label}
                width={24}
                height={24}
                className="object-contain filter brightness-0 invert"
              />
              <span className="text-xs uppercase tracking-wider font-light">
                {category.label}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto scroll-smooth pb-32">
          <div className="flex flex-col items-center justify-center py-8 px-6">
            <div className="w-full max-w-2xl space-y-6">
              {currentCategory?.questions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setSelectedQuestionIndex(index);
                    setInputValue(question);
                  }}
                  className={`w-full text-center text-white text-lg uppercase tracking-wide cursor-pointer transition-all duration-300 py-4 group ${"opacity-60 hover:opacity-90"}`}
                >
                  <span className="font-light underline decoration-white/30 group-hover:decoration-white/50">
                    {question}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 border-t border-white/10 px-6 py-4 pb-20 flex items-center justify-center bg-black/90 backdrop-blur-sm z-[60]">
          <div className="w-full max-w-2xl flex items-center gap-4">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="ASK ANYTHING..."
              className="flex-1 bg-transparent border-b border-white/20 px-0 py-2 text-white text-sm uppercase tracking-wider placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-white/40 transition-all duration-300 text-center"
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  handleSubmit();
                }
              }}
            />
            <button
              onClick={handleSubmit}
              className="px-6 py-2 text-black text-sm uppercase bg-white tracking-wider border border-white/20 hover:border-white/40 hover:bg-white/50 transition-all duration-300 font-light cursor-pointer"
            >
              LET'S GO
            </button>
          </div>
        </div>
      </div>

      {isDialogOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          onClick={() => {
            setIsDialogOpen(false);
            setIsLoading(false);
          }}
        >
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
          <div
            className="relative bg-black border border-white/10 w-full max-w-3xl mx-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
            style={{
              boxShadow:
                "0 0 60px rgba(255, 255, 255, 0.03), inset 0 0 100px rgba(255, 255, 255, 0.01)",
            }}
          >
            <style>{`
              @keyframes noise-move {
                0% { backgroundPosition: 0 0; }
                100% { backgroundPosition: 200px 200px; }
              }
              .noise-animated {
                animation: noise-move 20s linear infinite;
              }
            `}</style>
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.15] noise-animated"
              style={{
                backgroundImage: "url(/noise.png)",
                backgroundSize: "200px 200px",
                backgroundRepeat: "repeat",
                imageRendering: "pixelated",
                mixBlendMode: "screen",
              }}
            />
            <div
              className="absolute inset-0 pointer-events-none opacity-[0.06]"
              style={{
                backgroundImage: "url(/noise.png)",
                backgroundSize: "150px 150px",
                backgroundRepeat: "repeat",
                imageRendering: "pixelated",
                mixBlendMode: "overlay",
              }}
            />
            {isLoading ? (
              <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-8 relative z-10">
                <style>{`
                  @keyframes rotate {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                  }
                  @keyframes pulse-glow {
                    0%, 100% { filter: brightness(1) drop-shadow(0 0 10px rgba(255, 255, 255, 0.1)); }
                    50% { filter: brightness(1.2) drop-shadow(0 0 20px rgba(255, 255, 255, 0.2)); }
                  }
                  .moon-rotating {
                    animation: rotate 3s linear infinite;
                  }
                  .moon-glow {
                    animation: pulse-glow 3s ease-in-out infinite;
                  }
                `}</style>
                <div className="relative mb-8">
                  <div className="w-24 h-24 moon-glow">
                    <Image
                      src={getRandomIcon()}
                      alt="Moon"
                      width={96}
                      height={96}
                      className="moon-rotating w-full h-full object-contain filter brightness-0 invert"
                    />
                  </div>
                </div>
                <p className="text-white text-lg font-light tracking-wide uppercase animate-pulse">
                  Reading the stars...
                </p>
              </div>
            ) : (
              <div className="py-12 px-8 relative z-10 animate-in fade-in duration-700">
                <div className="flex items-start justify-between mb-8">
                  <div className="flex-1">
                    <p className="text-xs uppercase tracking-wider text-white/60 mb-2 font-light">
                      {selectedCategory}
                    </p>
                    <h2 className="text-2xl uppercase tracking-wide text-white font-light leading-tight">
                      {currentQuestion}
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setIsDialogOpen(false);
                      setIsLoading(false);
                    }}
                    className="text-white/60 hover:text-white transition-all duration-300 text-3xl leading-none cursor-pointer hover:scale-110"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {transit && (
                  <div className="mb-12 flex justify-center">
                    <div className="w-full max-w-md relative">
                      <div
                        className="absolute inset-0 pointer-events-none opacity-20"
                        style={{
                          backgroundImage:
                            "radial-gradient(circle at center, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
                        }}
                      />
                      <TransitChart
                        planet1={transit.planet1}
                        planet2={transit.planet2}
                        aspect={transit.aspect}
                        size={400}
                      />
                    </div>
                  </div>
                )}

                {answer && (
                  <div className="space-y-4 text-white/80 text-base leading-relaxed font-light max-w-2xl mx-auto">
                    {answer.split(". ").map((sentence, idx) => {
                      const trimmedSentence = sentence.trim();
                      if (!trimmedSentence) return null;

                      return (
                        <p
                          key={idx}
                          className={`transition-opacity duration-500 ${
                            idx === 0 ? "text-white text-lg font-medium" : ""
                          }`}
                          style={{
                            animationDelay: `${idx * 100}ms`,
                            animation: "fadeInUp 0.6s ease-out forwards",
                          }}
                        >
                          {trimmedSentence}
                          {idx < answer.split(". ").length - 1 ? "." : ""}
                        </p>
                      );
                    })}
                  </div>
                )}
                <style>{`
                  @keyframes fadeInUp {
                    from {
                      opacity: 0;
                      transform: translateY(10px);
                    }
                    to {
                      opacity: 1;
                      transform: translateY(0);
                    }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AskPage;
