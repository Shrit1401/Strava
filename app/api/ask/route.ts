import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { callAI } from "@/lib/ai/client";
import { getCachedGeneration, setCachedGeneration } from "@/lib/ai/cache";
import { createHash } from "crypto";
import {
  angularDistance,
  getAspect,
  getAscendant,
  assignPlanetToHouse,
  calculateSunPosition,
  calculateMoonPosition,
  calculatePlanetPosition,
  createAstroTime,
  zodiacFromLongitude,
} from "@/lib/astrology/calculations";
import type { ZodiacPosition } from "@/types/chart";

const PLANET_BODIES: Record<string, Astronomy.Body> = {
  sun: Astronomy.Body.Sun,
  moon: Astronomy.Body.Moon,
  mercury: Astronomy.Body.Mercury,
  venus: Astronomy.Body.Venus,
  mars: Astronomy.Body.Mars,
  jupiter: Astronomy.Body.Jupiter,
  saturn: Astronomy.Body.Saturn,
  uranus: Astronomy.Body.Uranus,
  neptune: Astronomy.Body.Neptune,
  pluto: Astronomy.Body.Pluto,
};

const PLANET_ICONS: Record<string, string> = {
  sun: "/planets/sun.svg",
  moon: "/planets/moon.svg",
  mercury: "/planets/mercury.svg",
  venus: "/planets/venus.svg",
  mars: "/planets/mars.svg",
  jupiter: "/planets/jupiter.svg",
  saturn: "/planets/saturn.svg",
  uranus: "/planets/uranus.svg",
  neptune: "/planets/neptune.svg",
  pluto: "/planets/pluto.svg",
};

const PLANET_NAMES: Record<string, string> = {
  sun: "Sun",
  moon: "Moon",
  mercury: "Mercury",
  venus: "Venus",
  mars: "Mars",
  jupiter: "Jupiter",
  saturn: "Saturn",
  uranus: "Uranus",
  neptune: "Neptune",
  pluto: "Pluto",
};

const calculateTodayPlanetPositions = (
  timezone: string
): Record<string, ZodiacPosition> => {
  const now = DateTime.now().setZone(timezone);
  const astroTime = createAstroTime(now.toJSDate());
  const positions: Record<string, ZodiacPosition> = {};

  for (const [key, body] of Object.entries(PLANET_BODIES)) {
    if (key === "sun") {
      positions[key] = calculateSunPosition(astroTime);
    } else if (key === "moon") {
      positions[key] = calculateMoonPosition(astroTime);
    } else {
      positions[key] = calculatePlanetPosition(astroTime, body);
    }
  }

  return positions;
};

