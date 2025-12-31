import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import * as Astronomy from "astronomy-engine";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/constants/ai";
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

type ThinkingCreativitySignalStrength = "Active" | "Scattered" | "Neutral";

type ThinkingCreativityData = {
  theme: string;
  signalStrength: ThinkingCreativitySignalStrength;
  moonAspect: {
    planet: "Mercury" | "Uranus" | null;
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: ZodiacPosition;
  moonHouse: number;
  moonSign: string;
  natalMercury: ZodiacPosition;
  natalUranus: ZodiacPosition;
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

const calculateNatalUranus = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Uranus);
};

const compareMoonToPlanets = (
  moonToday: ZodiacPosition,
  natalMercury: ZodiacPosition,
  natalUranus: ZodiacPosition
): { planet: "Mercury" | "Uranus" | null; aspectType: string | null; angle: number } => {
  const mercuryAngle = angularDistance(moonToday.longitude, natalMercury.longitude);
  const uranusAngle = angularDistance(moonToday.longitude, natalUranus.longitude);

  const mercuryAspect = getAspect(mercuryAngle);
  const uranusAspect = getAspect(uranusAngle);

  if (uranusAspect) {
    return {
      planet: "Uranus",
      aspectType: uranusAspect.type,
      angle: uranusAngle,
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
    angle: mercuryAngle < uranusAngle ? mercuryAngle : uranusAngle,
  };
};

const determineSignalStrength = (
  moonAspect: { planet: "Mercury" | "Uranus" | null; aspectType: string | null },
  moonHouse: number
): ThinkingCreativitySignalStrength => {
  if (moonHouse === 3 || moonHouse === 5) {
    return "Active";
  }

  if (moonAspect.planet === "Uranus" && moonAspect.aspectType) {
    return "Scattered";
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    return "Active";
  }

  return "Neutral";
};

const determineTheme = (
  moonAspect: { planet: "Mercury" | "Uranus" | null; aspectType: string | null },
  moonHouse: number
): string => {
  if (moonHouse === 3) {
    return "Mental focus and communication";
  }

  if (moonHouse === 5) {
    return "Creative expression and play";
  }

  if (moonAspect.planet === "Uranus" && moonAspect.aspectType) {
    return "Originality and sudden insights";
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    return "Mental processing and clarity";
  }

  return "Thinking and creativity";
};

const buildLogicalBullets = (
  moonAspect: { planet: "Mercury" | "Uranus" | null; aspectType: string | null },
  moonHouse: number,
  moonSign: string
): string[] => {
  const bullets: string[] = [];

  if (moonHouse === 3) {
    bullets.push("Moon in 3rd house activates communication, learning, and mental processing");
    bullets.push("Increased focus on how you think and communicate ideas");
  }

  if (moonHouse === 5) {
    bullets.push("Moon in 5th house activates creative expression and play");
    bullets.push("Imagination and creative exploration are highlighted");
  }

  if (moonAspect.planet === "Mercury") {
    bullets.push("Moon is activating Mercury's themes of mental processing and communication");
    bullets.push("Thoughts may feel sharper or more focused");
  }

  if (moonAspect.planet === "Uranus") {
    bullets.push("Moon is activating Uranus's themes of originality and sudden insights");
    bullets.push("Thinking may feel scattered or nonlinear, which is not a flaw");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing thinking and creativity");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  moonAspect: { planet: "Mercury" | "Uranus" | null; aspectType: string | null },
  signalStrength: ThinkingCreativitySignalStrength,
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
    const tone = "supportive and encouraging";

    const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S thinking patterns and creative capacity today. Write as if speaking directly to them about their mental and creative experience.

Theme: ${theme}
Moon Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Moon House: ${moonHouse}
Moon Sign: ${moonSign}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
Write in second person ("you", "your") speaking directly to the person
Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their thinking patterns, mental clarity, creative flow, how their mind works today
Focus 20% on the astrology (brief mention is fine)
Make it deeply emotional and reflective: help them understand their mental and creative experience
Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're thinking...", "This could show up as..."
Describe their inner experience of thinking and creativity: what does this feel like? How is their mind working?
Help them understand that creative and intellectual energy moves in waves
Make it feel like a trusted mentor helping them understand their thinking patterns
The tone should be supportive and encouraging
Do not introduce new planets beyond Moon, Mercury, and Uranus
Do not mention astrology terms not provided
Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Thinking & Creativity" title): 3-4 sentences describing HOW THEY'RE EXPERIENCING THEIR THINKING AND CREATIVITY TODAY. What might they notice about their mental clarity? How might their thoughts feel: focused or scattered? What patterns might emerge?

2. One explanatory paragraph (under the graph): 3-4 sentences that BRIEFLY mentions the Moon and Mercury/Uranus relationship but FOCUSES on what this means FOR THEM. How does this show up in their thinking? What does this reveal about their mental patterns and creative capacity?

3. One closing encouragement paragraph: 3-4 sentences offering deep, personal reflection. Help them understand their thinking patterns better. What should they pay attention to? What might this teach them about honoring different modes of thinking: focused reasoning vs free association?

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
          summary: parsed.summary || "Your thinking and creativity feel more active today.",
          explanation: parsed.explanation || "The Moon's position activates themes of mental processing and creative expression.",
          encouragement: parsed.encouragement || "Honor the mode of thinking that feels natural today.",
        };
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
    }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  let summary = "You might notice yourself feeling more aware of your thinking patterns today. Perhaps you're feeling more focused, or maybe you're noticing that your thoughts feel more scattered or creative. Pay attention to how you're experiencing your mind. This is showing you something important about your mental capacity.";
  let explanation = "Your thinking and creativity are asking for more attention today. You might find yourself feeling more aware of how your mind processes information, or noticing that your thoughts feel either sharper or more scattered. Notice how this shows up for you. Are you feeling more focused? More creative? Your reactions are revealing something important about your authentic mental patterns.";
  let encouragement = "When you notice yourself feeling more focused or more scattered, trust that. Creative and intellectual energy moves in waves. Some days favor focused reasoning, while others favor free association and creative exploration. Both modes are valuable. Not all thinking needs to be efficient to be valuable. What are your reactions showing you about how your mind works?";

  if (moonHouse === 3) {
    summary = "You might notice yourself feeling more aware of your thinking and communication today. Perhaps you're feeling more curious, or maybe you're noticing that your mental processes feel more active. Pay attention to how you're experiencing your thoughts. This is showing you something important about how your mind works.";
    explanation = `Your thinking and communication are being activated today. You might find yourself feeling more aware of how you process information, or noticing that you're more focused on learning and communication. Notice how this shows up for you. Are you feeling more curious? More able to express ideas? Your reactions are revealing something important about your authentic mental patterns.`;
    encouragement = "When you notice yourself feeling more focused or more scattered, trust that. Some days favor focused reasoning, while others favor free association and creative exploration. Both modes are valuable. If your thoughts feel sharper today, embrace that. If they feel scattered, honor that too. It's not a flaw but a different mode of thinking. What are your reactions showing you about how your mind works?";
  }

  if (moonHouse === 5) {
    summary = "You might notice yourself feeling more drawn to creative expression and play today. Perhaps you're feeling more imaginative, or maybe you're noticing that your thinking feels more playful or experimental. Pay attention to how you're experiencing your creativity. This is showing you something important about your capacity for inspiration.";
    explanation = `Your creativity and play are being activated today. You might find yourself feeling more drawn to creative projects, or noticing that you're more open to inspiration and free association. Notice how this shows up for you. Are you feeling more playful? More willing to explore ideas? Your reactions are revealing something important about your authentic creative patterns.`;
    encouragement = "When you notice yourself feeling more creative or more scattered, trust that. Some days favor focused reasoning, while others favor free association and creative exploration. Both modes are valuable. If your thoughts feel more imaginative today, embrace that. If they feel scattered, honor that too. It's not a flaw but a different mode of thinking. Allow yourself to explore ideas without pressure to be productive. What are your reactions showing you about your creative capacity?";
  }

  if (moonAspect.planet === "Mercury" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more focused or clear in your thinking today. Perhaps you're feeling more able to process information, or maybe you're noticing that your mental clarity feels more accessible. Pay attention to how you're experiencing your thoughts. This is showing you something important about your mental capacity.";
    explanation = `Your mental processing and clarity are being activated today. You might find yourself feeling more aware of how your mind works, or noticing that you're more able to process information clearly. Notice how this shows up for you. Are you feeling more focused? More able to communicate ideas? Your reactions are revealing something important about your authentic mental patterns.`;
    encouragement = "When you notice yourself feeling more focused, honor that. However, remember that creative and intellectual energy moves in waves. Some days favor focused reasoning, while others favor free association and creative exploration. Both modes are valuable. If your thoughts feel scattered today, that's okay. It's not a flaw but a different mode of thinking. What are your reactions showing you about how your mind works?";
  }

  if (moonAspect.planet === "Uranus" && moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more open to unexpected ideas or sudden insights today. Perhaps you're feeling more creative, or maybe you're noticing that your thoughts are jumping and connecting in unusual ways. Pay attention to how you're experiencing your thinking. This is showing you something important about your capacity for originality.";
    explanation = `Your originality and sudden insights are being activated today. You might find yourself feeling more aware of how your thoughts connect in unexpected ways, or noticing that you're more open to nonlinear thinking. Notice how this shows up for you. Are you feeling more creative? More willing to explore ideas without a straight path? Your reactions are revealing something important about your authentic creative patterns.`;
    encouragement = "When you notice yourself thinking in scattered or nonlinear ways, trust that. This isn't a flaw. It's a different mode of thinking. Some days favor focused reasoning, while others favor free association and creative exploration. Both modes are valuable. Your sudden insights and original connections are gifts, even if they don't follow a straight path. What are your reactions showing you about your creative capacity?";
  }

  if (!moonAspect.aspectType && moonHouse !== 3 && moonHouse !== 5) {
    const angleText = aspectAngle ? `approximately ${Math.round(aspectAngle)} degrees` : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Mercury and Uranus positions, and moving through the ${moonHouse}th house. While there isn't a tight aspect or thinking/creativity house activation, the Moon's movement still brings subtle attention to your mental processes and creative capacity. Mercury shows how your mind processes information and communicates ideas, while the Moon influences emotional thinking and intuition. Uranus adds originality and sudden insights. Even without a major activation, the Moon's position invites you to notice your thinking patterns and to be aware of whether your thoughts feel focused, scattered, or creative today.`;
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
      console.error("Thinking & Creativity API error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      const error = { error: "User not found", status: 404, email: user.email };
      console.error("Thinking & Creativity API error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const today = DateTime.now()
      .setZone(dbUser.birthTimezone)
      .startOf("day");

    const cached = await getCachedGeneration(
      dbUser.id,
      "thinking-creativity",
      today
    );

    if (cached) {
      return NextResponse.json({ thinkingCreativity: cached });
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
    const natalUranus = calculateNatalUranus(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const moonAspect = compareMoonToPlanets(moonToday, natalMercury, natalUranus);
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

    const thinkingCreativityData: ThinkingCreativityData = {
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
      natalUranus,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    await setCachedGeneration(
      dbUser.id,
      "thinking-creativity",
      today,
      thinkingCreativityData
    );

    return NextResponse.json({ thinkingCreativity: thinkingCreativityData });
  } catch (err: any) {
    console.error("Thinking & Creativity error:", {
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

