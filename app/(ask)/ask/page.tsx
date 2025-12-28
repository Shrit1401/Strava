"use client";

import React, { useState } from "react";
import StarryBackground from "@/components/StarryBackground";
import Image from "next/image";
import NatalChart from "@/components/NatalChart";
import { ChartData } from "@/types/chart";

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

const getSignIndex = (sign: string): number => {
  return ZODIAC_SIGNS.indexOf(sign as any);
};

const getLongitude = (sign: string, degree: number): number => {
  const signIndex = getSignIndex(sign);
  return signIndex * 30 + degree;
};

const createSampleChart = (): ChartData => {
  return {
    utc: "2025-01-01T00:00:00Z",
    planets: {
      sun: {
        longitude: getLongitude("Aries", 15),
        sign: "Aries",
        signIndex: getSignIndex("Aries"),
        degreeInsideSign: 15,
      },
      moon: {
        longitude: getLongitude("Cancer", 22),
        sign: "Cancer",
        signIndex: getSignIndex("Cancer"),
        degreeInsideSign: 22,
      },
      mercury: {
        longitude: getLongitude("Taurus", 8),
        sign: "Taurus",
        signIndex: getSignIndex("Taurus"),
        degreeInsideSign: 8,
      },
      venus: {
        longitude: getLongitude("Pisces", 3),
        sign: "Pisces",
        signIndex: getSignIndex("Pisces"),
        degreeInsideSign: 3,
      },
      mars: {
        longitude: getLongitude("Leo", 18),
        sign: "Leo",
        signIndex: getSignIndex("Leo"),
        degreeInsideSign: 18,
      },
      jupiter: {
        longitude: getLongitude("Sagittarius", 12),
        sign: "Sagittarius",
        signIndex: getSignIndex("Sagittarius"),
        degreeInsideSign: 12,
      },
      saturn: {
        longitude: getLongitude("Capricorn", 25),
        sign: "Capricorn",
        signIndex: getSignIndex("Capricorn"),
        degreeInsideSign: 25,
      },
      uranus: {
        longitude: getLongitude("Aquarius", 7),
        sign: "Aquarius",
        signIndex: getSignIndex("Aquarius"),
        degreeInsideSign: 7,
      },
      neptune: {
        longitude: getLongitude("Pisces", 14),
        sign: "Pisces",
        signIndex: getSignIndex("Pisces"),
        degreeInsideSign: 14,
      },
      pluto: {
        longitude: getLongitude("Scorpio", 9),
        sign: "Scorpio",
        signIndex: getSignIndex("Scorpio"),
        degreeInsideSign: 9,
      },
    },
    ascendant: {
      longitude: getLongitude("Libra", 5),
      sign: "Libra",
      signIndex: getSignIndex("Libra"),
      degreeInsideSign: 5,
    },
    houses: [],
    planetHouses: {},
    aspects: [],
  };
};

type Category = "SELF" | "LOVE" | "WORK" | "SOCIAL";

