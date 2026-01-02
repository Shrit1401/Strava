import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { prisma } from "@/lib/db/client";
import { getCachedGeneration } from "@/lib/ai/cache";
import {
  getAscendant,
  calculatePlanetPositions,
  createAstroTime,
} from "@/lib/astrology/calculations";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const password = searchParams.get("password");

    if (password !== "1401") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        aiGenerations: {
          where: {
            type: "new-year",
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    const usersWithNewYear = await Promise.all(
      users.map(async (user) => {
        const year = 2026;
        const cacheDate = DateTime.fromObject(
          { year },
          { zone: user.birthTimezone }
        ).startOf("year");

        let newYearData = null;

        if (user.aiGenerations.length > 0) {
          newYearData = user.aiGenerations[0].content as any;
        } else {
          const cached = await getCachedGeneration(
            user.id,
            "new-year",
            cacheDate
          );
          if (cached) {
            newYearData = cached;
          }
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          createdAt: user.createdAt,
          sunSign,
          moonSign,
          ascendantSign,
          newYearData,
        };
      })
    );

    const totalUsers = users.length;
    const usersThisMonth = users.filter((user) => {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      return (
        userDate.getMonth() === now.getMonth() &&
        userDate.getFullYear() === now.getFullYear()
      );
    }).length;

    const usersThisWeek = users.filter((user) => {
      const userDate = new Date(user.createdAt);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      return userDate >= weekAgo;
    }).length;

    const usersWithNewYearCount = usersWithNewYear.filter(
      (u) => u.newYearData !== null
    ).length;

    return NextResponse.json({
      stats: {
        totalUsers,
        usersThisMonth,
        usersThisWeek,
        usersWithNewYearCount,
      },
      users: usersWithNewYear,
    });
  } catch (err: any) {
    console.error("Admin users API error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
