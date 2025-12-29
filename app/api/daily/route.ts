import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { HOUSE_RULERS } from "@/constants/astrology";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/constants/ai";
import {
  angularDistance,
  getAspect,
  getAscendant,
  getWholeSignHouses,
  assignPlanetToHouse,
  calculateSunPosition,
  calculateMoonPosition,
  calculatePlanetPosition,
  createAstroTime,
} from "@/lib/astrology/calculations";
import type { ZodiacPosition, Aspect } from "@/types/chart";

const WATER_SIGNS = ["Cancer", "Scorpio", "Pisces"];
const FIRE_SIGNS = ["Aries", "Leo", "Sagittarius"];
const EARTH_SIGNS = ["Taurus", "Virgo", "Capricorn"];
const AIR_SIGNS = ["Gemini", "Libra", "Aquarius"];

const ANGULAR_HOUSES = [1, 4, 7, 10];
const SUCCEDENT_HOUSES = [2, 5, 8, 11];
const CADENT_HOUSES = [3, 6, 9, 12];

const HARD_ASPECTS = ["Square", "Opposition"];
const SOFT_ASPECTS = ["Trine", "Sextile", "Conjunction"];

type DailySignals = {
  themeSignals: string[];
  tensionSignals: string[];
  supportSignals: string[];
};

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

const calculateMoonAspects = (
  moonPos: ZodiacPosition,
  todayPositions: {
    sun: ZodiacPosition;
    ascendantRuler: ZodiacPosition | null;
    saturn: ZodiacPosition;
    mars: ZodiacPosition;
  }
): Aspect[] => {
  const aspects: Aspect[] = [];
  const planets = [
    { name: "sun", pos: todayPositions.sun },
    { name: "saturn", pos: todayPositions.saturn },
    { name: "mars", pos: todayPositions.mars },
  ];

  if (todayPositions.ascendantRuler) {
    planets.push({ name: "ascendant", pos: todayPositions.ascendantRuler });
  }

  for (const planet of planets) {
    const angle = angularDistance(moonPos.longitude, planet.pos.longitude);
    const aspect = getAspect(angle);
    if (aspect) {
      aspects.push({
        body1: "moon",
        body2: planet.name,
        angle,
        type: aspect.type,
        orb: aspect.orb,
      });
    }
  }

  return aspects;
};

const extractSignals = (
  moonSign: string,
  moonHouse: number,
  moonAspects: Aspect[]
): DailySignals => {
  const themeSignals: string[] = [];
  const tensionSignals: string[] = [];
  const supportSignals: string[] = [];

  if (WATER_SIGNS.includes(moonSign)) {
    themeSignals.push("Moon in water sign");
  } else if (FIRE_SIGNS.includes(moonSign)) {
    themeSignals.push("Moon in fire sign");
  } else if (EARTH_SIGNS.includes(moonSign)) {
    themeSignals.push("Moon in earth sign");
  } else if (AIR_SIGNS.includes(moonSign)) {
    themeSignals.push("Moon in air sign");
  }

  if (ANGULAR_HOUSES.includes(moonHouse)) {
    themeSignals.push("Moon in angular house");
  } else if (SUCCEDENT_HOUSES.includes(moonHouse)) {
    themeSignals.push("Moon in succedent house");
  } else if (CADENT_HOUSES.includes(moonHouse)) {
    themeSignals.push("Moon in cadent house");
  }

  if (moonHouse === 4 || moonHouse === 12) {
    themeSignals.push("Moon in inner emotional house");
  }

  if (moonHouse === 10 || moonHouse === 11) {
    themeSignals.push("Moon in visibility house");
  }

  for (const aspect of moonAspects) {
    const aspectType = aspect.type;
    if (HARD_ASPECTS.includes(aspectType)) {
      tensionSignals.push(`Moon ${aspectType.toLowerCase()} ${aspect.body2}`);
    } else if (SOFT_ASPECTS.includes(aspectType)) {
      supportSignals.push(`Moon ${aspectType.toLowerCase()} ${aspect.body2}`);
    }
  }

  return { themeSignals, tensionSignals, supportSignals };
};

const determineTheme = (signals: DailySignals): string => {
  const { themeSignals, tensionSignals, supportSignals } = signals;

  if (themeSignals.includes("Moon in inner emotional house")) {
    return "Emotional reflection";
  }

  if (themeSignals.includes("Moon in visibility house")) {
    return "Social visibility";
  }

  if (tensionSignals.some((s) => s.includes("saturn"))) {
    return "Inner pressure and responsibility";
  }

  if (supportSignals.some((s) => s.includes("sun"))) {
    return "Creative flow";
  }

  if (tensionSignals.some((s) => s.includes("mars"))) {
    return "Boundary setting";
  }

  if (supportSignals.some((s) => s.includes("ascendant"))) {
    return "Communication and clarity";
  }

  if (tensionSignals.length > supportSignals.length) {
    return "Inner pressure and responsibility";
  }

  if (supportSignals.length > tensionSignals.length) {
    return "Creative flow";
  }

  return "Emotional reflection";
};

