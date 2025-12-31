import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { callAI } from "@/lib/ai/client";
import {
  getCachedGeneration,
  setCachedGeneration,
} from "@/lib/ai/cache";
import {
  angularDistance,
  getAspect,
  getAscendant,
  getWholeSignHouses,
  assignPlanetToHouse,
  calculateMoonPosition,
  calculatePlanetPosition,
  createAstroTime,
} from "@/lib/astrology/calculations";
import type { ZodiacPosition } from "@/types/chart";

const ASPECT_ORB = 6;

type RoutineSignalStrength = "Grounding" | "Heavy" | "Neutral";

type RoutineData = {
  theme: string;
  signalStrength: RoutineSignalStrength;
  moonAspect: {
    planet: "Mercury" | "Saturn" | null;
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: ZodiacPosition;
  moonHouse: number;
  moonSign: string;
  natalMercury: ZodiacPosition;
  natalSaturn: ZodiacPosition;
  summary: string;
  explanation: string;
  encouragement: string;
  logicalBullets: string[];
};

const calculateTodayMoonPosition = (
  timezone: string
): ZodiacPosition => {
  const now = DateTime.now().setZone(timezone);
  const utcNow = now.toUTC();
  const utcJsDate = utcNow.toJSDate();
  const astroTime = createAstroTime(utcJsDate);

  return calculateMoonPosition(astroTime);
};

const calculateNatalMercury = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Mercury);
};

const calculateNatalSaturn = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Saturn);
};

const compareMoonToPlanets = (
  moonToday: ZodiacPosition,
  natalMercury: ZodiacPosition,
  natalSaturn: ZodiacPosition
): { planet: "Mercury" | "Saturn" | null; aspectType: string | null; angle: number } => {
  const mercuryAngle = angularDistance(moonToday.longitude, natalMercury.longitude);
  const saturnAngle = angularDistance(moonToday.longitude, natalSaturn.longitude);

  const mercuryAspect = getAspect(mercuryAngle);
  const saturnAspect = getAspect(saturnAngle);

  if (saturnAspect) {
    return {
      planet: "Saturn",
      aspectType: saturnAspect.type,
      angle: saturnAngle,
    };
  }

  if (mercuryAspect) {
    return {
      planet: "Mercury",
      aspectType: mercuryAspect.type,
      angle: mercuryAngle,
    };
  }

  return {
    planet: null,
    aspectType: null,
    angle: mercuryAngle < saturnAngle ? mercuryAngle : saturnAngle,
  };
};

const determineSignalStrength = (
  moonAspect: { planet: "Mercury" | "Saturn" | null; aspectType: string | null },
  moonHouse: number
): RoutineSignalStrength => {
  if (moonHouse === 6) {
    return "Grounding";
  }

  if (moonAspect.planet === "Saturn" && moonAspect.aspectType) {
    const lower = moonAspect.aspectType.toLowerCase();
    if (lower === "square" || lower === "opposition" || lower === "conjunction") {
      return "Heavy";
    }
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    const lower = moonAspect.aspectType.toLowerCase();
    if (lower === "trine" || lower === "sextile" || lower === "conjunction") {
      return "Grounding";
    }
  }

  return "Neutral";
};

const determineTheme = (
  moonAspect: { planet: "Mercury" | "Saturn" | null; aspectType: string | null },
  moonHouse: number
): string => {
  if (moonHouse === 6) {
    return "Daily demands and self-care";
  }

  if (moonAspect.planet === "Saturn" && moonAspect.aspectType) {
    const lower = moonAspect.aspectType.toLowerCase();
    if (lower === "square" || lower === "opposition") {
      return "Pressure and responsibility";
    }
    return "Discipline and structure";
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    return "Mental focus and organization";
  }

  return "Routine and rhythm";
};

