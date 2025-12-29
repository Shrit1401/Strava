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
import type { ZodiacPosition, Aspect } from "@/types/chart";

const ASPECT_ORB = 6;

type SelfSignalStrength = "Pressure" | "Neutral" | "Supportive";

type SelfData = {
  theme: string;
  signalStrength: SelfSignalStrength;
  moonAspect: {
    planet: "Saturn" | "Mars" | null;
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: ZodiacPosition;
  moonHouse: number;
  moonSign: string;
  natalSaturn: ZodiacPosition;
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
  natalSaturn: ZodiacPosition,
  natalMars: ZodiacPosition
): { planet: "Saturn" | "Mars" | null; aspectType: string | null; angle: number } => {
  const saturnAngle = angularDistance(moonToday.longitude, natalSaturn.longitude);
  const marsAngle = angularDistance(moonToday.longitude, natalMars.longitude);

  const saturnAspect = getAspect(saturnAngle);
  const marsAspect = getAspect(marsAngle);

  if (saturnAspect) {
    return {
      planet: "Saturn",
      aspectType: saturnAspect.type,
      angle: saturnAngle,
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
    angle: saturnAngle < marsAngle ? saturnAngle : marsAngle,
  };
};

const determineSignalStrength = (
  moonAspect: { planet: "Saturn" | "Mars" | null; aspectType: string | null }
): SelfSignalStrength => {
  if (!moonAspect.aspectType) return "Neutral";

  const lower = moonAspect.aspectType.toLowerCase();
  
  if (lower === "square" || lower === "opposition") {
    return "Pressure";
  }
  
  if (lower === "conjunction") {
    return moonAspect.planet === "Saturn" ? "Pressure" : "Pressure";
  }

  return "Neutral";
};

const determineTheme = (
  moonAspect: { planet: "Saturn" | "Mars" | null; aspectType: string | null },
  moonSign: string,
  moonHouse: number
): string => {
  if (moonAspect.planet === "Saturn" && moonAspect.aspectType) {
    const lower = moonAspect.aspectType.toLowerCase();
    if (lower === "square" || lower === "opposition" || lower === "conjunction") {
      return "Emotional weight and restraint";
    }
  }

  if (moonAspect.planet === "Mars" && moonAspect.aspectType) {
    const lower = moonAspect.aspectType.toLowerCase();
    if (lower === "square" || lower === "opposition" || lower === "conjunction") {
      return "Reactivity and defensiveness";
    }
  }

  if (moonHouse === 1 || moonHouse === 4 || moonHouse === 12) {
    return "Inner sensitivity";
  }

  return "Emotional awareness";
};

const buildLogicalBullets = (
  moonAspect: { planet: "Saturn" | "Mars" | null; aspectType: string | null },
  moonHouse: number,
  moonSign: string
): string[] => {
  const bullets: string[] = [];

  if (moonAspect.planet === "Saturn") {
    bullets.push("Moon is activating Saturn's themes of restraint and emotional weight");
    bullets.push("Feelings of seriousness, sensitivity, or inward burden");
  }

  if (moonAspect.planet === "Mars") {
    bullets.push("Moon is activating Mars's themes of reactivity and defensiveness");
    bullets.push("Emotions may rise more quickly than usual");
  }

  if (moonHouse === 1) {
    bullets.push("Pressure felt in sense of self and identity");
  }
  if (moonHouse === 4) {
    bullets.push("Pressure felt in home, family, and emotional foundations");
  }
  if (moonHouse === 12) {
    bullets.push("Pressure felt in subconscious and hidden emotional patterns");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing emotional sensitivity");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  moonAspect: { planet: "Saturn" | "Mars" | null; aspectType: string | null },
  signalStrength: SelfSignalStrength,
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
    const tone = signalStrength === "Pressure" ? "gentle and reassuring" : "neutral and reflective";

    const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S inner emotional state and how they're experiencing themselves today. Write as if speaking directly to them about their emotional experience.

Theme: ${theme}
Moon Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Moon House: ${moonHouse}
Moon Sign: ${moonSign}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
- Write in second person ("you", "your") speaking directly to the person
- Focus 80% on HOW THIS AFFECTS THEM PERSONALLY - their emotional experience, reactions, sensitivity, inner world
- Focus 20% on the astrology (brief mention is fine)
- Make it deeply emotional and reflective - help them understand what they're feeling
- Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're reacting...", "This could show up as..."
- Describe their inner emotional experience in detail - what does this feel like?
- Help them understand why their reactions feel closer to the surface
- Make it feel like a trusted friend helping them understand their emotional patterns
- The tone should be gentle and reassuring - NOT saying something is wrong
- Do not introduce new planets beyond Moon, Saturn, and Mars
- Do not mention astrology terms not provided
- Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Self" title) - 3-4 sentences describing HOW THEY'RE EXPERIENCING THEIR INNER WORLD TODAY. What might they notice about their emotional state? How might their reactions feel different? What patterns might emerge?

2. One explanatory paragraph (under the graph) - 3-4 sentences that BRIEFLY mentions the Moon's activation but FOCUSES on what this means FOR THEM. How does this show up in their emotional experience? What does this reveal about their needs for care and gentleness?

3. One closing encouragement paragraph - 3-4 sentences offering deep, personal reflection. Help them understand their emotional patterns better. What should they pay attention to? What might this teach them about their need for self-care?

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
          summary: parsed.summary || "Your emotional skin feels more sensitive today.",
          explanation: parsed.explanation || "The Moon's activation brings attention to your inner emotional state.",
          encouragement: parsed.encouragement || "Be gentle with yourself and honor your need for care and awareness.",
        };
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
    }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  let summary = "You might notice yourself feeling more sensitive today—your reactions might feel closer to the surface, or maybe you're noticing that things that usually don't bother you are stinging more than usual. Pay attention to how you're responding emotionally—this sensitivity is showing you something important about what you need right now.";
  let explanation = "Your emotional world is asking for more attention today. You might find yourself feeling more aware of your reactions, or noticing that your usual defenses feel thinner. This isn't a flaw—it's your system telling you that you need more care and gentleness. Notice how you're responding to things—are you feeling more vulnerable? More reactive? Your reactions are teaching you about your emotional needs.";
  let encouragement = "When you notice yourself feeling more sensitive, pause and ask yourself what you need. What feels like it's missing? What boundary needs to be set? Your reactions aren't random—they're information about your deepest needs. Be gentle with yourself today. Your emotional skin is thinner, which means you need more care and awareness, not that something is wrong with you.";

  if (moonAspect.planet === "Saturn" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    if (aspectLower === "square" || aspectLower === "opposition" || aspectLower === "conjunction") {
      summary = "You might notice yourself feeling more serious or burdened today. Perhaps you're feeling more sensitive to criticism, or maybe you're noticing that your inner critic is louder than usual. Pay attention to how this shows up—are you feeling more self-critical? More aware of your limitations? These feelings are showing you something important about what you need emotionally.";
      explanation = `Today's energy activates themes of emotional weight and restraint. You might find yourself feeling more aware of your limitations, or noticing that self-criticism comes up more easily. Notice how this shows up for you—are you feeling more serious? More burdened by responsibility? Your reactions are revealing something important about your emotional patterns. This isn't a flaw—it's your system asking you to pay attention to your boundaries and to be more careful with yourself. The pressure you're feeling is information about what you need.`;
      encouragement = "When you notice yourself feeling self-critical or burdened, pause and ask yourself what need isn't being met. What boundary needs to be set or respected? Your reactions are teaching you about your deepest needs. Instead of judging yourself for feeling this way, try to understand what your emotional system is trying to tell you. Be gentle with yourself—your inner world requires more awareness and gentleness right now, not more criticism.";
    }
  }

  if (moonAspect.planet === "Mars" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    if (aspectLower === "square" || aspectLower === "opposition" || aspectLower === "conjunction") {
      summary = "You might notice yourself reacting more quickly today—perhaps you're feeling irritated more easily, or maybe you're noticing that your defenses come up faster than usual. Pay attention to how you're responding emotionally—are you feeling more reactive? More defensive? These reactions are showing you something important about what feels threatening or what boundaries feel crossed.";
      explanation = `Today's energy activates themes of emotional reactivity and defensiveness. You might find yourself feeling more easily irritated, or noticing that your emotional responses come up faster than usual. Notice how this shows up for you—are you feeling more defensive? More protective of your boundaries? Your reactions are revealing something important about what matters to you and what feels threatening. This isn't about you being too sensitive—it's your system responding more quickly to protect you.`;
      encouragement = "When you notice yourself reacting quickly, pause and ask yourself what you're responding to. What feels threatening? What boundary feels crossed? Your defensiveness or irritation is information about what matters to you. Instead of judging your reactions, try to understand what they're protecting. Take time to pause before reacting, and remember that your emotional skin is thinner today—this means you need more care and awareness, not that something is wrong with you.";
    }
  }

  if (!moonAspect.aspectType) {
    const angleText = aspectAngle ? `approximately ${Math.round(aspectAngle)} degrees` : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Saturn and Mars positions. While there isn't a tight aspect activating these planets, the Moon's movement through ${moonSign} in the ${moonHouse}th house still brings attention to your inner emotional state. The Moon represents your emotional skin—how safe or exposed you feel, your instincts, and your daily emotional responses. Even without a major activation, the Moon's position invites you to notice your inner world and to be aware of how you're feeling emotionally.`;
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

    const natalSaturn = calculateNatalSaturn(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const natalMars = calculateNatalMars(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const moonAspect = compareMoonToPlanets(moonToday, natalSaturn, natalMars);
    const signalStrength = determineSignalStrength(moonAspect);
    const theme = determineTheme(moonAspect, moonToday.sign, moonHouse);
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

    const selfData: SelfData = {
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
      natalSaturn,
      natalMars,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    return NextResponse.json({ self: selfData });
  } catch (err: any) {
    console.error("Self error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}

