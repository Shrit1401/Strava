import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/constants/ai";
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

type SexLoveSignalStrength = "Active" | "Neutral" | "Complex";

type SexLoveData = {
  theme: string;
  signalStrength: SexLoveSignalStrength;
  moonAspect: {
    planet: "Venus" | "Mars" | null;
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: ZodiacPosition;
  moonHouse: number;
  moonSign: string;
  natalVenus: ZodiacPosition;
  natalMars: ZodiacPosition;
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

const calculateNatalVenus = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Venus);
};

const calculateNatalMars = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Mars);
};

const compareMoonToPlanets = (
  moonToday: ZodiacPosition,
  natalVenus: ZodiacPosition,
  natalMars: ZodiacPosition
): { planet: "Venus" | "Mars" | null; aspectType: string | null; angle: number } => {
  const venusAngle = angularDistance(moonToday.longitude, natalVenus.longitude);
  const marsAngle = angularDistance(moonToday.longitude, natalMars.longitude);

  const venusAspect = getAspect(venusAngle);
  const marsAspect = getAspect(marsAngle);

  if (venusAspect) {
    return {
      planet: "Venus",
      aspectType: venusAspect.type,
      angle: venusAngle,
    };
  }

  if (marsAspect) {
    return {
      planet: "Mars",
      aspectType: marsAspect.type,
      angle: marsAngle,
    };
  }

  return {
    planet: null,
    aspectType: null,
    angle: venusAngle < marsAngle ? venusAngle : marsAngle,
  };
};

const determineSignalStrength = (
  moonAspect: { planet: "Venus" | "Mars" | null; aspectType: string | null },
  moonHouse: number
): SexLoveSignalStrength => {
  if (moonHouse === 5 || moonHouse === 8) {
    return "Active";
  }

  if (moonAspect.aspectType) {
    return "Active";
  }

  return "Neutral";
};

const determineTheme = (
  moonAspect: { planet: "Venus" | "Mars" | null; aspectType: string | null },
  moonHouse: number
): string => {
  if (moonHouse === 5) {
    return "Romance and pleasure";
  }

  if (moonHouse === 8) {
    return "Intimacy and transformation";
  }

  if (moonAspect.planet === "Venus" && moonAspect.aspectType) {
    return "Desire for connection and affection";
  }

  if (moonAspect.planet === "Mars" && moonAspect.aspectType) {
    return "Raw attraction and pursuit";
  }

  return "Love and desire";
};

