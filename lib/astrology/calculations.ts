import * as Astronomy from "astronomy-engine";
import {
  ZODIAC_SIGNS,
  DEGREES_PER_SIGN,
  TOTAL_DEGREES,
  NUM_HOUSES,
} from "@/constants/astrology";
import { ZodiacPosition, PlanetPosition, HouseCusp, PlanetHouseAssignment, Aspect } from "@/types/chart";

const ASPECT_DEFINITIONS = [
  { name: "Conjunction", exact: 0 },
  { name: "Sextile", exact: 60 },
  { name: "Square", exact: 90 },
  { name: "Trine", exact: 120 },
  { name: "Quincunx", exact: 150 },
  { name: "Opposition", exact: 180 },
] as const;

const MAX_ASPECT_ORB = 6;

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

export const zodiacFromLongitude = (longitude: number): ZodiacPosition => {
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

export const angularDistance = (a: number, b: number): number => {
  let d = Math.abs(a - b);
  if (d > 180) d = TOTAL_DEGREES - d;
  return d;
};

export const getAspect = (angle: number): { type: string; orb: number } | null => {
  for (const asp of ASPECT_DEFINITIONS) {
    const diff = Math.abs(angle - asp.exact);
    if (diff <= MAX_ASPECT_ORB) {
      return { type: asp.name, orb: diff };
    }
  }
  return null;
};

export const getAscendant = (
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

export const getWholeSignHouses = (ascendant: ZodiacPosition): HouseCusp[] => {
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

export const assignPlanetToHouse = (
  planetSignIndex: number,
  ascendantSignIndex: number
): number => {
  let signDifference = planetSignIndex - ascendantSignIndex;
  if (signDifference < 0) {
    signDifference += NUM_HOUSES;
  }
  return signDifference + 1;
};

export const assignPlanetsToHouses = (
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

export const calculateSunPosition = (
  astroTime: Astronomy.AstroTime
): ZodiacPosition => {
  const sunEcliptic = Astronomy.SunPosition(astroTime);
  return zodiacFromLongitude(sunEcliptic.elon);
};

export const calculateMoonPosition = (
  astroTime: Astronomy.AstroTime
): ZodiacPosition => {
  const lon = Astronomy.EclipticLongitude(Astronomy.Body.Moon, astroTime);
  return zodiacFromLongitude(lon);
};

export const calculatePlanetPosition = (
  astroTime: Astronomy.AstroTime,
  body: Astronomy.Body
): ZodiacPosition => {
  const lon = Astronomy.EclipticLongitude(body, astroTime);
  return zodiacFromLongitude(lon);
};

export const calculatePlanetPositions = (
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

export const calculateAspects = (
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

export const createAstroTime = (date: Date): Astronomy.AstroTime => {
  if (Astronomy.MakeTime) {
    return Astronomy.MakeTime(date);
  } else {
    return new Astronomy.AstroTime(date);
  }
};

