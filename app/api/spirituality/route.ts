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

type SpiritualitySignalStrength = "Active" | "Neutral" | "Subtle";

type SpiritualityData = {
  theme: string;
  signalStrength: SpiritualitySignalStrength;
  moonAspect: {
    aspectType: string | null;
    angle: number | null;
  };
  moonToday: ZodiacPosition;
  moonHouse: number;
  moonSign: string;
  natalNeptune: ZodiacPosition;
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

const calculateNatalNeptune = (
  birthTime: Date,
  birthLatitude: number,
  birthLongitude: number
): ZodiacPosition => {
  const natalUtc = DateTime.fromJSDate(birthTime).setZone("UTC");
  const natalJsDate = natalUtc.toJSDate();
  const natalAstroTime = createAstroTime(natalJsDate);

  return calculatePlanetPosition(natalAstroTime, Astronomy.Body.Neptune);
};

const compareMoonToNeptune = (
  moonToday: ZodiacPosition,
  natalNeptune: ZodiacPosition
): { aspectType: string | null; angle: number } => {
  const angle = angularDistance(moonToday.longitude, natalNeptune.longitude);
  const aspect = getAspect(angle);

  return {
    aspectType: aspect ? aspect.type : null,
    angle,
  };
};

const determineSignalStrength = (
  moonAspect: { aspectType: string | null },
  moonHouse: number
): SpiritualitySignalStrength => {
  if (moonHouse === 9 || moonHouse === 12) {
    return "Active";
  }

  if (moonAspect.aspectType) {
    return "Active";
  }

  return "Subtle";
};

const determineTheme = (
  moonAspect: { aspectType: string | null },
  moonHouse: number
): string => {
  if (moonHouse === 12) {
    return "Intuitive openness and dissolution";
  }

  if (moonHouse === 9) {
    return "Seeking meaning and faith";
  }

  if (moonAspect.aspectType) {
    return "Neptune activating intuition";
  }

  return "Spiritual awareness";
};

const buildLogicalBullets = (
  moonAspect: { aspectType: string | null },
  moonHouse: number,
  moonSign: string
): string[] => {
  const bullets: string[] = [];

  if (moonHouse === 12) {
    bullets.push("Moon in 12th house activates subconscious and spiritual themes");
    bullets.push("Increased sensitivity to symbols, dreams, and inner guidance");
  }

  if (moonHouse === 9) {
    bullets.push("Moon in 9th house activates philosophy and meaning-seeking");
    bullets.push("Openness to faith, higher learning, and spiritual exploration");
  }

  if (moonAspect.aspectType) {
    bullets.push("Moon is activating Neptune's themes of dissolution and imagination");
    bullets.push("Thinning of mental noise, making space for intuition");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing spiritual receptivity");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  moonAspect: { aspectType: string | null },
  signalStrength: SpiritualitySignalStrength,
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
      ? `Neptune ${moonAspect.aspectType.toLowerCase()}`
      : "no major aspect";
    const tone = "gentle, reflective, and reassuring";

    const prompt = `You are writing a deeply personal daily reflection about THIS PERSON'S spiritual experience and how they're connecting to meaning today. Write as if speaking directly to them about their inner spiritual life.

Theme: ${theme}
Moon Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Moon House: ${moonHouse}
Moon Sign: ${moonSign}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
Write in second person ("you", "your") speaking directly to the person
Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their spiritual experience, intuition, receptivity, inner knowing
Focus 20% on the astrology (brief mention is fine)
Make it deeply emotional and reflective: help them understand their spiritual experience
Use phrases like "You might notice yourself...", "You may feel...", "Pay attention to how you're receiving...", "This could show up as..."
Describe their inner spiritual experience: what does this feel like? What are they noticing?
Help them understand why confusion might actually be mental noise thinning
Make it feel like a trusted guide helping them understand their spiritual patterns
The tone should be gentle, reflective, and reassuring
Do not introduce new planets beyond Moon and Neptune
Do not mention astrology terms not provided
Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Spirituality" title): 3-4 sentences describing HOW THEY'RE EXPERIENCING THEIR SPIRITUAL CONNECTION TODAY. What might they notice about their intuition? How might they feel more receptive? What patterns might emerge in their spiritual awareness?

2. One explanatory paragraph (under the graph): 3-4 sentences that BRIEFLY mentions the Moon and Neptune relationship but FOCUSES on what this means FOR THEM. How does this show up in their spiritual experience? What does this reveal about their capacity for meaning and intuition?

3. One closing encouragement paragraph: 3-4 sentences offering deep, personal reflection. Help them understand their spiritual patterns better. What should they pay attention to? What might this teach them about listening and trusting what cannot be explained?

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
          summary: parsed.summary || "Your spiritual path invites deeper listening today.",
          explanation: parsed.explanation || "The Moon's position activates themes of intuition and meaning.",
          encouragement: parsed.encouragement || "Trust what cannot be explained and allow meaning to emerge quietly.",
        };
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", e);
    }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  let summary = "You might notice yourself feeling more inward or reflective today. Perhaps you're feeling more sensitive to symbols, dreams, or subtle feelings, or maybe you're noticing that your usual mental clarity feels a bit foggy. Pay attention to how you're experiencing your inner world. This isn't confusion, but rather mental noise thinning to make space for deeper knowing.";
  let explanation = "Your spiritual awareness is asking for more attention today. You might find yourself feeling more receptive to intuition, or noticing that you're drawn to silence, symbols, or things that don't have clear explanations. Notice how this shows up for you. Are you feeling more reflective? More open to what can't be explained? Your reactions are revealing something important about your capacity for meaning beyond logic.";
  let encouragement = "When you notice yourself feeling confused or unclear, try to see it as mental noise thinning rather than a problem to solve. What are you noticing in the quiet? What feelings or insights are trying to emerge? Trust that not everything needs to be explained. Some meaning comes through listening, not through figuring it out. Allow yourself to be receptive to what cannot be explained yet.";

  if (moonHouse === 12) {
    summary = "Your spiritual awareness feels more inward and reflective today. The Moon's movement through the 12th house activates themes of the subconscious, making you more sensitive to symbols, dreams, silence, and unanswered questions.";
    explanation = `The Moon is currently in your 12th house, the house of the subconscious, secrets, and spirituality. This position activates your intuitive openness and receptivity to subtle feelings and inner guidance. The 12th house represents dissolution of boundaries, making space for connection to something larger than yourself. When the Moon moves through this house, you may feel more inward, reflective, or sensitive to the unseen. This can feel like confusion on the surface, but astrologically it represents a thinning of mental noise, making space for intuition and emotional truth. The sign ${moonSign} shows how you process this spiritual energy: whether quietly, intensely, or protectively.`;
    encouragement = "Trust that this inward pull is not avoidance, but a necessary part of your spiritual path. Allow yourself to be receptive to symbols, dreams, and feelings that don't have clear explanations. The confusion you might feel is actually mental noise thinning, making room for deeper knowing. Don't force meaning—let it emerge quietly through listening, silence, and trust in what cannot be explained yet.";
  }

  if (moonHouse === 9) {
    summary = "You might notice yourself feeling more drawn to explore questions that don't have easy answers today. Perhaps you're feeling more curious about faith, philosophy, or perspectives that expand your worldview, or maybe you're noticing that your usual need for certainty feels less important. Pay attention to how you're experiencing your search for meaning. This is your intuitive openness asking for more space.";
    explanation = `Your spiritual awareness is asking for more attention today. You might find yourself feeling more open to exploring questions beyond logic, or noticing that you're drawn to perspectives that challenge your usual way of thinking. Notice how this shows up for you. Are you feeling more curious? More willing to explore without needing answers? Your reactions are revealing something important about your capacity for meaning beyond everyday identity.`;
    encouragement = "When you notice yourself drawn to questions without answers, trust that. Meaning emerges through exploration, not through forcing certainty. Allow yourself to be curious about faith, philosophy, and perspectives that expand your worldview. The spiritual path isn't about finding answers. It's about staying open to questions and trusting what cannot be explained yet. What are you noticing in your search for meaning?";
  }

  if (moonAspect.aspectType) {
    const aspectLower = moonAspect.aspectType.toLowerCase();
    summary = "You might notice yourself feeling more sensitive to symbols, dreams, or subtle feelings today. Perhaps you're feeling more drawn toward faith or surrender, or maybe you're noticing that your usual mental clarity feels a bit foggy. Pay attention to how you're experiencing your spiritual awareness. This isn't confusion, but rather mental noise thinning to make space for deeper knowing.";
    explanation = `Your spiritual awareness is being activated today. You might find yourself feeling more receptive to what can't be explained, or noticing that you're drawn to symbols, dreams, or feelings that don't have clear logic. Notice how this shows up for you. Are you feeling more open? More willing to trust what cannot be explained? Your reactions are revealing something important about your capacity for meaning beyond logic. This activation can feel like confusion on the surface, but it's actually mental noise thinning, making space for intuition and emotional truth.`;
    encouragement = "When you notice yourself feeling confused or unclear, try to see it as mental noise thinning rather than a problem to solve. What are you noticing in the quiet? What feelings or insights are trying to emerge? Don't try to force clarity. Instead, allow yourself to be receptive to symbols, dreams, and feelings that don't have clear explanations. Your intuitive openness is a gift, not a problem to solve. Trust what cannot be explained yet.";
  }

  if (!moonAspect.aspectType && moonHouse !== 9 && moonHouse !== 12) {
    const angleText = aspectAngle ? `approximately ${Math.round(aspectAngle)} degrees` : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Neptune position, and moving through the ${moonHouse}th house. While there isn't a tight aspect or spiritual house activation, the Moon's movement still brings subtle attention to your spiritual nature. The Moon represents your intuitive openness and receptivity to subtle feelings, while Neptune describes your capacity for faith, imagination, and connection to something larger than yourself. Even without a major activation, the Moon's position invites you to notice your spiritual impulses and to be aware of how you're connecting to meaning beyond logic and control.`;
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

    const natalNeptune = calculateNatalNeptune(
      dbUser.birthTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const moonAspect = compareMoonToNeptune(moonToday, natalNeptune);
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

    const spiritualityData: SpiritualityData = {
      theme,
      signalStrength,
      moonAspect: {
        aspectType: moonAspect.aspectType,
        angle: moonAspect.angle,
      },
      moonToday,
      moonHouse,
      moonSign: moonToday.sign,
      natalNeptune,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    return NextResponse.json({ spirituality: spiritualityData });
  } catch (err: any) {
    console.error("Spirituality error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}