const findMostRelevantTransit = (
  question: string,
  natalPositions: Record<string, ZodiacPosition>,
  todayPositions: Record<string, ZodiacPosition>
): {
  planet1: { name: string; longitude: number; icon: string };
  planet2: { name: string; longitude: number; icon: string };
  aspect: { type: string; angle: number };
} | null => {
  const questionLower = question.toLowerCase();

  const categoryKeywords: Record<string, string[]> = {
    self: [
      "who am i",
      "what do i want",
      "happy",
      "afraid",
      "love myself",
      "purpose",
      "authentic",
      "let go",
    ],
    love: [
      "love",
      "partner",
      "relationship",
      "deserve",
      "blocking",
      "patterns",
      "receiving",
    ],
    work: [
      "career",
      "fulfilled",
      "calling",
      "potential",
      "jobs",
      "avoiding",
      "paid",
      "skills",
      "values",
    ],
    social: ["friends", "friendships", "cool", "talking", "believe", "group"],
  };

  let relevantPlanets: string[] = [];

  if (categoryKeywords.self.some((k) => questionLower.includes(k))) {
    relevantPlanets = ["moon", "sun", "saturn", "mars"];
  } else if (categoryKeywords.love.some((k) => questionLower.includes(k))) {
    relevantPlanets = ["venus", "moon", "mars", "jupiter"];
  } else if (categoryKeywords.work.some((k) => questionLower.includes(k))) {
    relevantPlanets = ["saturn", "sun", "mercury", "jupiter"];
  } else if (categoryKeywords.social.some((k) => questionLower.includes(k))) {
    relevantPlanets = ["moon", "venus", "jupiter", "mercury"];
  } else {
    relevantPlanets = ["moon", "sun", "venus", "mars"];
  }

  let bestTransit: {
    planet1: { name: string; longitude: number; icon: string };
    planet2: { name: string; longitude: number; icon: string };
    aspect: { type: string; angle: number };
    relevance: number;
  } | null = null;

  for (const planet1Key of relevantPlanets) {
    if (!natalPositions[planet1Key] || !todayPositions[planet1Key]) continue;

    const natalPos = natalPositions[planet1Key];
    const todayPos = todayPositions[planet1Key];

    for (const planet2Key of Object.keys(natalPositions)) {
      if (planet1Key === planet2Key) continue;
      if (!todayPositions[planet2Key]) continue;

      const natalPos2 = natalPositions[planet2Key];
      const todayPos2 = todayPositions[planet2Key];

      const angle1 = angularDistance(todayPos.longitude, natalPos2.longitude);
      const angle2 = angularDistance(todayPos.longitude, todayPos2.longitude);

      const aspect1 = getAspect(angle1);
      const aspect2 = getAspect(angle2);

      if (aspect1) {
        const p1Relevance =
          relevantPlanets.indexOf(planet1Key) >= 0
            ? relevantPlanets.length - relevantPlanets.indexOf(planet1Key)
            : 0;
        const p2Relevance =
          relevantPlanets.indexOf(planet2Key) >= 0
            ? relevantPlanets.length - relevantPlanets.indexOf(planet2Key)
            : 0;
        const orbBonus = aspect1.orb < 3 ? 10 : 0;
        const transitBonus = 20;
        const relevance = p1Relevance + p2Relevance + orbBonus + transitBonus;
        if (!bestTransit || relevance > bestTransit.relevance) {
          bestTransit = {
            planet1: {
              name: PLANET_NAMES[planet1Key],
              longitude: todayPos.longitude,
              icon: PLANET_ICONS[planet1Key] || "/planets/sun.svg",
            },
            planet2: {
              name: PLANET_NAMES[planet2Key],
              longitude: natalPos2.longitude,
              icon: PLANET_ICONS[planet2Key] || "/planets/sun.svg",
            },
            aspect: {
              type: aspect1.type,
              angle: angle1,
            },
            relevance,
          };
        }
      }

      if (aspect2) {
        const p1Relevance =
          relevantPlanets.indexOf(planet1Key) >= 0
            ? relevantPlanets.length - relevantPlanets.indexOf(planet1Key)
            : 0;
        const p2Relevance =
          relevantPlanets.indexOf(planet2Key) >= 0
            ? relevantPlanets.length - relevantPlanets.indexOf(planet2Key)
            : 0;
        const orbBonus = aspect2.orb < 3 ? 10 : 0;
        const relevance = p1Relevance + p2Relevance + orbBonus;
        if (!bestTransit || relevance > bestTransit.relevance) {
          bestTransit = {
            planet1: {
              name: PLANET_NAMES[planet1Key],
              longitude: todayPos.longitude,
              icon: PLANET_ICONS[planet1Key] || "/planets/sun.svg",
            },
            planet2: {
              name: PLANET_NAMES[planet2Key],
              longitude: todayPos2.longitude,
              icon: PLANET_ICONS[planet2Key] || "/planets/sun.svg",
            },
            aspect: {
              type: aspect2.type,
              angle: angle2,
            },
            relevance,
          };
        }
      }
    }
  }

  if (!bestTransit) {
    const moonToday = todayPositions.moon;
    const sunToday = todayPositions.sun;
    const angle = angularDistance(moonToday.longitude, sunToday.longitude);
    const aspect = getAspect(angle) || { type: "None", orb: angle };

    return {
      planet1: {
        name: "Moon",
        longitude: moonToday.longitude,
        icon: PLANET_ICONS.moon,
      },
      planet2: {
        name: "Sun",
        longitude: sunToday.longitude,
        icon: PLANET_ICONS.sun,
      },
      aspect: {
        type: aspect.type,
        angle: aspect.orb,
      },
    };
  }

  return {
    planet1: bestTransit.planet1,
    planet2: bestTransit.planet2,
    aspect: bestTransit.aspect,
  };
};

