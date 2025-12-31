import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_MODEL } from "@/constants/ai";
import { getCachedGeneration, setCachedGeneration } from "@/lib/ai/cache";
import {
  getAscendant,
  calculatePlanetPositions,
  createAstroTime,
} from "@/lib/astrology/calculations";

type NewYearData = {
  word: string;
  contentBlocks: string[];
  yearDescription: string;
  goodThings: string[];
  badThings: string[];
};

const callGemini = async (
  sunSign: string,
  moonSign: string,
  ascendantSign: string,
  userName: string
): Promise<NewYearData> => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

      const prompt = `You're talking to ${userName} like an old friend who's known them forever. Their Sun sign is ${sunSign}, Moon sign is ${moonSign}, and Ascendant is ${ascendantSign}. 

CRITICAL TONE INSTRUCTIONS:
- Talk to them like you're catching up after not seeing each other for a while - casual, real, no bullshit
- Don't therapize them - don't say "you might notice" or "you may feel" - just tell them straight
- Don't repeat their thoughts back with headings - actually process what their chart says and tell them connections they don't see
- Comfort them when they need it, validate what's real, but also challenge them when they need to hear it
- Make connections between different parts of their life they probably haven't made
- Tell it like a story - weave everything together so it feels like one cohesive narrative
- Don't be afraid to say a lot - really process everything and give them the full picture
- Use casual language - like you're texting a close friend, but still deep
- Make them feel what you think they want to feel - if they need hope, give them hope. If they need a reality check, give them that too
- Don't use headings or categories - just flow from one thought to the next naturally
- Be specific about what will actually happen - not vague "you'll grow" stuff, but real moments and experiences

Generate a year forecast for 2026 that includes:

1. A single powerful word (just one word, no explanation) that captures the essence of what they'll become in 2026. This should be an archetype or identity (e.g., "Architect", "Explorer", "Creator", "Warrior", "Healer", "Visionary", "Alchemist", etc.)

2. Three content blocks (each 5-8 sentences) that tell the story of 2026. Write these like you're telling them a story about their year - flow naturally, make connections, process everything their chart is saying and deliver it back as a cohesive narrative. Don't repeat things with headings - just tell the story. Make them feel what they need to feel.

3. A final year description (5-8 sentences) that wraps everything up. Use their name (${userName}). Connect everything together. Make it feel complete and real.

4. Good Things Which Will Happen With You: A list of 4-6 specific good things that will happen. Be specific - not vague "you'll grow" but actual things like "you'll finally have that conversation you've been avoiding" or "you'll get that promotion you've been working toward" or "you'll meet someone who actually gets you". Make it real and specific.

5. Bad Things Which Will Happen With You: A list of 3-5 specific challenging things that will happen. Be real about it - not sugar-coated. Things like "you'll have to let go of that relationship that's been draining you" or "you'll face some hard truths about yourself" or "you'll have to make a decision that scares you". But frame it in a way that shows why it's necessary - like a friend telling them the hard truth they need to hear.

Format your response as JSON:
{
  "word": "...",
  "contentBlocks": [
    "...",
    "...",
    "..."
  ],
  "yearDescription": "...",
  "goodThings": [
    "...",
    "...",
    "..."
  ],
  "badThings": [
    "...",
    "...",
    "..."
  ]
}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          return {
            word: parsed.word || "Explorer",
            contentBlocks: parsed.contentBlocks || [
              "2026 will feel like a year where you're meticulously laying the foundations for your future. You'll be drawn to structured planning and tangible progress, seeing your efforts translate into lasting achievements. There's a deep satisfaction in this building process, a feeling of crafting something meaningful with your own hands. You might notice yourself feeling more serious about your goals, more committed to the long game. The weight of responsibility might feel heavier at times, but it's a weight you're choosing to carry because you know what you're building matters.",
              "Emotionally, you might experience a deep sense of satisfaction as you bring order to your inner world and external circumstances. There's a nurturing aspect to this building, a feeling of crafting something truly meaningful for yourself. You may find yourself feeling more protective of your boundaries, more aware of what you need to feel safe and secure. There will be moments when you feel torn between the pressure to let your guard down and your love of safety and security. It's good to draw boundaries if that's what you need, but also remember that growth happens in the spaces where you allow yourself to be vulnerable.",
              "Internally, this year is about understanding your deepest desires and translating them into concrete realities. It's a period of conscious creation, where you're the skilled craftsman shaping your destiny with intention and foresight. You'll feel the pull between expansion and contraction, between wanting to explore new territories and needing to build solid foundations. There will be moments of clarity when everything clicks into place, and moments of uncertainty when you question if you're on the right path. Trust the process. The year will teach you that you're capable of more than you imagined, and that the structures you build now will support you for years to come.",
            ],
            yearDescription:
              parsed.yearDescription ||
              `Look, ${userName}, 2026 is going to be wild for you. Your ${sunSign} self is going to push you in ways you haven't experienced yet, and your ${moonSign} heart is going to feel things you didn't know you could feel. It's going to be messy and beautiful and hard and exactly what you need.`,
            goodThings: parsed.goodThings || [
              "You'll finally have that breakthrough moment you've been waiting for",
              "Someone important is going to see you in a way you've always wanted to be seen",
              "You'll make a decision that changes everything for the better",
              "You'll discover something about yourself that makes everything click",
            ],
            badThings: parsed.badThings || [
              "You're going to have to let go of something you've been holding onto too tightly",
              "There's going to be a moment where you realize you've been lying to yourself about something",
              "You'll have to face a truth you've been avoiding",
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
    word: "Explorer",
    contentBlocks: [
      `Alright ${userName}, let me tell you what I see coming for you in 2026. Your ${sunSign} energy is going to push you in directions you haven't gone before, and honestly, it's about time. You've been playing it safe in ways that don't serve you, and this year is going to change that.`,
      `Your ${moonSign} heart is going to feel things deeply this year - like, really deeply. There are going to be moments where you're going to wonder if you can handle it, but you can. You always can. The thing is, you've been protecting yourself from feeling too much, and 2026 is going to break that open.`,
      `Here's what I think is going to happen: you're going to make some decisions that scare you, but they're the right ones. Your ${ascendantSign} mask is going to slip a bit, and people are going to see more of the real you. That's going to be uncomfortable at first, but it's also going to be exactly what you need.`,
    ],
    yearDescription:
      `Look, ${userName}, 2026 is going to be wild for you. Your ${sunSign} self is going to push you in ways you haven't experienced yet, and your ${moonSign} heart is going to feel things you didn't know you could feel. It's going to be messy and beautiful and hard and exactly what you need.`,
    goodThings: [
      "You'll finally have that breakthrough moment you've been waiting for",
      "Someone important is going to see you in a way you've always wanted to be seen",
      "You'll make a decision that changes everything for the better",
      "You'll discover something about yourself that makes everything click",
    ],
    badThings: [
      "You're going to have to let go of something you've been holding onto too tightly",
      "There's going to be a moment where you realize you've been lying to yourself about something",
      "You'll have to face a truth you've been avoiding",
    ],
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
      console.error("New year prediction API error:", error);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email },
    });

    if (!dbUser) {
      const error = { error: "User not found", status: 404, email: user.email };
      console.error("New year prediction API error:", error);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const year = 2026;
    const cacheDate = DateTime.fromObject({ year }, { zone: dbUser.birthTimezone }).startOf("year");

    const cached = await getCachedGeneration(
      dbUser.id,
      "new-year",
      cacheDate
    );

    if (cached) {
      return NextResponse.json(cached);
    }

    const natalUtc = DateTime.fromJSDate(dbUser.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const astroTime = createAstroTime(natalJsDate);

    const planetPositions = calculatePlanetPositions(astroTime);
    const ascendant = getAscendant(
      astroTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );

    const sunSign = planetPositions.sun?.sign || "Unknown";
    const moonSign = planetPositions.moon?.sign || "Unknown";
    const ascendantSign = ascendant.sign || "Unknown";

    const userName =
      user.user_metadata?.full_name ||
      user.user_metadata?.name ||
      dbUser.name ||
      user.email?.split("@")[0] ||
      "User";

    const newYearData = await callGemini(
      sunSign,
      moonSign,
      ascendantSign,
      userName
    );

    await setCachedGeneration(dbUser.id, "new-year", cacheDate, newYearData);

    return NextResponse.json(newYearData);
  } catch (err: any) {
    console.error("New year prediction error:", {
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