const buildLogicalBullets = (
  moonAspect: { planet: "Mercury" | "Saturn" | null; aspectType: string | null },
  moonHouse: number,
  moonSign: string
): string[] => {
  const bullets: string[] = [];

  if (moonHouse === 6) {
    bullets.push("Moon in 6th house activates daily demands and self-care");
    bullets.push("Focus on how body and mind respond to routine");
  }

  if (moonAspect.planet === "Saturn") {
    bullets.push("Moon is activating Saturn's themes of discipline and responsibility");
    bullets.push("Structure may feel either grounding or heavy");
  }

  if (moonAspect.planet === "Mercury") {
    bullets.push("Moon is activating Mercury's themes of mental focus and organization");
    bullets.push("Energy for routine and productivity is highlighted");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing routine and daily rhythm");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  moonAspect: { planet: "Mercury" | "Saturn" | null; aspectType: string | null },
  signalStrength: RoutineSignalStrength,
  logicalBullets: string[],
  moonHouse: number,
  moonSign: string,
  aspectAngle: number | null
): Promise<{ summary: string; explanation: string; encouragement: string }> => {
  try {

    const aspectText = moonAspect.aspectType 
      ? `${moonAspect.planet} ${moonAspect.aspectType.toLowerCase()}`
      : "no major aspect";
    const tone = signalStrength === "Heavy" ? "gentle and reassuring" : "supportive and practical";

    const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S relationship with routine, structure, and daily life today. Write as if speaking directly to them about their capacity for self-care and productivity.

Theme: ${theme}
Moon Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Moon House: ${moonHouse}
Moon Sign: ${moonSign}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
Write in second person ("you", "your") speaking directly to the person
Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their energy, capacity, relationship with structure, need for rest or productivity
Focus 20% on the astrology (brief mention is fine)
Make it deeply emotional and reflective: help them understand their relationship with routine
Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're responding to...", "This could show up as..."
Describe their inner experience of routine and structure: what does this feel like? What do they need?
Help them understand why their energy for routine rises and falls
Make it feel like a trusted friend helping them understand their capacity and needs
The tone should be gentle and reassuring: NOT judging their ability to stay consistent
Do not introduce new planets beyond Moon, Mercury, and Saturn
Do not mention astrology terms not provided
Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Routine" title): 3-4 sentences describing HOW THEY'RE EXPERIENCING ROUTINE AND STRUCTURE TODAY. What might they notice about their energy? How might structure feel: grounding or restrictive? What patterns might emerge?

2. One explanatory paragraph (under the graph): 3-4 sentences that BRIEFLY mentions the Moon and Mercury/Saturn relationship but FOCUSES on what this means FOR THEM. How does this show up in their daily life? What does this reveal about their capacity and needs for self-care?

3. One closing encouragement paragraph: 3-4 sentences offering deep, personal reflection. Help them understand their relationship with routine better. What should they pay attention to? What might this teach them about listening to their capacity rather than forcing productivity?

Format your response as JSON:
{
  "summary": "...",
  "explanation": "...",
  "encouragement": "..."
}`;

    const text = await callAI(prompt);

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || "Your routine energy invites attention today.",
          explanation: parsed.explanation || "The Moon's position activates themes of daily rhythm and self-care.",
          encouragement: parsed.encouragement || "Listen to your capacity and honor what your body and mind need.",
        };
      }
    } catch (e) {
      console.error("Failed to parse AI response:", e);
    }
  } catch (e) {
    console.error("Failed to call AI API:", e);
  }

  let summary = "You might notice yourself feeling more aware of your daily rhythm and structure today. Perhaps you're feeling more drawn to routine, or maybe you're noticing that your usual structure feels different. Pay attention to how you're experiencing your relationship with routine. This is showing you something important about what you need for self-care.";
  let explanation = "Your relationship with routine and structure is asking for more attention today. You might find yourself feeling more aware of how your body and mind respond to daily demands, or noticing that structure feels either grounding or restrictive. Notice how this shows up for you. Are you craving more routine? Feeling overwhelmed by it? Your reactions are revealing something important about your capacity and needs for self-care.";
  let encouragement = "When you notice yourself feeling drawn to structure or needing more flexibility, trust that. Your energy for routine rises and falls. Both responses are valid. Listen to your capacity today. If routine feels grounding, embrace it. If it feels heavy, honor that too. Forcing productivity when your capacity is low often backfires. What are your reactions showing you about what you truly need?";

  if (moonHouse === 6) {
    summary = "You might notice yourself feeling more aware of your daily demands and self-care needs today. Perhaps you're feeling more sensitive to how structure feels: either grounding or restrictive, or maybe you're noticing that your body and mind are asking for more attention. Pay attention to how you're experiencing routine. This is showing you something important about your capacity.";
    explanation = `Your relationship with routine and self-care is being activated today. You might find yourself feeling more aware of what your body and mind need to function well, or noticing that structure feels either supportive or draining. Notice how this shows up for you. Are you craving more routine? Feeling overwhelmed by it? Your reactions are revealing something important about your authentic needs for structure and self-care.`;
    encouragement = "When you notice yourself craving structure or needing more flexibility, trust that. Both responses are valid. Listen to your capacity today. If routine feels grounding, embrace it. If it feels heavy, honor that too. Your energy for routine rises and falls, and forcing productivity when your capacity is low often backfires. What are your reactions showing you about what you truly need?";
  }

  if (moonAspect.planet === "Saturn" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more aware of responsibility and discipline today. Perhaps you're feeling more sensitive to how structure feels: either supportive or restrictive, or maybe you're noticing that the pressure of daily demands feels heavier. Pay attention to how you're experiencing discipline. This is showing you something important about your relationship with routine.";
    explanation = `Your relationship with discipline and responsibility is being activated today. You might find yourself feeling more aware of the effort required to maintain routines, or noticing that structure feels either grounding or heavy. Notice how this shows up for you. Are you feeling more burdened by responsibility? More supported by structure? Your reactions are revealing something important about your authentic needs for routine and self-care.`;
    encouragement = "When you notice yourself feeling supported by structure or burdened by it, trust that. Both responses are valid. If structure feels supportive today, embrace it. If it feels restrictive or draining, honor that too. Your energy for routine rises and falls. Some days you need more structure for safety, while other days the same structure can feel like a burden. Listen to your capacity. What are your reactions showing you about what you truly need?";
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more focused or organized today. Perhaps you're feeling more able to organize tasks, or maybe you're noticing that mental clarity feels more accessible. Pay attention to how you're experiencing your thinking. This is showing you something important about your capacity for structure.";
    explanation = `Your mental focus and organization are being activated today. You might find yourself feeling more aware of how routine supports your clarity, or noticing that you're more able to organize your daily life. Notice how this shows up for you. Are you feeling more focused? More supported by structure? Your reactions are revealing something important about your authentic needs for mental clarity and routine.`;
    encouragement = "When you notice yourself feeling more focused or organized, honor that. However, remember that your energy for routine rises and falls. Some days structure feels grounding, while other days it can feel restrictive. Both responses are valid. Listen to your capacity today. If you're feeling more focused, use that. If you're feeling scattered, honor that too. What are your reactions showing you about what you truly need?";
  }

  if (!moonAspect.aspectType && moonHouse !== 6) {
    const angleText = aspectAngle ? `approximately ${Math.round(aspectAngle)} degrees` : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Mercury and Saturn positions, and moving through the ${moonHouse}th house. While there isn't a tight aspect or 6th house activation, the Moon's movement still brings subtle attention to your daily rhythm and capacity for routine. The 6th house shows how your body and mind respond to daily demands, Mercury reflects mental focus and organization, and Saturn represents discipline and the pressure of responsibility. Even without a major activation, the Moon's position invites you to notice your energy for routine and to be aware of whether structure feels grounding or restrictive today.`;
  }

  return {
    summary,
    explanation,
    encouragement,
  };
};

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      const error = { error: "Unauthorized", status: 401, user: user };
      console.error("Routine API error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      const error = { error: "User not found", status: 404, email: user.email };
      console.error("Routine API error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = DateTime.now()
      .setZone(dbUser.birthTimezone)
      .startOf("day");

    const cached = await getCachedGeneration(dbUser.id, "routine", today);

    if (cached) {
      return NextResponse.json({ routine: cached });
    }

    const moonToday = calculateTodayMoonPosition(dbUser.birthTimezone);

    const natalUtc = DateTime.fromJSDate(dbUser.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const natalAstroTime = createAstroTime(natalJsDate);

    const natalAscendant = getAscendant(
      natalAstroTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const moonHouse = assignPlanetToHouse(
      moonToday.signIndex,
      natalAscendant.signIndex
    );

    const natalMercury = calculateNatalMercury(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const natalSaturn = calculateNatalSaturn(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const moonAspect = compareMoonToPlanets(moonToday, natalMercury, natalSaturn);
    const signalStrength = determineSignalStrength(moonAspect, moonHouse);
    const theme = determineTheme(moonAspect, moonHouse);
    const logicalBullets = buildLogicalBullets(moonAspect, moonHouse, moonToday.sign);

    const { summary, explanation, encouragement } = await callGemini(
      theme,
      moonAspect,
      signalStrength,
      logicalBullets,
      moonHouse,
      moonToday.sign,
      moonAspect.angle
    );

    const routineData: RoutineData = {
      theme,
      signalStrength,
      moonAspect: {
        planet: moonAspect.planet,
        aspectType: moonAspect.aspectType,
        angle: moonAspect.angle,
      },
      moonToday,
      moonHouse,
      moonSign: moonToday.sign,
      natalMercury,
      natalSaturn,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    await setCachedGeneration(dbUser.id, "routine", today, routineData);

    return NextResponse.json({ routine: routineData });
  } catch (err: any) {
    console.error("Routine error:", {
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

