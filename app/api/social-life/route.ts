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

type SocialSignalStrength = "Supportive" | "Neutral" | "Challenging";

type SocialLifeData = {
  theme: string;
  signalStrength: SocialSignalStrength;
  aspectType: string | null;
  aspectAngle: number | null;
  moonToday: ZodiacPosition;
  moonHouse: number;
  natalVenus: ZodiacPosition;
  summary: string;
  explanation: string;
  encouragement: string;
  logicalBullets: string[];
};

const calculateTodayMoonPosition = (timezone: string): ZodiacPosition => {
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

const compareMoonToVenus = (
  moonToday: ZodiacPosition,
  natalVenus: ZodiacPosition
): { aspectType: string | null; angle: number } => {
  const angle = angularDistance(moonToday.longitude, natalVenus.longitude);
  const aspect = getAspect(angle);

  return {
    aspectType: aspect ? aspect.type : null,
    angle,
  };
};

const determineSignalStrength = (
  aspectType: string | null
): SocialSignalStrength => {
  if (!aspectType) return "Neutral";

  const lower = aspectType.toLowerCase();
  if (lower === "trine" || lower === "sextile") {
    return "Supportive";
  }
  if (lower === "conjunction") {
    return "Supportive";
  }
  if (lower === "square" || lower === "opposition") {
    return "Challenging";
  }

  return "Neutral";
};

const determineTheme = (
  aspectType: string | null,
  signalStrength: SocialSignalStrength
): string => {
  if (!aspectType) return "Social awareness";

  const lower = aspectType.toLowerCase();

  if (lower === "trine") {
    return "Ease and attraction";
  }
  if (lower === "sextile") {
    return "Emotional openness";
  }
  if (lower === "conjunction") {
    return "Visibility and charm";
  }
  if (lower === "square") {
    return "Social friction";
  }
  if (lower === "opposition") {
    return "Boundary awareness";
  }

  return "Social awareness";
};

const buildLogicalBullets = (
  aspectType: string | null,
  moonHouse: number,
  signalStrength: SocialSignalStrength
): string[] => {
  const bullets: string[] = [];

  if (aspectType) {
    const lower = aspectType.toLowerCase();
    if (lower === "trine" || lower === "sextile") {
      bullets.push("Moon is activating pleasure and connection");
      bullets.push("Social interactions feel easier today");
    } else if (lower === "conjunction") {
      bullets.push("Moon is amplifying Venusian qualities");
      bullets.push("Natural charm and appeal are highlighted");
    } else if (lower === "square" || lower === "opposition") {
      bullets.push("Moon is creating tension with Venus");
      bullets.push("Social dynamics require more awareness");
    }
  }

  if (moonHouse === 7) {
    bullets.push("Moon in 7th house emphasizes partnerships");
  }
  if (moonHouse === 11) {
    bullets.push("Moon in 11th house highlights friendships and groups");
  }

  if (bullets.length === 0) {
    bullets.push("Moon is influencing social dynamics");
  }

  return bullets.slice(0, 4);
};

const callGemini = async (
  theme: string,
  aspectType: string | null,
  signalStrength: SocialSignalStrength,
  logicalBullets: string[],
  aspectAngle: number | null
): Promise<{ summary: string; explanation: string; encouragement: string }> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const aspectText = aspectType || "no major aspect";
      const tone =
        signalStrength === "Supportive"
          ? "warm and encouraging"
          : signalStrength === "Challenging"
          ? "gentle and supportive"
          : "neutral and reflective";

      const prompt = `You are writing a deeply personal daily reflection about how today's astrological influences affect THIS PERSON'S social life and relationships. Write as if speaking directly to them about their inner experience.

Theme: ${theme}
Aspect: ${aspectText}
Signal Strength: ${signalStrength}
Tone: ${tone}
Logical Bullets: ${logicalBullets.join(", ")}

CRITICAL INSTRUCTIONS:
Write in second person ("you", "your") speaking directly to the person
Focus 80% on HOW THIS AFFECTS THEM PERSONALLY: their feelings, reactions, needs, patterns
Focus 20% on the astrology (brief mention is fine)
Make it deeply emotional and reflective: help them understand what they're experiencing
Use phrases like "You might notice...", "You may feel...", "This could show up as...", "Pay attention to how..."
Describe their inner experience, not just astrological facts
Help them reflect on their patterns, needs, and reactions
Make it feel like a trusted friend helping them understand themselves
Do not introduce new planets beyond Moon and Venus
Do not mention astrology terms not provided
Do not make absolute claims

Generate exactly three outputs:

1. One paragraph summary (under "Social Life" title): 3-4 sentences describing how TODAY'S SOCIAL ENERGY AFFECTS THEM PERSONALLY. What might they notice? How might they feel? What patterns might emerge?

2. One explanatory paragraph (under the graph): 3-4 sentences that BRIEFLY mentions the Moon and Venus relationship but FOCUSES on what this means FOR THEM. How does this show up in their relationships? What does this reveal about their needs?

3. One closing encouragement paragraph: 3-4 sentences offering deep, personal reflection. Help them understand themselves better. What should they pay attention to? What might this teach them about their patterns?

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
            summary:
              parsed.summary ||
              "Today's social energy invites connection and awareness.",
            explanation:
              parsed.explanation ||
              "The Moon's relationship with Venus influences your social interactions today.",
            encouragement:
              parsed.encouragement ||
              "Trust your instincts and honor your needs in social situations.",
          };
        }
      } catch (e) {
        console.error("Failed to parse Gemini response:", e);
      }
    } catch (e) {
      console.error("Failed to call Gemini API:", e);
    }
  }

  const aspectText = aspectType || "no major aspect";
  const isSupportive = signalStrength === "Supportive";
  const isChallenging = signalStrength === "Challenging";

  let summary =
    "You might notice yourself feeling more aware of your social needs today. Perhaps you're feeling drawn to connect, or maybe you're noticing a deeper longing for meaningful interaction. Pay attention to how you're responding to others. Are you feeling more open, or more protective? These feelings are telling you something important about what you need right now.";
  let explanation =
    "Today's energy highlights your relationship with connection and how you give and receive affection. You might find yourself more aware of how you're being seen, or more sensitive to the quality of your interactions. Notice what feels good and what doesn't. Your reactions are showing you what you truly need in your relationships. This isn't about forcing connection or avoiding it, but about understanding your authentic social needs.";
  let encouragement =
    "Trust what you're feeling. If you notice yourself wanting more connection, honor that. If you notice yourself needing space, honor that too. Your social impulses are valid information about your needs. Pay attention to how you're responding to others today. Your reactions are teaching you about your patterns, your boundaries, and what makes you feel truly seen and valued.";

  if (aspectType) {
    const aspectLower = aspectType.toLowerCase();
    if (aspectLower === "trine" || aspectLower === "sextile") {
      summary =
        "You might notice yourself feeling more naturally open to connection today. Perhaps you're finding it easier to be yourself around others, or maybe you're noticing that your usual social defenses feel softer. Pay attention to how you're responding. Do you feel more comfortable being seen? More willing to let people in? These feelings are showing you that your emotional needs and your desire for connection are aligning in a way that feels supportive.";
      explanation = `Today's energy creates a sense of ease between your emotional needs and your desire for connection. You might find yourself more naturally charming without trying, or more comfortable expressing what you want socially. Notice how you're responding to others. Are you feeling more open? More able to receive affection? Your reactions are revealing something important about your capacity for authentic connection. This isn't about forcing interactions, but about recognizing when connection feels natural and good.`;
      encouragement =
        "Trust what feels natural today. If you notice yourself wanting to reach out, do it. If you notice yourself feeling more comfortable being seen, honor that. Your social impulses are showing you what you need. Pay attention to them. However, remember that even when connection feels easier, you still get to choose how much you share and with whom. Your boundaries matter, even when the energy feels supportive. Use this time to notice what authentic connection feels like for you, and let that guide you.";
    } else if (aspectLower === "conjunction") {
      summary =
        "You might notice yourself feeling more magnetic or aware of how others are responding to you today. Perhaps you're feeling more confident in your ability to connect, or maybe you're noticing that people seem more drawn to you. Pay attention to how this feels. Do you enjoy the attention, or does it feel overwhelming? Your reactions are showing you something important about your relationship with visibility and connection.";
      explanation = `Today's energy intensifies your capacity for connection and attraction. You might find yourself more aware of how you're being seen, or more conscious of what you find appealing in others. Notice how you're responding to this energy. Are you feeling more confident? More willing to express what you want? Your reactions are revealing something important about your authentic social needs. This isn't about performing or trying to be charming. It's about recognizing when your natural appeal is working and understanding what that means for you.`;
      encouragement =
        "Pay attention to how this visibility feels. If you notice yourself enjoying the attention, that's valid. If you notice yourself feeling overwhelmed or pressured, that's valid too. Your reactions are teaching you about your relationship with being seen and your capacity for connection. Notice what feels truly good versus what you think you should want. Your authentic needs matter. Honor them, whether that means embracing connection or protecting your boundaries.";
    } else if (aspectLower === "square" || aspectLower === "opposition") {
      summary =
        "You might notice yourself feeling torn between different social needs today. Perhaps you want connection but also need space, or maybe you're feeling conflicted about how much to share. Pay attention to this tension. It's showing you something important about your authentic needs versus what you think you should want socially.";
      explanation = `Today's energy creates tension between your emotional needs and your social desires. You might find yourself feeling conflicted: wanting to connect but needing space, or wanting to be authentic but fearing rejection. Notice how this shows up for you. Are you feeling pulled in different directions? Are you noticing yourself trying to please others while ignoring your own needs? Your reactions are revealing something important about your patterns in relationships. This tension isn't a flaw. It's information about what you truly need versus what you think you should want.`;
      encouragement =
        "When you feel this tension, pause and ask yourself what each part of you is trying to say. What does the part that wants connection need? What does the part that needs space need? Both are valid. The work isn't to choose one over the other, but to understand both and find ways to honor them. Maybe you need clearer boundaries while still being open. Maybe you need to express your authentic self even if it means risking disapproval. Trust that this tension is teaching you something important about yourself. Pay attention to what it's showing you.";
    }
  } else {
    const angleText = aspectAngle
      ? `approximately ${Math.round(aspectAngle)} degrees`
      : "some distance";
    explanation = `The Moon is currently ${angleText} away from your natal Venus position. While this isn't within the orb for a major aspect, the Moon's proximity still activates Venusian themes in your life. The Moon represents your emotional world and daily responses, while Venus shows how you love, what you find beautiful, and how you attract others. Even without a tight aspect, the Moon's movement through the zodiac brings attention to these themes, inviting you to notice how you're relating socially and what feels pleasurable or meaningful in your connections. This is a time to pay attention to your social impulses: what draws you to others, what repels you, and what feels authentic versus what feels like performance.`;
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

    const { aspectType, angle } = compareMoonToVenus(moonToday, natalVenus);
    const signalStrength = determineSignalStrength(aspectType);
    const theme = determineTheme(aspectType, signalStrength);
    const logicalBullets = buildLogicalBullets(
      aspectType,
      moonHouse,
      signalStrength
    );

    const { summary, explanation, encouragement } = await callGemini(
      theme,
      aspectType,
      signalStrength,
      logicalBullets,
      angle
    );

    const socialLifeData: SocialLifeData = {
      theme,
      signalStrength,
      aspectType,
      aspectAngle: angle,
      moonToday,
      moonHouse,
      natalVenus,
      summary,
      explanation,
      encouragement,
      logicalBullets,
    };

    return NextResponse.json({ socialLife: socialLifeData });
  } catch (err: any) {
    console.error("Social life error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