const determineTone = (theme: string): string => {
  if (theme.includes("pressure") || theme.includes("responsibility")) {
    return "Gentle and reassuring";
  }
  if (theme.includes("visibility") || theme.includes("Social")) {
    return "Motivating and confident";
  }
  if (theme.includes("Emotional") || theme.includes("reflection")) {
    return "Gentle and reassuring";
  }
  if (theme.includes("flow") || theme.includes("Creative")) {
    return "Grounded and practical";
  }
  return "Quiet and reflective";
};

const generateDoDontLists = (
  signals: DailySignals,
  moonAspects: Aspect[],
  moonHouse: number
): { doList: string[]; dontList: string[] } => {
  const doList: string[] = [];
  const dontList: string[] = [];

  const hasSaturnAspect = moonAspects.some((a) => a.body2 === "saturn");
  const hasMarsAspect = moonAspects.some((a) => a.body2 === "mars");
  const hasSunAspect = moonAspects.some((a) => a.body2 === "sun");

  if (hasSaturnAspect) {
    const saturnAspect = moonAspects.find((a) => a.body2 === "saturn");
    if (saturnAspect && HARD_ASPECTS.includes(saturnAspect.type)) {
      doList.push("slow decisions");
      dontList.push("self criticize");
    }
  }

  if (moonHouse === 7) {
    doList.push("talk things out");
    dontList.push("assume intent");
  }

  if (hasMarsAspect) {
    const marsAspect = moonAspects.find((a) => a.body2 === "mars");
    if (marsAspect && HARD_ASPECTS.includes(marsAspect.type)) {
      doList.push("set clear boundaries");
      dontList.push("react impulsively");
    }
  }

  if (hasSunAspect) {
    const sunAspect = moonAspects.find((a) => a.body2 === "sun");
    if (sunAspect && SOFT_ASPECTS.includes(sunAspect.type)) {
      doList.push("express yourself");
      dontList.push("hold back");
    }
  }

  if (signals.themeSignals.includes("Moon in inner emotional house")) {
    doList.push("take quiet time");
    dontList.push("overcommit socially");
  }

  if (signals.themeSignals.includes("Moon in visibility house")) {
    doList.push("show your work");
    dontList.push("hide your light");
  }

  if (doList.length === 0) {
    doList.push("trust your instincts");
  }

  if (dontList.length === 0) {
    dontList.push("rush decisions");
  }

  return { doList: doList.slice(0, 3), dontList: dontList.slice(0, 3) };
};

const callGemini = async (
  theme: string,
  tone: string,
  doList: string[],
  dontList: string[],
  signals: DailySignals
): Promise<{ headline: string; bullets: string[]; closing: string[] }> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S experience today. Write as if speaking directly to them about their inner world, feelings, and patterns. The astrology has already been calculated - focus on HOW IT AFFECTS THEM PERSONALLY.

Theme: ${theme}
Tone: ${tone}
DO list: ${doList.join(", ")}
DON'T list: ${dontList.join(", ")}
Signals: ${JSON.stringify(signals)}

CRITICAL INSTRUCTIONS:
- Write in second person ("you", "your") speaking directly to the person
- Focus 80% on HOW THIS AFFECTS THEM PERSONALLY - their feelings, reactions, patterns, inner experience
- Focus 20% on astrology (brief mentions are fine, but make it about them)
- Make it deeply emotional and reflective - help them understand what they're experiencing
- Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how...", "This could show up as..."
- Describe their inner experience in vivid detail - what does this feel like emotionally and mentally?
- Help them understand their patterns and reactions
- Make it feel like a trusted friend having a meaningful conversation
- Do not introduce new astrology concepts
- Do not make absolute claims
- Avoid fatalism - feels like advice not prophecy

