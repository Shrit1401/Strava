import { NextResponse } from "next/server";
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";
import {
  ZodiacPosition,
  PlanetPosition,
  HouseCusp,
  PlanetHouseAssignment,
  Aspect,
  ChartInterpretation,
} from "@/types/chart";
import {
  ZODIAC_SIGNS,
  DEGREES_PER_SIGN,
  TOTAL_DEGREES,
  NUM_HOUSES,
  PLANET_MEANINGS,
  SIGN_MEANINGS,
  HOUSE_MEANINGS,
  HOUSE_RULERS,
  ASPECT_MODIFIERS,
  HOUSE_IMPORTANCE_ORDER,
  PERSONAL_PLANETS,
} from "@/constants/astrology";

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

type AspectModifier = {
  planet1: string;
  planet2: string;
  type: string;
  modifier: string;
};

const getHouseRulerInfo = (
  house: HouseCusp,
  planetPositions: Record<string, PlanetPosition>,
  planetHouses: PlanetHouseAssignment
): {
  ruler: string;
  rulerHouse: number;
  rulerSign: string;
  rulerInterpretation: string;
} | null => {
  const rulerPlanet = HOUSE_RULERS[house.sign];
  if (!rulerPlanet || !planetPositions[rulerPlanet]) {
    return null;
  }

  const rulerPosition = planetPositions[rulerPlanet];
  const rulerHouse = planetHouses[rulerPlanet] || 0;
  const rulerSign = rulerPosition.sign;

  const rulerMeaning = PLANET_MEANINGS[rulerPlanet] || "";
  const signMeaning = SIGN_MEANINGS[rulerSign] || "";
  const houseMeaning = HOUSE_MEANINGS[rulerHouse] || "";

  const rulerInterpretation = `${rulerMeaning} expressed in ${signMeaning} style within ${houseMeaning}`;

  return {
    ruler: rulerPlanet,
    rulerHouse,
    rulerSign,
    rulerInterpretation,
  };
};

const createPrediction = (
  planetName: string,
  position: PlanetPosition,
  house: number,
  houseRulerInfo: ReturnType<typeof getHouseRulerInfo>
): string => {
  const planetMeaning = PLANET_MEANINGS[planetName] || "";
  const signMeaning = SIGN_MEANINGS[position.sign] || "";
  const houseMeaning = HOUSE_MEANINGS[house] || "";

  let prediction = `You are likely to experience ${houseMeaning} in a ${signMeaning} style, especially when ${planetMeaning} is activated`;

  if (houseRulerInfo) {
    const rulerHouseMeaning = HOUSE_MEANINGS[houseRulerInfo.rulerHouse] || "";
    const rulerSignStyle = SIGN_MEANINGS[houseRulerInfo.rulerSign] || "";
    prediction += `. These themes tend to flow toward ${rulerHouseMeaning} and express in ${rulerSignStyle} ways`;
  }

  return prediction;
};

const getAspectModifiers = (
  aspects: Aspect[],
  planetName: string,
  ascendantRuler: string | null
): AspectModifier[] => {
  const importantPlanets = ["sun", "moon"];
  if (ascendantRuler) {
    importantPlanets.push(ascendantRuler);
  }

  return aspects
    .filter((asp) => {
      const isPlanetInvolved =
        asp.body1 === planetName || asp.body2 === planetName;
      if (!isPlanetInvolved) return false;

      const otherPlanet = asp.body1 === planetName ? asp.body2 : asp.body1;
      return (
        importantPlanets.includes(planetName) ||
        importantPlanets.includes(otherPlanet)
      );
    })
    .map((asp) => {
      const otherPlanet = asp.body1 === planetName ? asp.body2 : asp.body1;
      const modifier = ASPECT_MODIFIERS[asp.type] || "";
      const planet1Name = PLANET_MEANINGS[planetName] || planetName;
      const planet2Name = PLANET_MEANINGS[otherPlanet] || otherPlanet;

      let modifierText = "";
      if (asp.type === "Square" || asp.type === "Opposition") {
        modifierText = `You often experience tension between ${planet1Name} and ${planet2Name}, which ${modifier}`;
      } else if (asp.type === "Trine" || asp.type === "Sextile") {
        modifierText = `${planet1Name} and ${planet2Name} ${modifier}, creating natural harmony`;
      } else {
        modifierText = `${planet1Name} ${modifier} with ${planet2Name}`;
      }

      return {
        planet1: planetName,
        planet2: otherPlanet,
        type: asp.type,
        modifier: modifierText,
      };
    });
};

