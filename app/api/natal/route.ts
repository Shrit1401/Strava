import { NextResponse } from "next/server";
import * as Astronomy from "astronomy-engine";
import { DateTime } from "luxon";

export async function POST(req: Request) {
  try {
    const body = await req.json();

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
    } = body || {};

    if (
      !year ||
      month == null ||
      day == null ||
      hour == null ||
      minute == null ||
      !timezone ||
      lat == null ||
      lon == null
    ) {
      return NextResponse.json(
        { error: "missing required fields" },
        { status: 400 }
      );
    }

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

    let astroTime;
    if (Astronomy.MakeTime) {
      astroTime = Astronomy.MakeTime(utcJsDate);
    } else {
      astroTime = new Astronomy.AstroTime(utcJsDate);
    }

    const bodies = [
      { key: "moon", body: Astronomy.Body.Moon },
      { key: "mercury", body: Astronomy.Body.Mercury },
      { key: "venus", body: Astronomy.Body.Venus },
      { key: "mars", body: Astronomy.Body.Mars },
      { key: "jupiter", body: Astronomy.Body.Jupiter },
      { key: "saturn", body: Astronomy.Body.Saturn },
      { key: "uranus", body: Astronomy.Body.Uranus },
      { key: "neptune", body: Astronomy.Body.Neptune },
      { key: "pluto", body: Astronomy.Body.Pluto },
    ];

    const signs = [
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
    ];

    const zodiacFromLongitude = (longitude: number) => {
      const normalized = ((longitude % 360) + 360) % 360;
      const signIndex = Math.floor(normalized / 30);
      const degreeInsideSign = normalized - signIndex * 30;
      return {
        longitude: normalized,
        sign: signs[signIndex],
        signIndex,
        degreeInsideSign,
      };
    };

    const getAscendant = (
      astroTime: Astronomy.AstroTime,
      latitude: number,
      longitude: number
    ) => {
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
    ) => {
      const lib: any = Astronomy;
      let cusps: number[] | null = null;

      if (lib.HouseCusps) {
        try {
          const c = lib.HouseCusps(astroTime, longitude, latitude);
          if (Array.isArray(c) && c.length >= 12) {
            cusps = c;
          }
        } catch {}
      }

      if (!cusps && lib.Houses) {
        try {
          const h = lib.Houses(astroTime, longitude, latitude);
          if (h && Array.isArray(h.cusps) && h.cusps.length >= 12) {
            cusps = h.cusps;
          }
        } catch {}
      }

      if (!cusps) {
        const asc = getAscendant(astroTime, latitude, longitude);
        if (!asc) return null;
        cusps = [];
        for (let i = 0; i < 12; i++) {
          cusps.push(asc.longitude + i * 30);
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

    const planetPositions: Record<
      string,
      {
        longitude: number;
        sign: string;
        signIndex: number;
        degreeInsideSign: number;
      }
    > = {};

    for (const { key, body } of bodies) {
      const lon = Astronomy.EclipticLongitude(body, astroTime);
      planetPositions[key] = zodiacFromLongitude(lon);
    }

    const sunEcliptic = Astronomy.SunPosition(astroTime);
    planetPositions.sun = zodiacFromLongitude(sunEcliptic.elon);

    const ascendant = getAscendant(astroTime, lat, lon);
    const houses = getHouseCusps(astroTime, lat, lon);

    const angularDistance = (a: number, b: number) => {
      let d = Math.abs(a - b);
      if (d > 180) d = 360 - d;
      return d;
    };

    const getAspect = (angle: number) => {
      const aspects = [
        { name: "Conjunction", exact: 0 },
        { name: "Sextile", exact: 60 },
        { name: "Square", exact: 90 },
        { name: "Trine", exact: 120 },
        { name: "Quincunx", exact: 150 },
        { name: "Opposition", exact: 180 },
      ];
      for (const asp of aspects) {
        const diff = Math.abs(angle - asp.exact);
        if (diff <= 6) {
          return { type: asp.name, orb: diff };
        }
      }
      return null;
    };

    const getAspects = (positions: typeof planetPositions) => {
      const names = Object.keys(positions);
      const result: {
        body1: string;
        body2: string;
        angle: number;
        type: string;
        orb: number;
      }[] = [];
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

    const aspects = getAspects(planetPositions);

    const chart = {
      utc: utc.toISO(),
      planets: planetPositions,
      ascendant,
      houses,
      aspects,
    };

    return NextResponse.json({
      chart,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: String(err.message || err) },
      { status: 500 }
    );
  }
}
