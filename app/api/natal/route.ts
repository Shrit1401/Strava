import { NextResponse } from "next/server";
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";

type RequestBody = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second?: number;
  timezone: string;
  lat: number;
  lon: number;
};

type ZodiacPosition = {
  longitude: number;
  sign: string;
  signIndex: number;
  degreeInsideSign: number;
};

type PlanetPosition = ZodiacPosition;

type HouseCusp = {
  house: number;
  longitude: number;
  sign: string;
  signIndex: number;
  degreeInsideSign: number;
};

type Aspect = {
  body1: string;
  body2: string;
  angle: number;
  type: string;
  orb: number;
};

const ZODIAC_SIGNS = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
] as const;

const DEGREES_PER_SIGN = 30;
const TOTAL_DEGREES = 360;
const NUM_HOUSES = 12;

const PLANET_BODIES = [
  { key: "moon", body: Astronomy.Body.Moon },
  { key: "mercury", body: Astronomy.Body.Mercury },
  { key: "venus", body: Astronomy.Body.Venus },
  { key: "mars", body: Astronomy.Body.Mars },
  { key: "jupiter", body: Astronomy.Body.Jupiter },
  { key: "saturn", body: Astronomy.Body.Saturn },
  { key: "uranus", body: Astronomy.Body.Uranus },
  { key: "neptune", body: Astronomy.Body.Neptune },
  { key: "pluto", body: Astronomy.Body.Pluto },
] as const;

const ASPECT_DEFINITIONS = [
  { name: "Conjunction", exact: 0 },
  { name: "Sextile", exact: 60 },
  { name: "Square", exact: 90 },
  { name: "Trine", exact: 120 },
  { name: "Quincunx", exact: 150 },
  { name: "Opposition", exact: 180 },
] as const;

const MAX_ASPECT_ORB = 6;

const zodiacFromLongitude = (longitude: number): ZodiacPosition => {
  const normalized =
    ((longitude % TOTAL_DEGREES) + TOTAL_DEGREES) % TOTAL_DEGREES;
  const signIndex = Math.floor(normalized / DEGREES_PER_SIGN);
  const degreeInsideSign = normalized - signIndex * DEGREES_PER_SIGN;
  return {
    longitude: normalized,
    sign: ZODIAC_SIGNS[signIndex],
    signIndex,
    degreeInsideSign,
  };
};

const getAscendant = (
  astroTime: Astronomy.AstroTime,
  latitude: number,
  longitude: number
): ZodiacPosition => {
  const observer = new Astronomy.Observer(latitude, longitude, 0);
  const horPoint: any = { lat: 0, lon: 90, dist: 1 };
  const horVec = Astronomy.VectorFromHorizon(horPoint, astroTime, "normal");
  const rot = Astronomy.Rotation_HOR_ECL(astroTime, observer);
  const eclVec = Astronomy.RotateVector(rot, horVec);
  const sphere = Astronomy.SphereFromVector(eclVec);
  return zodiacFromLongitude(sphere.lon);
};

const getHouseCusps = (
  astroTime: Astronomy.AstroTime,
  latitude: number,
  longitude: number
): HouseCusp[] | null => {
  const lib: any = Astronomy;
  let cusps: number[] | null = null;

  if (lib.HouseCusps) {
    try {
      const c = lib.HouseCusps(astroTime, longitude, latitude);
      if (Array.isArray(c) && c.length >= NUM_HOUSES) {
        cusps = c;
      }
    } catch {}
  }

  if (!cusps && lib.Houses) {
    try {
      const h = lib.Houses(astroTime, longitude, latitude);
      if (h && Array.isArray(h.cusps) && h.cusps.length >= NUM_HOUSES) {
        cusps = h.cusps;
      }
    } catch {}
  }

  if (!cusps) {
    const asc = getAscendant(astroTime, latitude, longitude);
    if (!asc) return null;
    cusps = [];
    for (let i = 0; i < NUM_HOUSES; i++) {
      cusps.push(asc.longitude + i * DEGREES_PER_SIGN);
    }
  }

  return cusps.map((cuspLon, idx) => {
    const z = zodiacFromLongitude(cuspLon);
    return {
      house: idx + 1,
      longitude: z.longitude,
      sign: z.sign,
      signIndex: z.signIndex,
      degreeInsideSign: z.degreeInsideSign,
    };
  });
};