const generateInterpretations = (
  planetPositions: Record<string, PlanetPosition>,
  houses: HouseCusp[],
  planetHouses: PlanetHouseAssignment,
  aspects: Aspect[],
  ascendant: ZodiacPosition
): ChartInterpretation => {
  const ascendantRuler = HOUSE_RULERS[ascendant.sign];

  const corePersonality: string[] = [];
  const career: string[] = [];
  const relationships: string[] = [];
  const challenges: string[] = [];
  const strengths: string[] = [];

  if (ascendantRuler && planetPositions[ascendantRuler]) {
    const ascendantRulerPosition = planetPositions[ascendantRuler];
    const ascendantRulerHouse = planetHouses[ascendantRuler] || 0;
    const ascendantRulerSign = ascendantRulerPosition.sign;
    const rulerHouseMeaning = HOUSE_MEANINGS[ascendantRulerHouse] || "";
    const rulerSignStyle = SIGN_MEANINGS[ascendantRulerSign] || "";

    const ascPrediction = `With ${
      ascendant.sign
    } rising, you tend to express yourself in ${
      SIGN_MEANINGS[ascendant.sign] || ""
    } ways. Your ascendant ruler ${ascendantRuler} in ${ascendantRulerSign} in the ${ascendantRulerHouse}th house suggests you are likely to channel your identity through ${rulerHouseMeaning} in ${rulerSignStyle} style`;
    corePersonality.push(ascPrediction);
  }

  if (planetPositions.sun) {
    const sunHouse = planetHouses.sun || 0;
    const sunSign = planetPositions.sun.sign;
    const sunHouseCusp = houses.find((h) => h.house === sunHouse);

    if (sunHouseCusp) {
      const sunHouseRuler = getHouseRulerInfo(
        sunHouseCusp,
        planetPositions,
        planetHouses
      );
      let sunPrediction = createPrediction(
        "sun",
        planetPositions.sun,
        sunHouse,
        sunHouseRuler
      );

      const sunAspects = getAspectModifiers(aspects, "sun", ascendantRuler);
      if (sunAspects.length > 0) {
        sunPrediction += `. ${sunAspects[0].modifier}`;
      }

      if (sunHouse === 1 || sunHouse === 4) {
        corePersonality.push(sunPrediction);
      } else if (sunHouse === 10) {
        career.push(sunPrediction);
      } else if (sunHouse === 7) {
        relationships.push(sunPrediction);
      } else {
        corePersonality.push(sunPrediction);
      }
    }
  }

  if (planetPositions.moon) {
    const moonHouse = planetHouses.moon || 0;
    const moonSign = planetPositions.moon.sign;
    const moonHouseCusp = houses.find((h) => h.house === moonHouse);

    if (moonHouseCusp) {
      const moonHouseRuler = getHouseRulerInfo(
        moonHouseCusp,
        planetPositions,
        planetHouses
      );
      let moonPrediction = createPrediction(
        "moon",
        planetPositions.moon,
        moonHouse,
        moonHouseRuler
      );

      const moonAspects = getAspectModifiers(aspects, "moon", ascendantRuler);
      if (moonAspects.length > 0) {
        moonPrediction += `. ${moonAspects[0].modifier}`;
      }

      if (moonHouse === 1 || moonHouse === 4) {
        corePersonality.push(moonPrediction);
      } else if (moonHouse === 10) {
        career.push(moonPrediction);
      } else if (moonHouse === 7) {
        relationships.push(moonPrediction);
      } else {
        corePersonality.push(moonPrediction);
      }
    }
  }

  const house10 = houses.find((h) => h.house === 10);
  if (house10) {
    const house10Ruler = getHouseRulerInfo(
      house10,
      planetPositions,
      planetHouses
    );
    if (house10Ruler) {
      const rulerHouseMeaning = HOUSE_MEANINGS[house10Ruler.rulerHouse] || "";
      const rulerSignStyle = SIGN_MEANINGS[house10Ruler.rulerSign] || "";
      const careerRulerText = `Your career tends to develop through ${rulerHouseMeaning} and express in ${rulerSignStyle} ways`;
      career.push(careerRulerText);
    }

    const planetsIn10 = Object.entries(planetHouses)
      .filter(([_, house]) => house === 10)
      .map(([planet]) => planet)
      .filter((p) => PERSONAL_PLANETS.includes(p));

    for (const planetName of planetsIn10) {
      if (planetPositions[planetName]) {
        const planetHouseRuler = getHouseRulerInfo(
          house10,
          planetPositions,
          planetHouses
        );
        const prediction = createPrediction(
          planetName,
          planetPositions[planetName],
          10,
          planetHouseRuler
        );
        career.push(prediction);
      }
    }
  }

  const house7 = houses.find((h) => h.house === 7);
  if (house7) {
    const house7Ruler = getHouseRulerInfo(
      house7,
      planetPositions,
      planetHouses
    );
    if (house7Ruler) {
      const rulerHouseMeaning = HOUSE_MEANINGS[house7Ruler.rulerHouse] || "";
      const rulerSignStyle = SIGN_MEANINGS[house7Ruler.rulerSign] || "";
      const relationshipRulerText = `Your relationships tend to flow toward ${rulerHouseMeaning} and express in ${rulerSignStyle} ways`;
      relationships.push(relationshipRulerText);
    }

    if (planetPositions.venus && planetHouses.venus === 7) {
      const venusHouseRuler = getHouseRulerInfo(
        house7,
        planetPositions,
        planetHouses
      );
      const venusPrediction = createPrediction(
        "venus",
        planetPositions.venus,
        7,
        venusHouseRuler
      );
      relationships.push(venusPrediction);
    }

    if (planetPositions.moon && planetHouses.moon === 7) {
      const moonHouseRuler = getHouseRulerInfo(
        house7,
        planetPositions,
        planetHouses
      );
      const moonPrediction = createPrediction(
        "moon",
        planetPositions.moon,
        7,
        moonHouseRuler
      );
      relationships.push(moonPrediction);
    }
  }

  for (const planetName of PERSONAL_PLANETS) {
    if (!planetPositions[planetName]) continue;

    const house = planetHouses[planetName] || 0;
    if (house === 0) continue;

    if (house === 1 || house === 10 || house === 7 || house === 4) continue;

    const houseCusp = houses.find((h) => h.house === house);
    if (!houseCusp) continue;

    const houseRuler = getHouseRulerInfo(
      houseCusp,
      planetPositions,
      planetHouses
    );
    const prediction = createPrediction(
      planetName,
      planetPositions[planetName],
      house,
      houseRuler
    );

    if (house === 5 || house === 9 || house === 11) {
      strengths.push(prediction);
    } else if (house === 6 || house === 8 || house === 12) {
      challenges.push(prediction);
    }
  }

  const sunMoonAspects = aspects.filter(
    (asp) =>
      (asp.body1 === "sun" || asp.body1 === "moon") &&
      (asp.body2 === "sun" || asp.body2 === "moon")
  );

  for (const aspect of sunMoonAspects) {
    const modifier = ASPECT_MODIFIERS[aspect.type] || "";
    if (aspect.type === "Square" || aspect.type === "Opposition") {
      challenges.push(
        `You often experience tension between your core identity and emotional needs, which ${modifier}`
      );
    } else {
      strengths.push(
        `Your identity and emotions ${modifier}, creating natural harmony`
      );
    }
  }

  if (ascendantRuler) {
    const ascendantRulerAspects = aspects.filter(
      (asp) =>
        (asp.body1 === ascendantRuler || asp.body2 === ascendantRuler) &&
        (asp.body1 === "sun" ||
          asp.body1 === "moon" ||
          asp.body2 === "sun" ||
          asp.body2 === "moon")
    );

    for (const aspect of ascendantRulerAspects) {
      const otherPlanet =
        aspect.body1 === ascendantRuler ? aspect.body2 : aspect.body1;
      const modifier = ASPECT_MODIFIERS[aspect.type] || "";
      if (aspect.type === "Square" || aspect.type === "Opposition") {
        challenges.push(
          `Your ascendant ruler ${ascendantRuler} creates tension with ${otherPlanet}, which ${modifier}`
        );
      } else {
        strengths.push(
          `Your ascendant ruler ${ascendantRuler} ${modifier} with ${otherPlanet}`
        );
      }
    }
  }

  return {
    corePersonality: corePersonality.slice(0, 6),
    career: career.slice(0, 5),
    relationships: relationships.slice(0, 5),
    challenges: challenges.slice(0, 5),
    strengths: strengths.slice(0, 5),
  };
};