const categories: {
  id: Category;
  label: string;
  icon: string;
  questions: string[];
}[] = [
  {
    id: "SELF",
    label: "SELF",
    icon: "/icons/moon.png",
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
    icon: "/icons/butterfly.png",
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
    icon: "/icons/jug.png",
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
    icon: "/icons/leaf.png",
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

const getInterpretation = (
  category: Category,
  questionIndex: number
): string => {
  const interpretations: Record<Category, string[]> = {
    SELF: [
      "Your Sun sign reveals your core essence, but your rising sign shows who you're becoming. The planets in your first house suggest you're in a period of self-discovery. Trust the process of becoming.",
      "Venus in your second house indicates you value security and comfort, but your North Node suggests your true desires lie in experiences that challenge your comfort zone. What scares you might be exactly what you need.",
      "Your Moon's current transit through your emotional houses suggests a period of introspection. Happiness isn't a destination—it's found in the alignment between your actions and your values.",
      "Saturn's influence reveals that your fears are often projections of past limitations. The planets suggest you're ready to confront what once held you back. Your chart shows strength you haven't yet claimed.",
      "Venus trine your natal Moon suggests a period of self-acceptance. The stars indicate you're learning to love yourself not despite your flaws, but because of your authentic complexity.",
      "Your Midheaven and North Node alignment points to a purpose that combines your natural talents with your soul's evolution. The planets suggest your purpose isn't found—it's created through daily choices.",
      "Mercury retrograde in your sign suggests a time to examine whether your words match your actions. Your chart shows a tension between who you present and who you are—this transit invites alignment.",
      "Pluto's transformative energy in your house of endings suggests it's time to release patterns that no longer serve. The stars indicate you're holding onto identities that limit your growth.",
    ],
    LOVE: [
      "Venus in your seventh house suggests you're entering a period of partnership readiness. Your chart shows you've done the inner work—the stars align for connection when you're open to receiving.",
      "Your Venus sign reveals what you're drawn to, but your Mars shows what you actually need. The planets suggest you're looking for someone who mirrors your growth, not your past patterns.",
      "Jupiter's influence suggests you're learning that love isn't earned—it's your birthright. Your chart shows you've been carrying stories of unworthiness that aren't yours to carry.",
      "Saturn's transit through your relationship house suggests a time of evaluation. The planets indicate you're asking the right questions—trust what your chart reveals about compatibility.",
      "Mars square your Venus suggests internal conflict between desire and action. Your chart shows fear of vulnerability blocking connection. The stars suggest courage is required for what you want.",
      "Your Moon's placement reveals your emotional needs in love. The planets suggest you can't receive from others what you won't give yourself. Self-love isn't selfish—it's the foundation of healthy love.",
      "Pluto's influence reveals you're repeating patterns from childhood relationships. Your chart shows you're ready to break cycles—the planets suggest awareness is the first step to change.",
      "Venus trine your ascendant suggests you're radiating magnetic energy. The stars indicate you're more open than you realize—your chart shows readiness to receive love in unexpected forms.",
    ],
    WORK: [
      "Your Midheaven and current transits suggest a period of career evaluation. The planets indicate fulfillment comes when your work aligns with your values, not just your skills.",
      "Your North Node in your career house reveals your soul's calling. The stars suggest your purpose isn't in what you're good at, but in what challenges you to grow into who you're meant to become.",
      "Saturn's influence suggests you're being tested on your commitment to growth. Your chart shows potential that requires discipline to actualize. The planets indicate you're closer than you think.",
      "Uranus in your work sector suggests sudden changes are possible. Your chart shows you're ready for a shift, but fear of the unknown is holding you back. The stars suggest change is inevitable—will you choose it?",
      "Mars retrograde reveals what you've been avoiding. Your chart shows patterns of procrastination that mask deeper fears. The planets suggest confronting avoidance is the path to progress.",
      "Jupiter's transit suggests expansion in your earning potential, but your chart shows you must first value your own worth. The stars indicate you're undercharging for what you bring.",
      "Mercury in your learning house suggests a time of skill development. Your chart shows natural talents that need cultivation. The planets indicate investing in yourself is the highest return.",
      "Your second house planets reveal your values around work and money. The stars suggest alignment comes when your career serves not just your bank account, but your soul's purpose.",
    ],
    SOCIAL: [
      "Saturn's transit through your friendship sector suggests a year of evaluation. The planets indicate some connections have served their purpose—your chart shows you're ready to release what no longer aligns.",
      "Jupiter's influence suggests you attract many connections, but your chart reveals quality over quantity. The stars indicate you're spreading yourself thin—depth requires saying no to breadth.",
      "Your eleventh house reveals your social needs. The planets suggest you're questioning whether your friendships reflect who you're becoming. Your chart shows you're outgrowing certain dynamics.",
      "Venus in your social house suggests you're radiating magnetic energy. The stars indicate 'cool' is subjective—your chart shows authenticity is more magnetic than fitting in.",
      "Mercury's influence suggests you're hyper-aware of others' perceptions. Your chart shows this is projection—the planets indicate people are more focused on themselves than judging you.",
      "Your North Node suggests you're learning to trust others' belief in you. The stars indicate you're surrounded by support you haven't fully received. Your chart shows it's time to let people in.",
      "Your Moon's placement reveals your role in groups. The planets suggest you're not the baby—you're the one who brings vulnerability that allows others to open up. Your chart shows this is a gift.",
      "Uranus in your friendship house suggests your social circle is evolving. The stars indicate you're attracting people who match your growth. Your chart shows alignment comes when you stop forcing fit.",
    ],
  };

  return (
    interpretations[category]?.[questionIndex] ||
    "The stars are aligning to reveal insights. Trust the process."
  );
};

const AskPage = () => {
  const [selectedCategory, setSelectedCategory] = useState<Category>("SOCIAL");
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<number>(0);
  const [chartData] = useState<ChartData>(() => createSampleChart());
  const [inputValue, setInputValue] = useState("");

  const currentCategory = categories.find((cat) => cat.id === selectedCategory);
  const interpretation = getInterpretation(
    selectedCategory,
    selectedQuestionIndex
  );

  return (
    <div className="relative bg-black text-white flex-1 flex flex-col overflow-hidden pt-14">
      <StarryBackground />

      <div className="relative z-10 flex items-center justify-center border-b border-white/5 px-8 py-5 shrink-0 backdrop-blur-sm bg-black/30">
        <div className="flex items-center gap-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                setSelectedCategory(category.id);
                setSelectedQuestionIndex(0);
              }}
              className={`flex items-center gap-2.5 transition-all duration-300 px-4 py-2 ${
                selectedCategory === category.id
                  ? "opacity-100 bg-white/10"
                  : "opacity-50 hover:opacity-70 hover:bg-white/5"
              }`}
            >
              <Image
                src={category.icon}
                alt={category.label}
                width={18}
                height={18}
                className={`object-contain filter brightness-0 invert transition-transform duration-300 ${
                  selectedCategory === category.id ? "scale-110" : "scale-100"
                }`}
              />
              <span className="text-xs uppercase tracking-widest font-medium">
                {category.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="relative z-10 flex-1 flex overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden border-r border-white/5">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="flex items-start justify-center py-16 px-12 min-h-full">
              <div className="w-full max-w-xl space-y-6">
                {currentCategory?.questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedQuestionIndex(index)}
                    className={`w-full text-left text-white text-lg uppercase tracking-wide cursor-pointer transition-all duration-300 py-4 px-6 group ${
                      selectedQuestionIndex === index
                        ? "opacity-100 bg-white/10 border border-white/20"
                        : "opacity-60 hover:opacity-90 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                          selectedQuestionIndex === index
                            ? "bg-white scale-150"
                            : "bg-white/40 group-hover:bg-white/60"
                        }`}
                      />
                      <span className="font-light">{question}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="relative z-10 border-t border-white/5 px-12 py-6 pb-20 flex items-center gap-4 shrink-0 backdrop-blur-sm bg-black/20">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask anything..."
              className="flex-1 bg-white/5 border border-white/10 px-4 py-3 text-white text-sm tracking-wide placeholder:text-white/40 focus:outline-none focus:ring-0 focus:border-white/30 transition-all duration-300"
              onKeyDown={(e) => {
                if (e.key === "Enter" && inputValue.trim()) {
                  console.log("Question asked:", inputValue);
                  setInputValue("");
                }
              }}
            />
            <button className="text-white/70 hover:text-white text-sm uppercase tracking-wider transition-all duration-300 px-6 py-3 hover:bg-white/10 shrink-0">
              Submit
            </button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto scroll-smooth">
            <div className="flex flex-col items-center justify-center py-16 px-12 min-h-full">
              <div className="w-full max-w-2xl space-y-16 animate-in fade-in duration-500">
                <div className="transition-opacity duration-500">
                  <NatalChart chart={chartData} />
                </div>
                <div className="space-y-8 text-white">
                  <h2 className="text-3xl uppercase tracking-wider font-light leading-tight">
                    {currentCategory?.questions[selectedQuestionIndex]}
                  </h2>
                  <div className="space-y-5 text-base leading-relaxed text-white/75 font-light">
                    {interpretation.split(". ").map((sentence, idx) => (
                      <p
                        key={idx}
                        className="transition-opacity duration-500 animate-in"
                      >
                        {sentence}.
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskPage;