const callGemini = async (
  question: string,
  transit: {
    planet1: { name: string; longitude: number };
    planet2: { name: string; longitude: number };
    aspect: { type: string; angle: number };
  },
  natalChart: Record<string, ZodiacPosition>
): Promise<string> => {
  try {
    const aspectDescription =
      transit.aspect.type !== "None"
        ? `${transit.planet1.name} ${transit.aspect.type.toLowerCase()} ${
            transit.planet2.name
          }`
        : `${transit.planet1.name} and ${transit.planet2.name} are in relationship`;

    const planet1Sign = zodiacFromLongitude(transit.planet1.longitude);
    const planet2Sign = zodiacFromLongitude(transit.planet2.longitude);

    const prompt = `You are an astrologer providing deeply personal, emotionally reflective guidance. Answer this question with wisdom, empathy, and insight based on astrological transits.

Question: ${question}

Current Transit: ${aspectDescription}
Planet 1: ${transit.planet1.name} at ${transit.planet1.longitude.toFixed(
      2
    )}° (${planet1Sign.sign} ${planet1Sign.degreeInsideSign.toFixed(1)}°)
Planet 2: ${transit.planet2.name} at ${transit.planet2.longitude.toFixed(
      2
    )}° (${planet2Sign.sign} ${planet2Sign.degreeInsideSign.toFixed(1)}°)
Aspect Type: ${transit.aspect.type}
Aspect Angle: ${transit.aspect.angle.toFixed(2)}°

CRITICAL INSTRUCTIONS:
- YOUR ANSWER MUST START WITH EITHER "Yes", "No", OR "Maybe" - choose the one that best answers their question based on the astrological transit
- STRUCTURE YOUR ANSWER IN TWO PARTS:
  1. FIRST LINE: Start with "Yes", "No", or "Maybe" followed by a clear, direct answer to their question in one sentence
  2. FOLLOWING PARAGRAPHS: Detailed explanation (3-4 sentences) that expands on the first line
  
- Write in second person ("you", "your") speaking directly to the person
- Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their emotional experience, inner world, feelings, reactions
- Focus 20% on the astrology (brief mention is fine)
- Make it deeply emotional and reflective: help them understand what they're feeling and why
- Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're reacting...", "This could show up as..."
- Describe their inner emotional experience in detail: what does this feel like?
- Help them understand the reasoning behind their feelings and reactions
- Make it feel like a trusted friend helping them understand their patterns
- The tone should be gentle, reflective, and reassuring
- Base your answer on correct astrological reasoning about what this transit means
- Do not make absolute claims or predictions
- Total length: 4-6 sentences (1 clear answer sentence starting with Yes/No/Maybe + 3-5 detail sentences)

Format your response exactly like this:
[Yes/No/Maybe, clear one-sentence answer to their question]. [Then continue with detailed explanation in the following sentences, expanding on what this means for them emotionally and practically].`;

    const text = await callAI(prompt);
    return (
      text || "The stars are aligning to reveal insights. Trust the process."
    );
  } catch (error) {
    console.error("AI API error:", error);
    return "The stars are aligning to reveal insights. Trust the process.";
  }
};

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      const error = { error: "Unauthorized", status: 401, user: user };
      console.error("Ask API error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { question } = await req.json();

    if (!question || typeof question !== "string") {
      const error = { error: "Question is required", status: 400 };
      console.error("Ask API error:", error);
      return NextResponse.json(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      const error = { error: "User not found", status: 404, email: user.email };
      console.error("Ask API error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = DateTime.now().setZone(dbUser.birthTimezone).startOf("day");
    const questionHash = createHash("sha256")
      .update(question.toLowerCase().trim())
      .digest("hex");

    const cached = await getCachedGeneration(
      dbUser.id,
      "ask",
      today,
      questionHash
    );

    if (cached) {
      return NextResponse.json(cached);
    }

    const natalUtc = DateTime.fromJSDate(dbUser.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const natalAstroTime = createAstroTime(natalJsDate);

    const natalAscendant = getAscendant(
      natalAstroTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const natalPositions: Record<string, ZodiacPosition> = {};
    for (const [key, body] of Object.entries(PLANET_BODIES)) {
      if (key === "sun") {
        natalPositions[key] = calculateSunPosition(natalAstroTime);
      } else if (key === "moon") {
        natalPositions[key] = calculateMoonPosition(natalAstroTime);
      } else {
        natalPositions[key] = calculatePlanetPosition(natalAstroTime, body);
      }
    }
    natalPositions.ascendant = natalAscendant;

    const todayPositions = calculateTodayPlanetPositions(dbUser.birthTimezone);

    const transit = findMostRelevantTransit(
      question,
      natalPositions,
      todayPositions
    );

    if (!transit) {
      const error = { error: "Could not calculate transit", status: 500 };
      console.error("Ask API error:", error);
      return NextResponse.json(
        { error: "Could not calculate transit" },
        { status: 500 }
      );
    }

    const answer = await callGemini(question, transit, natalPositions);

    const planet1Sign = zodiacFromLongitude(transit.planet1.longitude);
    const planet2Sign = zodiacFromLongitude(transit.planet2.longitude);

    const response = {
      answer,
      transit: {
        planet1: {
          ...transit.planet1,
          sign: planet1Sign.sign,
          degree: planet1Sign.degreeInsideSign,
        },
        planet2: {
          ...transit.planet2,
          sign: planet2Sign.sign,
          degree: planet2Sign.degreeInsideSign,
        },
        aspect: transit.aspect,
      },
    };

    await setCachedGeneration(dbUser.id, "ask", today, response, questionHash);

    return NextResponse.json(response);
  } catch (err: any) {
    console.error("Ask API error:", {
      message: err.message,
      stack: err.stack,
      error: err,
    });
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