const getWholeSignHouses = (ascendant: ZodiacPosition): HouseCusp[] => {
  const houses: HouseCusp[] = [];
  const ascendantSignIndex = ascendant.signIndex;

  for (let i = 0; i < NUM_HOUSES; i++) {
    const signIndex = (ascendantSignIndex + i) % NUM_HOUSES;
    const sign = ZODIAC_SIGNS[signIndex];
    const longitude = signIndex * DEGREES_PER_SIGN;

    houses.push({
      house: i + 1,
      longitude,
      sign,
      signIndex,
      degreeInsideSign: 0,
    });
  }

  return houses;
};

const assignPlanetsToHouses = (
  planetPositions: Record<string, PlanetPosition>,
  ascendant: ZodiacPosition
): PlanetHouseAssignment => {
  const assignments: PlanetHouseAssignment = {};
  const ascendantSignIndex = ascendant.signIndex;

  for (const [planetName, position] of Object.entries(planetPositions)) {
    const planetSignIndex = position.signIndex;
    let signDifference = planetSignIndex - ascendantSignIndex;

    if (signDifference < 0) {
      signDifference += NUM_HOUSES;
    }

    const houseNumber = signDifference + 1;
    assignments[planetName] = houseNumber;
  }

  return assignments;
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
    const houses = getWholeSignHouses(ascendant);
    const planetHouses = assignPlanetsToHouses(planetPositions, ascendant);
    const aspects = calculateAspects(planetPositions);

    const interpretations = generateInterpretations(
      planetPositions,
      houses,
      planetHouses,
      aspects,
      ascendant
    );

    const ist = utc.setZone("Asia/Kolkata");

    const chart = {
      utc: utc.toISO(),
      ist: ist.toISO(),
      planets: planetPositions,
      ascendant,
      houses,
      planetHouses,
      aspects,
      houseSystem: "Whole Sign",
      interpretations,
    };

    return NextResponse.json({ chart });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
