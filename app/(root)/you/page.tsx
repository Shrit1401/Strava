"use client";

import NatalChart from "@/components/NatalChart";
import { ChartData } from "@/types/chart";
import Image from "next/image";

const getSignIndex = (sign: string): number => {
  const signs = [
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
  ];
  return signs.indexOf(sign);
};

const getLongitude = (sign: string, degree: number = 15): number => {
  const signIndex = getSignIndex(sign);
  return signIndex * 30 + degree;
};

const createChartData = (): ChartData => {
  return {
    utc: "2008-01-14T05:30:00Z",
    ist: "2008-01-14T11:00:00",
    planets: {
      sun: {
        longitude: getLongitude("Capricorn", 23),
        sign: "Capricorn",
        signIndex: getSignIndex("Capricorn"),
        degreeInsideSign: 23,
      },
      moon: {
        longitude: getLongitude("Aries", 12),
        sign: "Aries",
        signIndex: getSignIndex("Aries"),
        degreeInsideSign: 12,
      },
      mercury: {
        longitude: getLongitude("Aquarius", 8),
        sign: "Aquarius",
        signIndex: getSignIndex("Aquarius"),
        degreeInsideSign: 8,
      },
      venus: {
        longitude: getLongitude("Sagittarius", 18),
        sign: "Sagittarius",
        signIndex: getSignIndex("Sagittarius"),
        degreeInsideSign: 18,
      },
      mars: {
        longitude: getLongitude("Gemini", 5),
        sign: "Gemini",
        signIndex: getSignIndex("Gemini"),
        degreeInsideSign: 5,
      },
      jupiter: {
        longitude: getLongitude("Capricorn", 15),
        sign: "Capricorn",
        signIndex: getSignIndex("Capricorn"),
        degreeInsideSign: 15,
      },
      saturn: {
        longitude: getLongitude("Virgo", 22),
        sign: "Virgo",
        signIndex: getSignIndex("Virgo"),
        degreeInsideSign: 22,
      },
      uranus: {
        longitude: getLongitude("Pisces", 19),
        sign: "Pisces",
        signIndex: getSignIndex("Pisces"),
        degreeInsideSign: 19,
      },
      neptune: {
        longitude: getLongitude("Aquarius", 3),
        sign: "Aquarius",
        signIndex: getSignIndex("Aquarius"),
        degreeInsideSign: 3,
      },
      pluto: {
        longitude: getLongitude("Sagittarius", 28),
        sign: "Sagittarius",
        signIndex: getSignIndex("Sagittarius"),
        degreeInsideSign: 28,
      },
    },
    ascendant: {
      longitude: getLongitude("Aries", 4),
      sign: "Aries",
      signIndex: getSignIndex("Aries"),
      degreeInsideSign: 4,
    },
    houses: null,
    planetHouses: {
      sun: 10,
      moon: 12,
      mercury: 11,
      venus: 9,
      mars: 3,
      jupiter: 10,
      saturn: 6,
      uranus: 12,
      neptune: 11,
      pluto: 9,
      ascendant: 1,
    },
    aspects: [],
    houseSystem: "Placidus",
  };
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
  house: number
): string => {
  const descriptions: Record<string, Record<string, string>> = {
    sun: {
      Capricorn:
        "The Sun represents your ego, identity, and core self. In Capricorn, you are responsible, serious, efficient, rational, ambitious, and workaholic. You may be emotionally reserved and focused on achieving your goals.",
    },
    moon: {
      Aries:
        "The Moon represents your emotions, moods, and feelings. In Aries, you have an independent, energetic, and enthusiastic emotional self. You may have a tendency to feel inadequate or overcompensate due to fear of failure.",
    },
    ascendant: {
      Aries:
        "The Ascendant represents your outward personality and how others perceive you. In Aries, you present yourself as bold, independent, and action-oriented. You have a natural leadership presence and aren't afraid to take initiative.",
    },
    mercury: {
      Aquarius:
        "Mercury represents your mind, communication, and thinking style. In Aquarius, you think in innovative, unconventional ways. You're intellectually independent, value freedom of thought, and excel at seeing the bigger picture.",
    },
    venus: {
      Sagittarius:
        "Venus represents love, beauty, and what you value. In Sagittarius, you seek adventure in relationships and are attracted to people who share your love of exploration and learning. You value freedom and honesty in love.",
    },
    mars: {
      Gemini:
        "Mars represents your aggression, assertion, action, and energy. It influences your sex life, ambition, and how you express anger. In Gemini, you have quick, heady assertion and are energetic but sometimes unfocused.",
    },
    jupiter: {
      Capricorn:
        "Jupiter represents expansion, growth, and your philosophy of life. In Capricorn, you find growth through discipline, structure, and long-term planning. You expand through responsibility and achieving your ambitions.",
    },
    saturn: {
      Virgo:
        "Saturn represents structure, discipline, and your limitations. In Virgo, you find structure through attention to detail, service, and practical work. You may be critical of yourself and others, but this helps you refine and improve.",
    },
    uranus: {
      Pisces:
        "Uranus represents innovation, rebellion, and sudden change. In Pisces, your uniqueness comes through intuition, creativity, and spiritual insights. You break free from limitations through imagination and compassion.",
    },
    neptune: {
      Aquarius:
        "Neptune represents dreams, illusions, and spirituality. In Aquarius, your dreams are connected to humanitarian ideals and collective consciousness. You may have visionary ideas about the future of humanity.",
    },
    pluto: {
      Sagittarius:
        "Pluto represents transformation, power, and deep psychological change. In Sagittarius, your transformation comes through expanding your beliefs, exploring different philosophies, and seeking deeper meaning in life.",
    },
  };

  return (
    descriptions[planetName.toLowerCase()]?.[sign] ||
    `${planetName} in ${sign} influences your chart in unique ways.`
  );
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
  const chartData = createChartData();
  const userName = "Shrit Shrivastava";

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
            {userName}
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

        <div className="max-w-7xl mx-auto space-y-20 pt-16">
          {planetsData.map((planet, index) => {
            const layout = getCardLayout(index);
            const isImageLeft = layout.imagePos === "left";
            const description = getPlanetDescription(
              planet.name,
              planet.sign,
              planet.house
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
