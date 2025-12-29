"use client";

import { useEffect, useState } from "react";
import NatalChart from "@/components/NatalChart";
import Loader from "@/components/Loader";
import { ChartData } from "@/types/chart";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  HOUSE_MEANINGS,
} from "@/constants/astrology";

type SelfData = {
  theme: string;
  signalStrength: "Pressure" | "Neutral" | "Supportive";
  moonAspect: {
    planet: "Saturn" | "Mars" | null;
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  moonHouse: number;
  moonSign: string;
  natalSaturn: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  natalMars: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  summary: string;
  explanation: string;
  encouragement: string;
  logicalBullets: string[];
};

const getPlanetIcon = (planetName: string): string => {
  const iconMap: Record<string, string> = {
    sun: "/icons/butterfly.png",
    moon: "/icons/moon.png",
    ascendant: "/icons/moon.png",
    mercury: "/icons/telephone.png",
    venus: "/icons/leaf.png",
    mars: "/icons/prisma.png",
    jupiter: "/icons/jug.png",
    saturn: "/icons/jug.png",
    uranus: "/icons/prisma.png",
    neptune: "/icons/leaf.png",
    pluto: "/icons/butterfly.png",
  };
  return iconMap[planetName.toLowerCase()] || "/icons/butterfly.png";
};

const getPlanetDescription = (
  planetName: string,
  sign: string,
  house: number,
  selfData: SelfData | null
): string => {
  const planetMeaning = PLANET_MEANINGS[planetName.toLowerCase()] || "";
  const signMeaning = SIGN_MEANINGS[sign] || "";
  const houseMeaning = HOUSE_MEANINGS[house] || "";

  let baseDescription = `The ${planetName} represents ${planetMeaning}. In ${sign}, you express this through ${signMeaning} ways.`;

  if (house > 0) {
    baseDescription += ` It's in your ${house}th house, meaning it influences ${houseMeaning}.`;
  }

  if (planetName.toLowerCase() === "moon" && selfData) {
    baseDescription += ` Today, the Moon's movement through ${selfData.moonSign} activates your emotional sensitivity. ${selfData.summary}`;
  }

  if (
    planetName.toLowerCase() === "saturn" &&
    selfData?.moonAspect.planet === "Saturn"
  ) {
    baseDescription += ` Today's Moon activation brings attention to how Saturn's themes of restraint and structure show up in your emotional world. You might notice yourself feeling more serious or burdened, or perhaps more aware of your limitations. This isn't a flaw—it's your system asking you to pay attention to your boundaries and to be more careful with yourself.`;
  }

  if (
    planetName.toLowerCase() === "mars" &&
    selfData?.moonAspect.planet === "Mars"
  ) {
    baseDescription += ` Today's Moon activation highlights how Mars's themes of action and assertion influence your emotional responses. You might find yourself reacting more quickly, feeling more easily irritated, or noticing that your defenses come up faster than usual. Your reactions are revealing something important about what matters to you and what feels threatening.`;
  }

  if (planetName.toLowerCase() === "sun") {
    baseDescription += ` This is your core identity—how you see yourself and how you want to be seen. Notice how this shows up in your daily life. What patterns do you recognize?`;
  }

  if (planetName.toLowerCase() === "venus") {
    baseDescription += ` This reveals what you value, what you're attracted to, and how you give and receive love. Pay attention to how these themes show up in your relationships and choices.`;
  }

  if (planetName.toLowerCase() === "mercury") {
    baseDescription += ` This influences how you think, communicate, and process information. Notice how your mind works—what patterns do you see in your thoughts?`;
  }

  if (planetName.toLowerCase() === "jupiter") {
    baseDescription += ` This shows where you find expansion, growth, and meaning. Where do you seek wisdom? How do you grow?`;
  }

  if (planetName.toLowerCase() === "uranus") {
    baseDescription += ` This reveals where you break free from limitations, where you innovate, and where sudden change might enter your life.`;
  }

  if (planetName.toLowerCase() === "neptune") {
    baseDescription += ` This connects you to dreams, intuition, and the spiritual realm. Notice where illusion and inspiration meet in your life.`;
  }

  if (planetName.toLowerCase() === "pluto") {
    baseDescription += ` This shows where deep transformation happens, where power dynamics play out, and where you experience profound change.`;
  }

  return baseDescription;
};

const getHouseDescription = (house: number): string => {
  const houseDescriptions: Record<number, string> = {
    1: "It's in your first house, meaning it directly influences your identity, appearance, and how you present yourself to the world.",
    3: "It's in your third house, meaning it affects your communication, thinking, and relationships with siblings and neighbors.",
    6: "It's in your sixth house, meaning it influences your work, health, daily routines, and service to others.",
    9: "It's in your ninth house, meaning it affects your philosophy, higher education, travel, and search for meaning.",
    10: "It's in your tenth house, meaning it influences your career, public image, reputation, and life goals.",
    11: "It's in your eleventh house, meaning it affects your friendships, social groups, hopes, and dreams for the future.",
    12: "It's in your twelfth house, meaning it influences your subconscious, spirituality, hidden strengths, and things that are kept private.",
  };
  return houseDescriptions[house] || `It's in your ${house}th house.`;
};

const YouPage = () => {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [userName, setUserName] = useState("");
  const [selfData, setSelfData] = useState<SelfData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "";
          setUserName(name);
        }

        const [chartResponse, selfResponse] = await Promise.all([
          fetch("/api/natal-chart"),
          fetch("/api/self"),
        ]);

        if (chartResponse.ok) {
          const chartResult = await chartResponse.json();
          setChartData(chartResult.chart);
        }

        if (selfResponse.ok) {
          const selfResult = await selfResponse.json();
          setSelfData(selfResult.self);
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading || !chartData) {
    return <Loader />;
  }

  const planetsData = [
    {
      name: "Sun",
      key: "sun",
      sign: chartData.planets.sun.sign,
      house: chartData.planetHouses?.sun || 0,
    },
    {
      name: "Moon",
      key: "moon",
      sign: chartData.planets.moon.sign,
      house: chartData.planetHouses?.moon || 0,
    },
    {
      name: "Ascendant",
      key: "ascendant",
      sign: chartData.ascendant?.sign || "",
      house: chartData.planetHouses?.ascendant || 0,
    },
    {
      name: "Mercury",
      key: "mercury",
      sign: chartData.planets.mercury.sign,
      house: chartData.planetHouses?.mercury || 0,
    },
    {
      name: "Venus",
      key: "venus",
      sign: chartData.planets.venus.sign,
      house: chartData.planetHouses?.venus || 0,
    },
    {
      name: "Mars",
      key: "mars",
      sign: chartData.planets.mars.sign,
      house: chartData.planetHouses?.mars || 0,
    },
    {
      name: "Jupiter",
      key: "jupiter",
      sign: chartData.planets.jupiter.sign,
      house: chartData.planetHouses?.jupiter || 0,
    },
    {
      name: "Saturn",
      key: "saturn",
      sign: chartData.planets.saturn.sign,
      house: chartData.planetHouses?.saturn || 0,
    },
    {
      name: "Uranus",
      key: "uranus",
      sign: chartData.planets.uranus.sign,
      house: chartData.planetHouses?.uranus || 0,
    },
    {
      name: "Neptune",
      key: "neptune",
      sign: chartData.planets.neptune.sign,
      house: chartData.planetHouses?.neptune || 0,
    },
    {
      name: "Pluto",
      key: "pluto",
      sign: chartData.planets.pluto.sign,
      house: chartData.planetHouses?.pluto || 0,
    },
  ];

  const getCardLayout = (index: number) => {
    const layouts = [
      { cols: "md:grid-cols-[1fr_180px]", imagePos: "right" },
      { cols: "md:grid-cols-[180px_1fr]", imagePos: "left" },
      { cols: "md:grid-cols-[1fr_200px]", imagePos: "right" },
      { cols: "md:grid-cols-[160px_1fr]", imagePos: "left" },
      { cols: "md:grid-cols-[1fr_220px]", imagePos: "right" },
      { cols: "md:grid-cols-[200px_1fr]", imagePos: "left" },
      { cols: "md:grid-cols-[1fr_150px]", imagePos: "right" },
      { cols: "md:grid-cols-[180px_1fr]", imagePos: "left" },
      { cols: "md:grid-cols-[1fr_190px]", imagePos: "right" },
      { cols: "md:grid-cols-[170px_1fr]", imagePos: "left" },
      { cols: "md:grid-cols-[1fr_160px]", imagePos: "right" },
    ];
    return layouts[index % layouts.length];
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-40">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl cormorant font-light mb-3 tracking-tight">
            {userName || "You"}
          </h1>
          <div className="text-sm text-gray-500 tracking-wider flex items-center justify-center gap-3">
            <div className="flex items-center gap-1.5">
              <Image
                src="/planets/sun.svg"
                alt="Sun"
                width={16}
                height={16}
                className="opacity-70"
              />
              <span>{chartData.planets.sun.sign}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Image
                src="/planets/moon.svg"
                alt="Moon"
                width={16}
                height={16}
                className="opacity-70"
              />
              <span>{chartData.planets.moon.sign}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Image
                src="/planets/ascendant.svg"
                alt="Ascendant"
                width={16}
                height={16}
                className="opacity-70"
              />
              <span>{chartData.ascendant?.sign || "Aries"}</span>
            </div>
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <NatalChart chart={chartData} />
        </div>

        {selfData && (
          <div className="max-w-3xl mx-auto mb-20 pt-12 border-t border-black/5">
            <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60 mb-6">
              Today&apos;s Reflection
            </p>
            <div className="space-y-6 text-base text-black/80 leading-relaxed">
              <p className="cormorant text-xl font-light text-black mb-4">
                {selfData.summary}
              </p>
              <p>{selfData.explanation}</p>
              <p className="italic text-black/70">{selfData.encouragement}</p>
            </div>
          </div>
        )}

        <div className="max-w-7xl mx-auto space-y-20 pt-16">
          {planetsData.map((planet, index) => {
            const layout = getCardLayout(index);
            const isImageLeft = layout.imagePos === "left";
            const description = getPlanetDescription(
              planet.name,
              planet.sign,
              planet.house,
              selfData
            );
            const houseDesc = getHouseDescription(planet.house);

            return (
              <div
                key={planet.key}
                className={`grid grid-cols-1 ${layout.cols} gap-12 items-start`}
              >
                {isImageLeft && (
                  <div className="hidden md:block shrink-0 order-2 md:order-1">
                    <div className="w-full aspect-square relative">
                      <Image
                        src={getPlanetIcon(planet.key)}
                        alt={`${planet.name} in ${planet.sign}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
                <div
                  className={`space-y-3 ${
                    isImageLeft ? "order-1 md:order-2" : ""
                  }`}
                >
                  <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/60">
                    {planet.name}
                  </p>
                  <div className="border-t border-black/5 pt-4">
                    <h3 className="cormorant text-2xl font-light text-black mb-4">
                      {planet.name} in {planet.sign}
                    </h3>
                    <p className="text-sm text-black/70 leading-relaxed mb-4">
                      {description}
                    </p>
                    <p className="text-sm text-black/70 leading-relaxed">
                      {houseDesc}
                    </p>
                  </div>
                </div>
                {!isImageLeft && (
                  <div className="hidden md:block shrink-0">
                    <div className="w-full aspect-square relative">
                      <Image
                        src={getPlanetIcon(planet.key)}
                        alt={`${planet.name} in ${planet.sign}`}
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default YouPage;