Generate:
1. One short headline (one sentence, reflects HOW THEY'RE EXPERIENCING TODAY PERSONALLY, feels deeply personal and emotional, no absolute claims)

2. Three to four bullet points in this specific format:
   - Use descriptive phrases like "Power in social life", "Pressure in self", "Trouble with routine, thinking & creativity, spirituality, and sex & love"
   - Each bullet should describe an area of focus, energy, or challenge FOR THEM
   - Use phrases like "Power in...", "Pressure in...", "Trouble with...", "Focus on...", "Energy in..."
   - If listing multiple items, use commas and "and" before the last item
   - Make them feel specific and actionable

3. A detailed closing section with 4-5 substantial paragraphs (each paragraph should be 3-4 full sentences, minimum 50 words per paragraph) that:
   - First paragraph: Describes in vivid detail WHAT THEY'RE EXPERIENCING emotionally and mentally. Paint a picture of their inner world. Use "you" and describe their feelings, reactions, and patterns.
   - Second paragraph: Explores WHAT'S HAPPENING BENEATH THE SURFACE FOR THEM. What patterns are showing up? What does this reveal about their needs, fears, or desires? Help them understand themselves better.
   - Third paragraph: Offers practical guidance SPECIFIC TO THEIR EXPERIENCE. What should they pay attention to? How can they work with what they're feeling? Make it personal and actionable.
   - Fourth paragraph: Connects THEIR EXPERIENCE to broader patterns or growth opportunities. How does today fit into their larger journey? What might this teach them about themselves?
   - Fifth paragraph (optional): Ends with deep personal reflection and reassurance. Help them understand their agency and capacity. Leave them feeling seen and understood.
   - Write as if speaking directly to them about their experience
   - Should be substantial, thoughtful, and deeply personal
   - Each paragraph must be rich with emotional insight and feel complete on its own
   - Example format:
     ["Today you feel torn between the pressure to let your guard down and your love of safety and security. It's good to draw boundaries if that's what you need, but notice where that instinct comes from. Are you protecting yourself from something real, or are you avoiding the vulnerability that comes with connection? This tension isn't random—it's showing you what matters most to you right now.",
     "Just make sure you're not doing that thing where you shut down, and then convince yourself that it is self-centered to make requests of others. The truth is, you can honor your need for space while still being present for the people who matter. The challenge isn't choosing between boundaries and connection—it's learning to hold both at once. What if your boundaries could actually deepen your relationships instead of creating distance?",
     "The tension you're experiencing isn't a flaw—it's information about what matters to you. Pay attention to where you feel pulled in different directions, because those are the places where growth is waiting. When you feel conflicted, it usually means you're trying to honor multiple important values at once. The work isn't to eliminate the tension, but to understand it better and find ways to honor all parts of yourself.",
     "Expand the definition of who you are and trust that you can hold both needs at once without having to choose one over the other. You don't have to be either guarded or open—you can be both, depending on what the moment calls for. This flexibility is actually a strength, not a weakness. Trust yourself to know when to draw boundaries and when to let people in, and remember that both are valid expressions of self-care."]

Format your response as JSON:
{
  "headline": "...",
  "bullets": ["Power in social life", "Pressure in self", "Trouble with routine, thinking & creativity, spirituality, and sex & love"],
  "closing": ["First paragraph (2-3 sentences)...", "Second paragraph (2-3 sentences)...", "Third paragraph (2-3 sentences)...", "Fourth paragraph (2-3 sentences, optional)..."]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            headline:
              parsed.headline || "Today brings opportunities for reflection",
            bullets: parsed.bullets || [],
            closing:
              Array.isArray(parsed.closing) && parsed.closing.length >= 4
                ? parsed.closing
                : parsed.closing
                ? [parsed.closing]
                : [
                    "Today brings opportunities for reflection and growth, but it might not feel that way at first. You may notice yourself pulled in different directions, feeling the weight of expectations—both your own and others'. This is normal, especially when the moon's energy highlights areas where you're still learning to balance competing needs. The key is to recognize that this tension isn't a problem to solve, but information about what matters most to you right now.",
                    "Beneath the surface of whatever challenges or opportunities are showing up today, there's a deeper pattern at play. The energy is asking you to look at how you've been moving through your life—are you honoring all parts of yourself, or have you been prioritizing one aspect while neglecting another? This isn't about finding fault, but about recognizing where you might need to bring more balance. The discomfort you feel is often a sign that something important wants your attention.",
                    "The practical work today is to notice without judgment. When you feel pulled in different directions, pause and ask yourself what each part of you is trying to say. Maybe your need for rest is just as valid as your drive to accomplish things. Perhaps your desire for connection deserves as much space as your need for independence. The guidance isn't to choose one over the other, but to find ways to honor both. This might mean setting clearer boundaries in some areas while opening up more in others.",
                    "Remember that you're not broken or doing something wrong if you feel conflicted or uncertain. These feelings are part of being human, and they're especially common when you're growing and changing. Trust that you have the capacity to hold complexity, to honor multiple needs at once, and to make choices that feel right for you in each moment. You don't have to have everything figured out today—sometimes the most important thing is just to show up and pay attention to what's here.",
                  ],
          };
        }
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
      }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  return {
    headline: "Today brings opportunities for reflection",
    bullets: [
      "Power in social life",
      "Pressure in self",
      "Trouble with routine, thinking & creativity, spirituality, and sex & love",
    ],
    closing: [
      "Today you feel torn between the pressure to let your guard down and your love of safety and security. It's good to draw boundaries if that's what you need, but notice where that instinct comes from. Are you protecting yourself from something real, or are you avoiding the vulnerability that comes with connection? This tension isn't random—it's showing you what matters most to you right now.",
      "Just make sure you're not doing that thing where you shut down, and then convince yourself that it is self-centered to make requests of others. The truth is, you can honor your need for space while still being present for the people who matter. The challenge isn't choosing between boundaries and connection—it's learning to hold both at once. What if your boundaries could actually deepen your relationships instead of creating distance?",
      "The tension you're experiencing isn't a flaw—it's information about what matters to you. Pay attention to where you feel pulled in different directions, because those are the places where growth is waiting. When you feel conflicted, it usually means you're trying to honor multiple important values at once. The work isn't to eliminate the tension, but to understand it better and find ways to honor all parts of yourself.",
      "Expand the definition of who you are and trust that you can hold both needs at once without having to choose one over the other. You don't have to be either guarded or open—you can be both, depending on what the moment calls for. This flexibility is actually a strength, not a weakness. Trust yourself to know when to draw boundaries and when to let people in, and remember that both are valid expressions of self-care.",
    ],
  };
};

