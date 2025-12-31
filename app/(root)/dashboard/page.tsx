"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Dialog } from "@/components/ui/Dialog";
import TransitChart from "@/components/TransitChart";
import Loader from "@/components/Loader";
import { getRandomIcon } from "@/utils/astrology";

type DailyPrediction = {
  date: string;
  theme: string;
  tone: string;
  doList: string[];
  dontList: string[];
  headline: string;
  bullets: string[];
  closing: string[];
};

type SocialLifeData = {
  theme: string;
  signalStrength: "Supportive" | "Neutral" | "Challenging";
  aspectType: string | null;
  aspectAngle: number | null;
  moonToday: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  moonHouse: number;
  natalVenus: {
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

type SpiritualityData = {
  theme: string;
  signalStrength: "Active" | "Neutral" | "Subtle";
  moonAspect: {
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
  natalNeptune: {
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

type SexLoveData = {
  theme: string;
  signalStrength: "Active" | "Neutral" | "Complex";
  moonAspect: {
    planet: "Venus" | "Mars" | null;
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
  natalVenus: {
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

type RoutineData = {
  theme: string;
  signalStrength: "Grounding" | "Heavy" | "Neutral";
  moonAspect: {
    planet: "Mercury" | "Saturn" | null;
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
  natalMercury: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  natalSaturn: {
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

type ThinkingCreativityData = {
  theme: string;
  signalStrength: "Active" | "Scattered" | "Neutral";
  moonAspect: {
    planet: "Mercury" | "Uranus" | null;
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
  natalMercury: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  };
  natalUranus: {
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

const DashboardPage = () => {
  const [userName, setUserName] = useState("Shrit");
  const [currentDate, setCurrentDate] = useState("");
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<DailyPrediction | null>(null);
  const [socialLife, setSocialLife] = useState<SocialLifeData | null>(null);
  const [self, setSelf] = useState<SelfData | null>(null);
  const [spirituality, setSpirituality] = useState<SpiritualityData | null>(
    null
  );
  const [sexLove, setSexLove] = useState<SexLoveData | null>(null);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [thinkingCreativity, setThinkingCreativity] =
    useState<ThinkingCreativityData | null>(null);
  const [loading, setLoading] = useState(true);
  const [socialLifeLoading, setSocialLifeLoading] = useState(true);
  const [selfLoading, setSelfLoading] = useState(true);
  const [spiritualityLoading, setSpiritualityLoading] = useState(true);
  const [sexLoveLoading, setSexLoveLoading] = useState(true);
  const [routineLoading, setRoutineLoading] = useState(true);
  const [thinkingCreativityLoading, setThinkingCreativityLoading] =
    useState(true);

  useEffect(() => {
    const supabase = createClient();
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const name =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          user.email?.split("@")[0] ||
          "Shrit";
        setUserName(name);
      }
    };
    getUser();

    const now = new Date();
    const days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const dayName = days[now.getDay()];
    const month = months[now.getMonth()];
    const day = now.getDate();
    setCurrentDate(`${dayName} ${month} ${day}`);

    const fetchDailyPrediction = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/daily");
        if (response.ok) {
          const data = await response.json();
          setPrediction(data.prediction);
        }
      } catch (error) {
        console.error("Failed to fetch daily prediction:", error);
      } finally {
        setLoading(false);
      }
    };

    const fetchSocialLife = async () => {
      try {
        setSocialLifeLoading(true);
        const response = await fetch("/api/social-life");
        if (response.ok) {
          const data = await response.json();
          setSocialLife(data.socialLife);
        }
      } catch (error) {
        console.error("Failed to fetch social life:", error);
      } finally {
        setSocialLifeLoading(false);
      }
    };

    const fetchSelf = async () => {
      try {
        setSelfLoading(true);
        const response = await fetch("/api/self");
        if (response.ok) {
          const data = await response.json();
          setSelf(data.self);
        }
      } catch (error) {
        console.error("Failed to fetch self:", error);
      } finally {
        setSelfLoading(false);
      }
    };

    const fetchSpirituality = async () => {
      try {
        setSpiritualityLoading(true);
        const response = await fetch("/api/spirituality");
        if (response.ok) {
          const data = await response.json();
          setSpirituality(data.spirituality);
        }
      } catch (error) {
        console.error("Failed to fetch spirituality:", error);
      } finally {
        setSpiritualityLoading(false);
      }
    };

    const fetchSexLove = async () => {
      try {
        setSexLoveLoading(true);
        const response = await fetch("/api/sex-love");
        if (response.ok) {
          const data = await response.json();
          setSexLove(data.sexLove);
        }
      } catch (error) {
        console.error("Failed to fetch sex & love:", error);
      } finally {
        setSexLoveLoading(false);
      }
    };

    const fetchRoutine = async () => {
      try {
        setRoutineLoading(true);
        const response = await fetch("/api/routine");
        if (response.ok) {
          const data = await response.json();
          setRoutine(data.routine);
        }
      } catch (error) {
        console.error("Failed to fetch routine:", error);
      } finally {
        setRoutineLoading(false);
      }
    };

    const fetchThinkingCreativity = async () => {
      try {
        setThinkingCreativityLoading(true);
        const response = await fetch("/api/thinking-creativity");
        if (response.ok) {
          const data = await response.json();
          setThinkingCreativity(data.thinkingCreativity);
        }
      } catch (error) {
        console.error("Failed to fetch thinking & creativity:", error);
      } finally {
        setThinkingCreativityLoading(false);
      }
    };

    fetchDailyPrediction();
    fetchSocialLife();
    fetchSelf();
    fetchSpirituality();
    fetchSexLove();
    fetchRoutine();
    fetchThinkingCreativity();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const isLoading =
    loading ||
    socialLifeLoading ||
    selfLoading ||
    spiritualityLoading ||
    sexLoveLoading ||
    routineLoading ||
    thinkingCreativityLoading;

  if (isLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen pb-20">
      <div className="max-w-5xl mx-auto px-6 md:px-12 lg:px-16 pt-32 pb-40">
        <div className="space-y-20">
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -right-8 -top-8 w-72 h-72 z-[-1] opacity-60 pointer-events-none hidden lg:block">
                <Image
                  src={`/day/${Math.floor(Math.random() * 15 + 1)}.png`}
                  alt=""
                  width={200}
                  height={200}
                  className="w-full h-full object-cover"
                  priority
                />
              </div>
              <div className="space-y-2">
                <p className="text-xs text-[#575657] tracking-[0.15em] uppercase">
                  {getGreeting()} {userName}
                </p>
                <p className="text-xs text-[#575657] tracking-wide">
                  {currentDate}
                </p>
              </div>

              <div className="pt-6">
                <h1 className="cormorant text-5xl md:text-6xl lg:text-7xl font-light text-black leading-[1.1] tracking-tight">
                  {loading
                    ? "Loading your daily reflection..."
                    : prediction?.headline ||
                      "Today brings opportunities for reflection"}
                </h1>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 pt-12 border-t border-black/5">
              <div className="space-y-6">
                <h2 className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Do
                </h2>
                <ul className="space-y-4 text-lg text-black/80 leading-relaxed">
                  {loading ? (
                    <li className="cormorant font-light">Loading...</li>
                  ) : prediction?.doList && prediction.doList.length > 0 ? (
                    prediction.doList.map((item, index) => (
                      <li key={index} className="cormorant font-light">
                        {item}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="cormorant font-light">
                        Trust your instincts
                      </li>
                      <li className="cormorant font-light">Take your time</li>
                      <li className="cormorant font-light">Stay present</li>
                    </>
                  )}
                </ul>
              </div>
              <div className="space-y-6">
                <h2 className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Don&apos;t
                </h2>
                <ul className="space-y-4 text-lg text-black/80 leading-relaxed">
                  {loading ? (
                    <li className="cormorant font-light">Loading...</li>
                  ) : prediction?.dontList && prediction.dontList.length > 0 ? (
                    prediction.dontList.map((item, index) => (
                      <li key={index} className="cormorant font-light">
                        {item}
                      </li>
                    ))
                  ) : (
                    <>
                      <li className="cormorant font-light">Rush decisions</li>
                      <li className="cormorant font-light">Overthink</li>
                      <li className="cormorant font-light">
                        Ignore your needs
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </div>

            <div className="pt-12 border-t border-black/5">
              <ul className="space-y-6 text-base text-black/70 leading-relaxed">
                {loading ? (
                  <li>Loading your daily insights...</li>
                ) : prediction?.bullets && prediction.bullets.length > 0 ? (
                  prediction.bullets.map((bullet, index) => (
                    <li key={index}>{bullet}</li>
                  ))
                ) : (
                  <>
                    <li>Loading your daily insights...</li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-black/5">
            <div className="space-y-6 text-base text-black/70 leading-relaxed">
              {loading ? (
                <p>Loading your daily reflection...</p>
              ) : prediction?.closing && prediction.closing.length > 0 ? (
                prediction.closing.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))
              ) : (
                <>
                  <p>Loading your daily insights...</p>
                </>
              )}
            </div>
          </div>

          <div className="space-y-24 pt-20">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-8 items-start">
              <div className="space-y-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Power
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Social Life
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {socialLifeLoading
                      ? "Loading your social life reflection..."
                      : socialLife?.summary ||
                        "Today's social energy invites connection and awareness."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("social-life")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[120px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-start">
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[100px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2 order-1 md:order-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Pressure
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Self
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {selfLoading
                      ? "Loading your self reflection..."
                      : self?.summary || "Loading your daily insights..."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("self")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-8 items-start">
              <div className="space-y-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Trouble
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Spirituality
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {spiritualityLoading
                      ? "Loading your spirituality reflection..."
                      : spirituality?.summary ||
                        "Loading your daily insights..."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("spirituality")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[100px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 items-start">
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[120px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2 order-1 md:order-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Trouble
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Sex & Love
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {sexLoveLoading
                      ? "Loading your sex & love reflection..."
                      : sexLove?.summary || "Loading your daily insights..."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("sex-love")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_100px] gap-8 items-start">
              <div className="space-y-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Trouble
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Routine
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {routineLoading
                      ? "Loading your routine reflection..."
                      : routine?.summary || "Loading your daily insights..."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("routine")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[100px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[100px_1fr] gap-8 items-start">
              <div className="shrink-0 text-md order-2 md:order-1">
                <div className="w-full aspect-square relative max-w-[100px] mx-auto md:mx-0">
                  <Image
                    src={getRandomIcon()}
                    alt=""
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
              <div className="space-y-2 order-1 md:order-2">
                <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                  Trouble
                </p>
                <div className="border-t border-black/5 pt-6">
                  <h3 className="cormorant text-3xl font-light text-black mb-6">
                    Thinking & Creativity
                  </h3>
                  <p className="text-base text-black/70 leading-relaxed mb-6">
                    {thinkingCreativityLoading
                      ? "Loading your thinking & creativity reflection..."
                      : thinkingCreativity?.summary ||
                        "Loading your daily insights..."}
                  </p>
                  <button
                    onClick={() => setOpenDialog("thinking-creativity")}
                    className="text-xs font-normal uppercase tracking-[0.15em] text-black/50 hover:text-black/70 transition-colors cursor-pointer"
                  >
                    Details →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Dialog
          isOpen={openDialog === "social-life"}
          onClose={() => setOpenDialog(null)}
          title="Social Life"
          category="Power"
        >
          <div className="space-y-6">
            {socialLifeLoading || !socialLife ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                <TransitChart
                  planet1={{
                    name: "Moon",
                    longitude: socialLife.moonToday.longitude,
                    icon: "/planets/moon.svg",
                  }}
                  planet2={{
                    name: "Venus",
                    longitude: socialLife.natalVenus.longitude,
                    icon: "/planets/venus.svg",
                  }}
                  aspect={{
                    type: socialLife.aspectType || "None",
                    angle: socialLife.aspectAngle || 0,
                  }}
                  size={450}
                  variant="light"
                />
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {socialLife.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{socialLife.explanation}</p>
                    <p>{socialLife.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "self"}
          onClose={() => setOpenDialog(null)}
          title="Self"
          category="Pressure"
        >
          <div className="space-y-6">
            {selfLoading || !self ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                {self.moonAspect.planet ? (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: self.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: self.moonAspect.planet,
                      longitude:
                        self.moonAspect.planet === "Saturn"
                          ? self.natalSaturn.longitude
                          : self.natalMars.longitude,
                      icon:
                        self.moonAspect.planet === "Saturn"
                          ? "/planets/saturn.svg"
                          : "/planets/mars.svg",
                    }}
                    aspect={{
                      type: self.moonAspect.aspectType || "None",
                      angle: self.moonAspect.angle || 0,
                    }}
                    size={450}
                    variant="light"
                  />
                ) : (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: self.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Moon",
                      longitude: self.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    aspect={{
                      type: "None",
                      angle: 0,
                    }}
                    size={450}
                    variant="light"
                  />
                )}
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {self.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{self.explanation}</p>
                    <p>{self.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "spirituality"}
          onClose={() => setOpenDialog(null)}
          title="Spirituality"
          category="Trouble"
        >
          <div className="space-y-6">
            {spiritualityLoading || !spirituality ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                {spirituality.moonAspect.aspectType ? (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: spirituality.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Neptune",
                      longitude: spirituality.natalNeptune.longitude,
                      icon: "/planets/neptune.svg",
                    }}
                    aspect={{
                      type: spirituality.moonAspect.aspectType || "None",
                      angle: spirituality.moonAspect.angle || 0,
                    }}
                    size={450}
                    variant="light"
                  />
                ) : (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: spirituality.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Moon",
                      longitude: spirituality.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    aspect={{
                      type: "None",
                      angle: 0,
                    }}
                    size={450}
                    variant="light"
                  />
                )}
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {spirituality.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{spirituality.explanation}</p>
                    <p>{spirituality.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "sex-love"}
          onClose={() => setOpenDialog(null)}
          title="Sex & Love"
          category="Trouble"
        >
          <div className="space-y-6">
            {sexLoveLoading || !sexLove ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                {sexLove.moonAspect.planet ? (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: sexLove.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: sexLove.moonAspect.planet,
                      longitude:
                        sexLove.moonAspect.planet === "Venus"
                          ? sexLove.natalVenus.longitude
                          : sexLove.natalMars.longitude,
                      icon:
                        sexLove.moonAspect.planet === "Venus"
                          ? "/planets/venus.svg"
                          : "/planets/mars.svg",
                    }}
                    aspect={{
                      type: sexLove.moonAspect.aspectType || "None",
                      angle: sexLove.moonAspect.angle || 0,
                    }}
                    size={450}
                    variant="light"
                  />
                ) : (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: sexLove.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Moon",
                      longitude: sexLove.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    aspect={{
                      type: "None",
                      angle: 0,
                    }}
                    size={450}
                    variant="light"
                  />
                )}
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {sexLove.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{sexLove.explanation}</p>
                    <p>{sexLove.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "routine"}
          onClose={() => setOpenDialog(null)}
          title="Routine"
          category="Trouble"
        >
          <div className="space-y-6">
            {routineLoading || !routine ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                {routine.moonAspect.planet ? (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: routine.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: routine.moonAspect.planet,
                      longitude:
                        routine.moonAspect.planet === "Mercury"
                          ? routine.natalMercury.longitude
                          : routine.natalSaturn.longitude,
                      icon:
                        routine.moonAspect.planet === "Mercury"
                          ? "/planets/mercury.svg"
                          : "/planets/saturn.svg",
                    }}
                    aspect={{
                      type: routine.moonAspect.aspectType || "None",
                      angle: routine.moonAspect.angle || 0,
                    }}
                    size={450}
                    variant="light"
                  />
                ) : (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: routine.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Moon",
                      longitude: routine.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    aspect={{
                      type: "None",
                      angle: 0,
                    }}
                    size={450}
                    variant="light"
                  />
                )}
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {routine.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{routine.explanation}</p>
                    <p>{routine.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>

        <Dialog
          isOpen={openDialog === "thinking-creativity"}
          onClose={() => setOpenDialog(null)}
          title="Thinking & Creativity"
          category="Trouble"
        >
          <div className="space-y-6">
            {thinkingCreativityLoading || !thinkingCreativity ? (
              <div className="text-center py-8">Loading chart...</div>
            ) : (
              <>
                {thinkingCreativity.moonAspect.planet ? (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: thinkingCreativity.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: thinkingCreativity.moonAspect.planet,
                      longitude:
                        thinkingCreativity.moonAspect.planet === "Mercury"
                          ? thinkingCreativity.natalMercury.longitude
                          : thinkingCreativity.natalUranus.longitude,
                      icon:
                        thinkingCreativity.moonAspect.planet === "Mercury"
                          ? "/planets/mercury.svg"
                          : "/planets/uranus.svg",
                    }}
                    aspect={{
                      type: thinkingCreativity.moonAspect.aspectType || "None",
                      angle: thinkingCreativity.moonAspect.angle || 0,
                    }}
                    size={450}
                    variant="light"
                  />
                ) : (
                  <TransitChart
                    planet1={{
                      name: "Moon",
                      longitude: thinkingCreativity.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    planet2={{
                      name: "Moon",
                      longitude: thinkingCreativity.moonToday.longitude,
                      icon: "/planets/moon.svg",
                    }}
                    aspect={{
                      type: "None",
                      angle: 0,
                    }}
                    size={450}
                    variant="light"
                  />
                )}
                <div className="space-y-6">
                  <p className="text-md font-normal uppercase tracking-[0.15em] text-black/60 mb-3">
                    {thinkingCreativity.theme}
                  </p>
                  <div className="space-y-5 text-base text-black/80 leading-relaxed">
                    <p>{thinkingCreativity.explanation}</p>
                    <p>{thinkingCreativity.encouragement}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default DashboardPage;