const buildLogicalBullets = (
  moonAspect: { planet: "Venus" | "Mars" | null; aspectType: string | null },
  moonHouse: number,
  moonSign: string
): string[] => {
  const bullets: string[] = [];

  if (moonHouse === 5) {
    bullets.push("Moon in 5th house activates romance, creativity, and pleasure");
    bullets.push("Increased awareness of desire for connection and touch");
  }

  if (moonHouse === 8) {
    bullets.push("Moon in 8th house activates intimacy, transformation, and merging");
    bullets.push("Focus on emotional safety and vulnerability in relationships");
  }

  if (moonAspect.planet === "Venus") {
    bullets.push("Moon is activating Venus's themes of affection and value");
    bullets.push("Awareness of how you give and receive love");
  }

  if (moonAspect.planet === "Mars") {
    bullets.push("Moon is activating Mars's themes of attraction and pursuit");
    bullets.push("Raw desire and sexual drive are highlighted");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing love and desire");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  moonAspect: { planet: "Venus" | "Mars" | null; aspectType: string | null },
  signalStrength: SexLoveSignalStrength,
  logicalBullets: string[],
  moonHouse: number,
  moonSign: string,
  aspectAngle: number | null
): Promise<{ summary: string; explanation: string; encouragement: string }> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const aspectText = moonAspect.aspectType 
      ? `${moonAspect.planet} ${moonAspect.aspectType.toLowerCase()}`
      : "no major aspect";
    const tone = "gentle, honest, and reassuring";

    const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S experience of love, desire, and intimacy today. Write as if speaking directly to them about their relational and intimate life.

Theme: ${theme}
Moon Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Moon House: ${moonHouse}
Moon Sign: ${moonSign}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
Write in second person ("you", "your") speaking directly to the person
Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their desires, emotional needs, vulnerability, boundaries, patterns in relationships
Focus 20% on the astrology (brief mention is fine)
Make it deeply emotional and reflective: help them understand their relational patterns
Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're responding to...", "This could show up as..."
Describe their inner experience of desire, connection, and intimacy: what does this feel like?
Help them understand when desire wants expression, when emotions want reassurance, when intimacy asks for honesty
Make it feel like a trusted confidant helping them understand their relational patterns
The tone should be gentle, honest, and reassuring
Do not introduce new planets beyond Moon, Venus, and Mars
Do not mention astrology terms not provided
Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Sex & Love" title): 3-4 sentences describing HOW THEY'RE EXPERIENCING LOVE AND DESIRE TODAY. What might they notice about their longing? How might they feel about connection? What patterns might emerge in their relationships?

2. One explanatory paragraph (under the graph): 3-4 sentences that BRIEFLY mentions the Moon and Venus/Mars relationship but FOCUSES on what this means FOR THEM. How does this show up in their relationships? What does this reveal about their needs for connection, touch, and emotional safety?

3. One closing encouragement paragraph: 3-4 sentences offering deep, personal reflection. Help them understand their relational patterns better. What should they pay attention to? What might this teach them about when desire wants expression, when emotions want reassurance, and when intimacy asks for honesty?

Format your response as JSON:
{
  "summary": "...",
  "explanation": "...",
  "encouragement": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          summary: parsed.summary || "Your desire for connection feels more present today.",
          explanation: parsed.explanation || "The Moon's position activates themes of love, desire, and intimacy.",
          encouragement: parsed.encouragement || "Honor your needs for connection, touch, and emotional safety.",
        };
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
    }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  let summary = "You might notice yourself feeling more aware of your longing for connection today. Perhaps you're feeling more drawn to intimacy, touch, or emotional merging, or maybe you're noticing that your usual boundaries feel different. Pay attention to how you're experiencing your desire. This is showing you something important about what you need in relationships.";
  let explanation = "Your relationship with love and desire is asking for more attention today. You might find yourself feeling more aware of how you give and receive affection, or noticing that your need for emotional safety feels more present. Notice how this shows up for you. Are you feeling more open to connection? More protective of your boundaries? Your reactions are revealing something important about your authentic needs in relationships.";
  let encouragement = "When you notice yourself feeling drawn to connection or needing space, trust that. Your desires and boundaries are both valid. Pay attention to when desire wants expression, when emotions want reassurance, and when intimacy asks for honesty rather than performance. Your reactions are teaching you about your patterns. What do they show you about what you truly need?";

  if (moonHouse === 5) {
    summary = "You might notice yourself feeling more aware of your longing for romance and pleasure today. Perhaps you're feeling more open to touch, or maybe you're noticing that your desire for connection feels more present. Pay attention to how you're experiencing your longing. This is showing you something important about what you need in relationships.";
    explanation = `Your desire for connection and pleasure is being activated today. You might find yourself feeling more aware of your longing for romance, or noticing that you're more open to experiences that feel joyful and creative. Notice how this shows up for you. Are you feeling more willing to express what you want? More able to receive affection? Your reactions are revealing something important about your authentic needs for connection and pleasure.`;
    encouragement = "When you notice yourself wanting touch, romance, or emotional merging, honor that. These are valid needs. However, remember that desire wants expression, not performance. Be honest about what you want and need. Your emotional safety matters. Honor your boundaries while staying open to connection. What are your desires showing you about what you truly need?";
  }

  if (moonHouse === 8) {
    summary = "You might notice yourself feeling more aware of your vulnerability or capacity for deep connection today. Perhaps you're feeling more protective of your boundaries, or maybe you're noticing that you're more drawn to emotional merging. Pay attention to how you're experiencing intimacy. This is showing you something important about your needs for safety and connection.";
    explanation = `Your relationship with intimacy is being activated today. You might find yourself feeling more aware of your vulnerability, or noticing that you're more conscious of what feels safe and what doesn't. Notice how this shows up for you. Are you feeling more protective? More willing to open up? Your reactions are revealing something important about your authentic needs for emotional safety and deep connection.`;
    encouragement = "When you feel protective of your boundaries, that's your system telling you something feels unsafe. Honor that. When you feel drawn to deep connection, that's your desire for emotional merging. Honor that too. Intimacy asks for honesty, not performance. Trust your instincts about what feels safe and what doesn't. What are your reactions showing you about your needs for safety and connection?";
  }

  if (moonAspect.planet === "Venus" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more aware of your need for affection and connection today. Perhaps you're feeling more sensitive to how you're being valued, or maybe you're noticing that your longing for touch feels more present. Pay attention to how you're experiencing your need for love. This is showing you something important about what makes you feel valued.";
    explanation = `Your need for connection and affection is being activated today. You might find yourself feeling more aware of your longing for emotional bonding, or noticing that you're more sensitive to how you're being valued (or not). Notice how this shows up for you. Are you feeling more open to receiving affection? More aware of what makes you feel desired? Your reactions are revealing something important about your authentic needs for connection and love.`;
    encouragement = "When you notice yourself longing for touch or emotional merging, honor that. Your desire wants expression. It's not something to dismiss or judge. However, remember that love asks for honesty, not performance. Be clear about what makes you feel valued and desired, and communicate your needs honestly. Your emotional safety matters. Honor your boundaries while staying open to connection. What are your reactions showing you about what you truly need?";
  }

  if (moonAspect.planet === "Mars" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more aware of your attraction and desire today. Perhaps you're feeling more drawn to pursue closeness, or maybe you're noticing that your sexual drive feels more active. Pay attention to how you're experiencing your desire. This is showing you something important about what you want in intimacy.";
    explanation = `Your attraction and desire are being activated today. You might find yourself feeling more aware of your sexual drive, or noticing that you're more drawn to pursue connection. Notice how this shows up for you. Are you feeling more willing to express what you want? More protective of your boundaries if something feels unsafe? Your reactions are revealing something important about your authentic needs for intimacy and connection.`;
    encouragement = "When you notice yourself feeling drawn to pursue closeness or express your sexual drive, honor that. Your desire wants expression. It's valid. However, remember that intimacy asks for honesty, not performance. Be clear about what you want and need, and communicate your desires authentically. Your emotional safety matters. Honor your boundaries while staying open to connection. Listen to what each part of you is saying: when does desire want expression? When do emotions want reassurance? When does intimacy ask for honesty?";
  }

  if (!moonAspect.aspectType && moonHouse !== 5 && moonHouse !== 8) {
    const angleText = aspectAngle ? `approximately ${Math.round(aspectAngle)} degrees` : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Venus and Mars positions, and moving through the ${moonHouse}th house. While there isn't a tight aspect or love house activation, the Moon's movement still brings subtle attention to your capacity for love, desire, and intimacy. Venus shows how you give and receive affection and what makes you feel valued, while Mars reveals your raw attraction and sexual drive. The Moon adds the need for emotional safety, shaping how deeply you can open yourself to intimacy. Even without a major activation, the Moon's position invites you to notice your needs for connection, touch, and emotional bonding, and to be aware of when desire wants expression, when emotions want reassurance, and when intimacy asks for honesty.`;
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
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
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

    const natalVenus = calculateNatalVenus(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const natalMars = calculateNatalMars(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const moonAspect = compareMoonToPlanets(moonToday, natalVenus, natalMars);
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

    const sexLoveData: SexLoveData = {
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
      natalVenus,
      natalMars,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    return NextResponse.json({ sexLove: sexLoveData });
  } catch (err: any) {
    console.error("Sex & Love error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}