const getDailyWindow = (
  timezone: string
): { start: DateTime; end: DateTime } => {
  const now = DateTime.now().setZone(timezone);
  const start = now.startOf("day");
  const end = now.endOf("day");
  return { start, end };
};

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { start, end } = getDailyWindow(dbUser.birthTimezone);
    const today = DateTime.now().setZone(dbUser.birthTimezone).startOf("day");

    const now = DateTime.now().setZone(dbUser.birthTimezone);
    const utcNow = now.toUTC();

    const utcJsDate = utcNow.toJSDate();
    const astroTime = createAstroTime(utcJsDate);

    const natalUtc = DateTime.fromJSDate(dbUser.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const natalAstroTime = createAstroTime(natalJsDate);

    const moonToday = calculateMoonPosition(astroTime);
    const natalAscendant = getAscendant(
      natalAstroTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const natalHouses = getWholeSignHouses(natalAscendant);
    const moonHouse = assignPlanetToHouse(
      moonToday.signIndex,
      natalAscendant.signIndex
    );

    const sunToday = calculateSunPosition(astroTime);
    const saturnToday = calculatePlanetPosition(
      astroTime,
      Astronomy.Body.Saturn
    );
    const marsToday = calculatePlanetPosition(astroTime, Astronomy.Body.Mars);

    const ascendantRulerPlanet = HOUSE_RULERS[natalAscendant.sign];
    let ascendantRulerToday: ZodiacPosition | null = null;
    if (ascendantRulerPlanet === "sun") {
      ascendantRulerToday = sunToday;
    } else if (ascendantRulerPlanet === "moon") {
      ascendantRulerToday = moonToday;
    } else if (ascendantRulerPlanet === "mercury") {
      ascendantRulerToday = calculatePlanetPosition(
        astroTime,
        Astronomy.Body.Mercury
      );
    } else if (ascendantRulerPlanet === "venus") {
      ascendantRulerToday = calculatePlanetPosition(
        astroTime,
        Astronomy.Body.Venus
      );
    } else if (ascendantRulerPlanet === "mars") {
      ascendantRulerToday = marsToday;
    } else if (ascendantRulerPlanet === "jupiter") {
      ascendantRulerToday = calculatePlanetPosition(
        astroTime,
        Astronomy.Body.Jupiter
      );
    } else if (ascendantRulerPlanet === "saturn") {
      ascendantRulerToday = saturnToday;
    } else if (ascendantRulerPlanet === "uranus") {
      ascendantRulerToday = calculatePlanetPosition(
        astroTime,
        Astronomy.Body.Uranus
      );
    } else if (ascendantRulerPlanet === "neptune") {
      ascendantRulerToday = calculatePlanetPosition(
        astroTime,
        Astronomy.Body.Neptune
      );
    }

    const moonAspects = calculateMoonAspects(moonToday, {
      sun: sunToday,
      ascendantRuler: ascendantRulerToday,
      saturn: saturnToday,
      mars: marsToday,
    });

    const signals = extractSignals(moonToday.sign, moonHouse, moonAspects);
    const theme = determineTheme(signals);
    const tone = determineTone(theme);
    const { doList, dontList } = generateDoDontLists(
      signals,
      moonAspects,
      moonHouse
    );

    const { headline, bullets, closing } = await callGemini(
      theme,
      tone,
      doList,
      dontList,
      signals
    );

    const prediction: DailyPrediction = {
      date: today.toISODate() || "",
      theme,
      tone,
      doList,
      dontList,
      headline,
      bullets,
      closing,
    };

    return NextResponse.json({ prediction });
  } catch (err: any) {
    console.error("Daily prediction error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