const calculatePlanetPositions = (
  astroTime: Astronomy.AstroTime
): Record<string, PlanetPosition> => {
  const planetPositions: Record<string, PlanetPosition> = {};

  for (const { key, body } of PLANET_BODIES) {
    const lon = Astronomy.EclipticLongitude(body, astroTime);
    planetPositions[key] = zodiacFromLongitude(lon);
  }

  const sunEcliptic = Astronomy.SunPosition(astroTime);
  planetPositions.sun = zodiacFromLongitude(sunEcliptic.elon);

  return planetPositions;
};

const angularDistance = (a: number, b: number): number => {
  let d = Math.abs(a - b);
  if (d > 180) d = TOTAL_DEGREES - d;
  return d;
};

const getAspect = (angle: number): { type: string; orb: number } | null => {
  for (const asp of ASPECT_DEFINITIONS) {
    const diff = Math.abs(angle - asp.exact);
    if (diff <= MAX_ASPECT_ORB) {
      return { type: asp.name, orb: diff };
    }
  }
  return null;
};

const calculateAspects = (
  positions: Record<string, PlanetPosition>
): Aspect[] => {
  const names = Object.keys(positions);
  const result: Aspect[] = [];

  for (let i = 0; i < names.length; i++) {
    for (let j = i + 1; j < names.length; j++) {
      const p1 = names[i];
      const p2 = names[j];
      const lon1 = positions[p1].longitude;
      const lon2 = positions[p2].longitude;
      const angle = angularDistance(lon1, lon2);
      const aspect = getAspect(angle);

      if (aspect) {
        result.push({
          body1: p1,
          body2: p2,
          angle,
          type: aspect.type,
          orb: aspect.orb,
        });
      }
    }
  }

  return result;
};

const validateRequestBody = (body: any): body is RequestBody => {
  return (
    typeof body.year === "number" &&
    typeof body.month === "number" &&
    typeof body.day === "number" &&
    typeof body.hour === "number" &&
    typeof body.minute === "number" &&
    typeof body.timezone === "string" &&
    typeof body.lat === "number" &&
    typeof body.lon === "number"
  );
};

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!validateRequestBody(body)) {
      return NextResponse.json(
        { error: "missing required fields" },
        { status: 400 }
      );
    }

    const {
      year,
      month,
      day,
      hour,
      minute,
      second = 0,
      timezone,
      lat,
      lon,
    } = body;

    const dt = DateTime.fromObject(
      { year, month, day, hour, minute, second },
      { zone: timezone }
    );

    if (!dt.isValid) {
      return NextResponse.json(
        { error: "invalid date or timezone" },
        { status: 400 }
      );
    }

    const utc = dt.toUTC();
    const utcJsDate = utc.toJSDate();

    let astroTime: Astronomy.AstroTime;
    if (Astronomy.MakeTime) {
      astroTime = Astronomy.MakeTime(utcJsDate);
    } else {
      astroTime = new Astronomy.AstroTime(utcJsDate);
    }

    const planetPositions = calculatePlanetPositions(astroTime);
    const ascendant = getAscendant(astroTime, lat, lon);
    const houses = getHouseCusps(astroTime, lat, lon);
    const aspects = calculateAspects(planetPositions);

    const chart = {
      utc: utc.toISO(),
      planets: planetPositions,
      ascendant,
      houses,
      aspects,
    };

    return NextResponse.json({ chart });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
