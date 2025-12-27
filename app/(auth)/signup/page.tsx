"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";

const MONTHS = [
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
] as const;

const TOTAL_STEPS = 3;

type FormData = {
  birthPlace: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  birthTime: string;
  latitude?: number;
  longitude?: number;
};

const INITIAL_FORM_DATA: FormData = {
  birthPlace: "Delhi, India",
  birthDay: "11",
  birthMonth: "January",
  birthYear: "2001",
  birthTime: "11:00",
};

const INPUT_STYLES =
  "px-4 py-3 bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors";

const BUTTON_STYLES = "!bg-white !text-black !border-white hover:!bg-white/90";

type WelcomeStepProps = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center justify-between text-center h-[50vh] space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="cormorant text-4xl md:text-5xl mb-4 text-white">
          Fall in the Stars
        </h1>
        <p className="text-white/80 max-w-lg">
          we're gonna ask some questions from you, answer it correctly we are
          gonna ask from stars who you are...
        </p>
      </div>
      <Button
        text="LETS GO"
        variant="primary"
        size="medium"
        onClick={onNext}
        className={`${BUTTON_STYLES} mt-8`}
      />
    </div>
  );
};

type BirthInfoStepProps = {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | number) => void;
  onNext: () => void;
};

const BirthInfoStep = ({
  formData,
  onInputChange,
  onNext,
}: BirthInfoStepProps) => {
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const geocoderInstanceRef = useRef<GeocoderAutocomplete | null>(null);
  const onInputChangeRef = useRef(onInputChange);

  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);

  useEffect(() => {
    if (!autocompleteRef.current || geocoderInstanceRef.current) return;

    if (autocompleteRef.current.innerHTML.trim() !== "") {
      autocompleteRef.current.innerHTML = "";
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

    if (!apiKey) {
      console.warn(
        "Geoapify API key not found. Please set NEXT_PUBLIC_GEOAPIFY_API_KEY"
      );
      return;
    }

    const autocomplete = new GeocoderAutocomplete(
      autocompleteRef.current,
      apiKey,
      {
        placeholder: "Enter your birth place",
        lang: "en",
        limit: 5,
        skipIcons: false,
        skipDetails: false,
      }
    );

    geocoderInstanceRef.current = autocomplete;

    autocomplete.on("select", (feature) => {
      if (feature) {
        const properties = feature.properties;
        const address = properties.formatted || properties.name || "";
        const coordinates = feature.geometry?.coordinates;

        onInputChangeRef.current("birthPlace", address);

        if (coordinates && coordinates.length >= 2) {
          onInputChangeRef.current("longitude", coordinates[0]);
          onInputChangeRef.current("latitude", coordinates[1]);
        }
      }
    });

    return () => {
      if (geocoderInstanceRef.current) {
        if (autocompleteRef.current) {
          autocompleteRef.current.innerHTML = "";
        }
        geocoderInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="flex flex-col space-y-12 max-w-2xl mx-auto w-full">
      <div className="space-y-4 text-center ">
        <h2 className="cormorant text-3xl md:text-4xl  text-white">
          Your Birth Place
        </h2>
        <div
          ref={autocompleteRef}
          className="w-full geoapify-autocomplete-wrapper"
          style={{ position: "relative" }}
        />
      </div>

      <div className="space-y-4 text-center">
        <h2 className="cormorant text-3xl md:text-4xl  text-white">
          Your Birth Date & Time
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={formData.birthDay}
            onChange={(e) => onInputChange("birthDay", e.target.value)}
            className={`w-24 ${INPUT_STYLES}`}
            placeholder="Day"
          />
          <select
            value={formData.birthMonth}
            onChange={(e) => onInputChange("birthMonth", e.target.value)}
            className={`flex-1 ${INPUT_STYLES}`}
          >
            {MONTHS.map((month) => (
              <option key={month} value={month} className="bg-[#111]">
                {month}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={formData.birthYear}
            onChange={(e) => onInputChange("birthYear", e.target.value)}
            className={`w-32 ${INPUT_STYLES}`}
            placeholder="Year"
          />
        </div>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => onInputChange("birthTime", e.target.value)}
          className={`w-full ${INPUT_STYLES}`}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          text="NEXT"
          variant="primary"
          size="medium"
          onClick={onNext}
          className={BUTTON_STYLES}
        />
      </div>
    </div>
  );
};

type ResultsStepProps = {
  traits: string[];
  loading?: boolean;
};

const ResultsStep = ({ traits, loading }: ResultsStepProps) => {
  const [revealedTraits, setRevealedTraits] = useState<string[]>([]);
  const [showSection, setShowSection] = useState(false);

  useEffect(() => {
    if (!loading && traits.length > 0) {
      setShowSection(true);
      setRevealedTraits([]);

      traits.forEach((trait, index) => {
        setTimeout(() => {
          setRevealedTraits((prev) => [...prev, trait]);
        }, index * 600 + 400);
      });
    }
  }, [loading, traits]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center space-y-8 max-w-2xl mx-auto">
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-white/50">
            Reading the Stars...
          </h2>
          <p className="text-white/60">Calculating your personality traits</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between h-[50vh] text-center space-y-12 max-w-2xl mx-auto">
      <div className="w-full space-y-8">
        <div
          className={`trait-section ${
            showSection ? "fade-in-slow" : "opacity-0"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white/50 mb-8">
            Stars Tell me You're
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-x-2 min-h-[80px]">
            {traits.map((trait, index) => (
              <div
                key={index}
                className={`trait-item inline-flex items-center ${
                  revealedTraits.includes(trait) ? "fade-in-slow" : "opacity-0"
                }`}
                style={{ transitionDelay: `${index * 0.1}s` }}
              >
                <span className="cormorant text-3xl md:text-4xl text-white">
                  {trait}
                </span>
                {index < traits.length - 1 && (
                  <span className="text-white/30 mx-2 text-2xl">,</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6 pt-8">
        <h2 className="cormorant text-3xl md:text-4xl text-white">
          Let's Dive Deeper
        </h2>
        <Button
          text="LOGIN W GOOGLE"
          variant="primary"
          size="medium"
          className={BUTTON_STYLES}
        />
      </div>
    </div>
  );
};

const extractTraits = (chart: any): string[] => {
  const traitScores: Record<string, number> = {};

  if (chart?.planets?.sun) {
    const sunSign = chart.planets.sun.sign;
    const sunStyle = getSignStyle(sunSign);
    if (sunStyle) traitScores[sunStyle] = (traitScores[sunStyle] || 0) + 4;

    const sunHouse = chart?.planetHouses?.sun;
    if (sunHouse) {
      const houseTrait = getHouseTrait(sunHouse);
      if (houseTrait)
        traitScores[houseTrait] = (traitScores[houseTrait] || 0) + 2;
    }
  }

  if (chart?.planets?.moon) {
    const moonSign = chart.planets.moon.sign;
    const moonStyle = getSignStyle(moonSign);
    if (moonStyle) traitScores[moonStyle] = (traitScores[moonStyle] || 0) + 3.5;

    const moonHouse = chart?.planetHouses?.moon;
    if (moonHouse) {
      const houseTrait = getHouseTrait(moonHouse);
      if (houseTrait)
        traitScores[houseTrait] = (traitScores[houseTrait] || 0) + 2;
    }
  }

  if (chart?.ascendant?.sign) {
    const ascSign = chart.ascendant.sign;
    const ascStyle = getSignStyle(ascSign);
    if (ascStyle) traitScores[ascStyle] = (traitScores[ascStyle] || 0) + 3;
  }

  if (chart?.planets?.mars) {
    const marsSign = chart.planets.mars.sign;
    const marsStyle = getSignStyle(marsSign);
    if (marsStyle) traitScores[marsStyle] = (traitScores[marsStyle] || 0) + 1.5;
  }

  if (chart?.planets?.venus) {
    const venusSign = chart.planets.venus.sign;
    const venusStyle = getSignStyle(venusSign);
    if (venusStyle)
      traitScores[venusStyle] = (traitScores[venusStyle] || 0) + 1.5;
  }

  if (chart?.planets?.mercury) {
    const mercurySign = chart.planets.mercury.sign;
    const mercuryStyle = getSignStyle(mercurySign);
    if (mercuryStyle)
      traitScores[mercuryStyle] = (traitScores[mercuryStyle] || 0) + 1;
  }

  if (chart?.aspects && Array.isArray(chart.aspects)) {
    const trineAspects = chart.aspects.filter(
      (a: any) => a.type === "Trine" || a.type === "Sextile"
    );
    if (trineAspects.length > 2) {
      traitScores["Harmonious"] = (traitScores["Harmonious"] || 0) + 1.5;
    }

    const squareAspects = chart.aspects.filter(
      (a: any) => a.type === "Square" || a.type === "Opposition"
    );
    if (squareAspects.length > 2) {
      traitScores["Intense"] = (traitScores["Intense"] || 0) + 1.5;
    }
  }

  if (chart?.interpretations?.strengths?.length > 0) {
    chart.interpretations.strengths.forEach((strength: string) => {
      const strengthTrait = extractTraitFromText(strength);
      if (strengthTrait) {
        traitScores[strengthTrait] = (traitScores[strengthTrait] || 0) + 1;
      }
    });
  }

  if (chart?.interpretations?.corePersonality?.length > 0) {
    chart.interpretations.corePersonality.forEach((personality: string) => {
      const personalityTrait = extractTraitFromText(personality);
      if (personalityTrait) {
        traitScores[personalityTrait] =
          (traitScores[personalityTrait] || 0) + 1;
      }
    });
  }

  const sortedTraits = Object.entries(traitScores)
    .sort(([, a], [, b]) => b - a)
    .map(([trait]) => trait)
    .slice(0, 3);

  while (sortedTraits.length < 3) {
    const fallbackTraits = [
      "Intuitive",
      "Creative",
      "Determined",
      "Empathetic",
      "Adventurous",
    ];
    const randomTrait =
      fallbackTraits[Math.floor(Math.random() * fallbackTraits.length)];
    if (!sortedTraits.includes(randomTrait)) {
      sortedTraits.push(randomTrait);
    }
  }

  return sortedTraits.slice(0, 3);
};

const getHouseTrait = (house: number): string | null => {
  const houseTraits: Record<number, string> = {
    1: "Bold",
    2: "Stable",
    3: "Curious",
    4: "Nurturing",
    5: "Creative",
    6: "Analytical",
    7: "Harmonious",
    8: "Intense",
    9: "Adventurous",
    10: "Ambitious",
    11: "Innovative",
    12: "Intuitive",
  };
  return houseTraits[house] || null;
};

const getSignStyle = (sign: string): string | null => {
  const signStyles: Record<string, string> = {
    Aries: "Bold",
    Taurus: "Stable",
    Gemini: "Curious",
    Cancer: "Nurturing",
    Leo: "Creative",
    Virgo: "Analytical",
    Libra: "Harmonious",
    Scorpio: "Intense",
    Sagittarius: "Adventurous",
    Capricorn: "Ambitious",
    Aquarius: "Innovative",
    Pisces: "Intuitive",
  };
  return signStyles[sign] || null;
};

const extractTraitFromText = (text: string): string | null => {
  const traitKeywords: Record<string, string> = {
    creative: "Creative",
    ambitious: "Ambitious",
    adventurous: "Adventurous",
    analytical: "Analytical",
    intuitive: "Intuitive",
    harmonious: "Harmonious",
    bold: "Bold",
    stable: "Stable",
    nurturing: "Nurturing",
    intense: "Intense",
    innovative: "Innovative",
  };

  const lowerText = text.toLowerCase();
  for (const [key, trait] of Object.entries(traitKeywords)) {
    if (lowerText.includes(key)) {
      return trait;
    }
  }
  return null;
};

const parseTime = (timeStr: string): { hour: number; minute: number } => {
  const upperTime = timeStr.toUpperCase().trim();
  const isPM = upperTime.includes("PM");
  const isAM = upperTime.includes("AM");
  const timeMatch = timeStr.match(/(\d{1,2}):(\d{2})/);

  if (timeMatch) {
    let hour = parseInt(timeMatch[1], 10);
    const minute = parseInt(timeMatch[2], 10);

    if (isPM && hour !== 12) {
      hour += 12;
    } else if (isAM && hour === 12) {
      hour = 0;
    } else if (!isPM && !isAM && hour >= 0 && hour <= 23) {
      return { hour, minute };
    }

    return { hour, minute };
  }

  return { hour: 12, minute: 0 };
};

const getMonthNumber = (monthName: string): number => {
  const monthIndex = MONTHS.findIndex(
    (m) => m.toLowerCase() === monthName.toLowerCase()
  );
  return monthIndex >= 0 ? monthIndex + 1 : 1;
};

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [isAnimating, setIsAnimating] = useState(false);
  const [traits, setTraits] = useState<string[]>([]);
  const [loadingTraits, setLoadingTraits] = useState(false);

  const fetchPersonalityTraits = async () => {
    if (!formData.latitude || !formData.longitude) {
      setTraits(["Mysterious", "Unique", "Special"]);
      return;
    }

    setLoadingTraits(true);

    try {
      const { hour, minute } = parseTime(formData.birthTime);
      const month = getMonthNumber(formData.birthMonth);
      const year = parseInt(formData.birthYear, 10);
      const day = parseInt(formData.birthDay, 10);

      const response = await fetch("/api/natal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          second: 0,
          timezone: "Asia/Kolkata",
          lat: formData.latitude,
          lon: formData.longitude,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const extractedTraits = extractTraits(data.chart);
        setTraits(extractedTraits);
      } else {
        setTraits(["Mysterious", "Unique", "Special"]);
      }
    } catch (error) {
      console.error("Error fetching traits:", error);
      setTraits(["Mysterious", "Unique", "Special"]);
    } finally {
      setLoadingTraits(false);
    }
  };

  const handleNext = async () => {
    if (currentStep < TOTAL_STEPS && !isAnimating) {
      setIsAnimating(true);

      if (currentStep === 2) {
        await fetchPersonalityTraits();
      }

      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setTimeout(() => {
          setIsAnimating(false);
        }, 100);
      }, 600);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return (
          <BirthInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        );
      case 3:
        return <ResultsStep traits={traits} loading={loadingTraits} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div
          className={`w-full step-transition ${
            isAnimating ? "fade-out" : "fade-in"
          }`}
        >
          {renderCurrentStep()}
        </div>
      </div>

      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="/start.png"
          alt="Background illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
