import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/db/client";
import { getCachedGeneration } from "@/lib/ai/cache";
import { callAI } from "@/lib/ai/client";
import {
  getAscendant,
  calculatePlanetPositions,
  createAstroTime,
} from "@/lib/astrology/calculations";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    if (password !== "1401") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await params;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        aiGenerations: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const year = 2026;
    const cacheDate = DateTime.fromObject(
      { year },
      { zone: user.birthTimezone }
    ).startOf("year");

    let newYearData = null;
    const cachedNewYear = await getCachedGeneration(
      user.id,
      "new-year",
      cacheDate
    );
    if (cachedNewYear) {
      newYearData = cachedNewYear;
    }

    const natalUtc = DateTime.fromJSDate(user.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const astroTime = createAstroTime(natalJsDate);

    const planetPositions = calculatePlanetPositions(astroTime);
    const ascendant = getAscendant(
      astroTime,
      user.birthLatitude,
      user.birthLongitude
    );

    const sunSign = planetPositions.sun?.sign || "Unknown";
    const moonSign = planetPositions.moon?.sign || "Unknown";
    const ascendantSign = ascendant.sign || "Unknown";

    const userName =
      user.name || user.email?.split("@")[0] || "User";

    const generationTypes = [
      "daily",
      "self",
      "social-life",
      "thinking-creativity",
      "routine",
      "spirituality",
      "ask",
    ];

    const activitySummary: Record<string, any> = {};
    let totalGenerations = 0;
    let mostActiveType = "";
    let maxCount = 0;

    for (const type of generationTypes) {
      const count = user.aiGenerations.filter((g) => g.type === type).length;
      if (count > 0) {
        activitySummary[type] = count;
        totalGenerations += count;
        if (count > maxCount) {
          maxCount = count;
          mostActiveType = type;
        }
      }
    }

    const recentActivity = user.aiGenerations
      .slice(0, 10)
      .map((gen) => ({
        type: gen.type,
        date: gen.createdAt,
        hasContent: !!gen.content,
      }));

    const daysSinceJoined = Math.floor(
      (Date.now() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)
    );

    const activityInsightPrompt = `You're analyzing user activity data for an astrology app. 

User: ${userName}
Email: ${user.email}
Joined: ${new Date(user.createdAt).toLocaleDateString()}
Days since joining: ${daysSinceJoined}
Sun Sign: ${sunSign}
Moon Sign: ${moonSign}
Ascendant: ${ascendantSign}

Activity Summary:
- Total AI generations: ${totalGenerations}
- Most active feature: ${mostActiveType || "None yet"}
- Activity breakdown: ${JSON.stringify(activitySummary)}

Recent Activity (last 10):
${recentActivity
  .map((a) => `- ${a.type} on ${new Date(a.date).toLocaleDateString()}`)
  .join("\n")}

Generate a brief, insightful analysis (2-3 paragraphs) about what this user is doing on the platform. Be specific about their behavior patterns, what they're seeking, and what their activity reveals about their engagement. Write it in a casual, informative tone. Focus on:
1. What they're most interested in (based on their most used features)
2. Their engagement level and patterns
3. What this suggests about their needs or interests

Keep it concise, informative, and relevant.`;

    let activityInsight = "";
    try {
      activityInsight = await callAI(activityInsightPrompt);
    } catch (error) {
      console.error("Failed to generate activity insight:", error);
      activityInsight = `${userName} has been using the platform for ${daysSinceJoined} days. They've generated ${totalGenerations} insights total. ${
        mostActiveType
          ? `Their most used feature is ${mostActiveType}, suggesting they're particularly interested in that area of astrology.`
          : "They're just getting started with the platform."
      }`;
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        birthDate: user.birthDate,
        birthTime: user.birthTime,
        birthPlace: user.birthPlace,
        createdAt: user.createdAt,
        sunSign,
        moonSign,
        ascendantSign,
      },
      newYearData,
      activity: {
        totalGenerations,
        mostActiveType,
        activitySummary,
        recentActivity,
        daysSinceJoined,
        activityInsight,
      },
    });
  } catch (err: any) {
    console.error("Admin user detail API error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}

