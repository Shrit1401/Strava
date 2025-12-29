import { NextResponse } from "next/server";
import { DateTime } from "luxon";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/db/client";
import {
  getAscendant,
  getWholeSignHouses,
  assignPlanetsToHouses,
  calculatePlanetPositions,
  calculateAspects,
  createAstroTime,
} from "@/lib/astrology/calculations";
import type { ChartData } from "@/types/chart";

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

    const natalUtc = DateTime.fromJSDate(dbUser.birthTime).setZone("UTC");
    const natalJsDate = natalUtc.toJSDate();
    const astroTime = createAstroTime(natalJsDate);

    const planetPositions = calculatePlanetPositions(astroTime);
    const ascendant = getAscendant(
      astroTime,
      dbUser.birthLatitude,
      dbUser.birthLongitude
    );
    const houses = getWholeSignHouses(ascendant);
    const planetHouses = assignPlanetsToHouses(planetPositions, ascendant);
    const aspects = calculateAspects(planetPositions);

    const ist = natalUtc.setZone("Asia/Kolkata");

    const chart: ChartData = {
      utc: natalUtc.toISO() || "",
      ist: ist.toISO() || "",
      planets: planetPositions,
      ascendant,
      houses,
      planetHouses,
      aspects,
      houseSystem: "Whole Sign",
    };

    return NextResponse.json({ chart });
  } catch (err: any) {
    console.error("Natal chart error:", err);
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}

