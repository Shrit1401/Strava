import React, { useState } from "react";
import { ChartData } from "@/types/chart";

type TooltipState = {
  name: string;
  sign: string;
  degree: number;
  x: number;
  y: number;
} | null;

type PlanetPosition = {
  longitude: number;
  sign: string;
  signIndex: number;
  degreeInsideSign: number;
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

const CHART_CONSTANTS = {
  SIZE: 560,
  OUTER_RADIUS: 240,
  INNER_RADIUS: 210,
  PLANET_RADIUS: 175,
  SIGN_TEXT_RADIUS_OFFSET: 20,
  ICON_SIZE_PX: 18,
  MIN_ANGULAR_SEPARATION: 8,
  DEGREES_PER_SIGN: 30,
  PLANET_POSITIONING_PASSES: 3,
} as const;

const PLANET_ICONS: Record<string, string> = {
  sun: "/planets/sun.svg",
  moon: "/planets/moon.svg",
  mercury: "/planets/mercury.svg",
  venus: "/planets/venus.svg",
  mars: "/planets/mars.svg",
  jupiter: "/planets/jupiter.svg",
  saturn: "/planets/saturn.svg",
  uranus: "/planets/uranus.svg",
  neptune: "/planets/neptune.svg",
  pluto: "/planets/pluto.svg",
  ascendant: "/planets/ascendant.svg",
};

const NatalChart = ({ chart }: { chart: ChartData }) => {
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  const size = CHART_CONSTANTS.SIZE;
  const center = size / 2;
  const outerRadius = CHART_CONSTANTS.OUTER_RADIUS;
  const innerRadius = CHART_CONSTANTS.INNER_RADIUS;
  const planetRadius = CHART_CONSTANTS.PLANET_RADIUS;
  const signTextRadius = outerRadius - CHART_CONSTANTS.SIGN_TEXT_RADIUS_OFFSET;

  const angleForLongitude = (lon: number): number => {
    const deg = lon - 90;
    return (deg * Math.PI) / 180;
  };

  const pointOnCircle = (radius: number, lon: number) => {
    const a = angleForLongitude(lon);
    return {
      x: center + radius * Math.cos(a),
      y: center + radius * Math.sin(a),
    };
  };

  const arcPathForSign = (index: number): string => {
    const startLon = index * CHART_CONSTANTS.DEGREES_PER_SIGN;
    const endLon = startLon + CHART_CONSTANTS.DEGREES_PER_SIGN;
    const a1 = angleForLongitude(startLon);
    const a2 = angleForLongitude(endLon);
    const x1 = center + signTextRadius * Math.cos(a1);
    const y1 = center + signTextRadius * Math.sin(a1);
    const x2 = center + signTextRadius * Math.cos(a2);
    const y2 = center + signTextRadius * Math.sin(a2);
    return `M ${x1} ${y1} A ${signTextRadius} ${signTextRadius} 0 0 1 ${x2} ${y2}`;
  };

  const angularDistance = (lon1: number, lon2: number): number => {
    const diff = Math.abs(lon1 - lon2);
    return Math.min(diff, 360 - diff);
  };

  const normalizeAngle = (angle: number): number => {
    while (angle < 0) angle += 360;
    while (angle >= 360) angle -= 360;
    return angle;
  };

  const calculatePlanetPositions = (): Record<
    string,
    { x: number; y: number }
  > => {
    const planetAngles: Record<string, number> = {};
    const planetEntries = Object.entries(chart.planets);

    planetEntries.forEach(([name, pos]) => {
      planetAngles[name] = pos.longitude;
    });

    if (chart.ascendant) {
      planetAngles["ascendant"] = chart.ascendant.longitude;
    }

    const allEntries = [
      ...planetEntries.map(([name, pos]) => ({
        name,
        longitude: pos.longitude,
      })),
      ...(chart.ascendant
        ? [{ name: "ascendant", longitude: chart.ascendant.longitude }]
        : []),
    ];

    const sortedEntries = allEntries.sort((a, b) => a.longitude - b.longitude);

    for (
      let pass = 0;
      pass < CHART_CONSTANTS.PLANET_POSITIONING_PASSES;
      pass++
    ) {
      for (let i = 0; i < sortedEntries.length; i++) {
        const current = sortedEntries[i];
        const next = sortedEntries[(i + 1) % sortedEntries.length];
        const currentAngle = planetAngles[current.name];
        const nextAngle = planetAngles[next.name];
        const dist = angularDistance(currentAngle, nextAngle);

        if (dist < CHART_CONSTANTS.MIN_ANGULAR_SEPARATION) {
          const diff = nextAngle - currentAngle;
          let normalizedDiff = diff;
          if (diff > 180) normalizedDiff = diff - 360;
          else if (diff < -180) normalizedDiff = diff + 360;

          const adjustment =
            (CHART_CONSTANTS.MIN_ANGULAR_SEPARATION -
              Math.abs(normalizedDiff)) /
              2 +
            0.5;

          planetAngles[current.name] = normalizeAngle(
            currentAngle - adjustment
          );
          planetAngles[next.name] = normalizeAngle(nextAngle + adjustment);
        }
      }
    }

    const planetPoints: Record<string, { x: number; y: number }> = {};
    Object.entries(chart.planets).forEach(([name]) => {
      const angle = planetAngles[name] || chart.planets[name].longitude;
      planetPoints[name] = pointOnCircle(planetRadius, angle);
    });

    if (chart.ascendant) {
      const ascAngle = planetAngles["ascendant"] || chart.ascendant.longitude;
      planetPoints["ascendant"] = pointOnCircle(planetRadius, ascAngle);
    }

    return planetPoints;
  };

  const planetPoints = calculatePlanetPositions();

  const formatPlanetName = (name: string): string => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  type AspectStyle = {
    color: string;
    dash: string | undefined;
    width: number;
    opacity: number;
  };

  const getAspectStyle = (type: string, orb: number): AspectStyle => {
    const isMajor =
      type === "Conjunction" || type === "Opposition" || type === "Square";
    const isMedium = type === "Trine";
    const isMinor = type === "Sextile" || type === "Quincunx";
    const tightOrb = orb < 3;

    if (isMajor && tightOrb) {
      return {
        color: "#111111",
        dash: undefined,
        width: 1.2,
        opacity: 0.9,
      };
    }
    if (isMajor) {
      return {
        color: "#111111",
        dash: "4 3",
        width: 1.0,
        opacity: 0.85,
      };
    }
    if (isMedium && tightOrb) {
      return {
        color: "#4b5563",
        dash: "3 4",
        width: 0.9,
        opacity: 0.8,
      };
    }
    if (isMedium) {
      return {
        color: "#6b7280",
        dash: "2 3",
        width: 0.8,
        opacity: 0.7,
      };
    }
    if (isMinor && tightOrb) {
      return {
        color: "#9ca3af",
        dash: "1.5 2.5",
        width: 0.7,
        opacity: 0.6,
      };
    }
    if (isMinor) {
      return {
        color: "#d1d5db",
        dash: "1 2",
        width: 0.6,
        opacity: 0.5,
      };
    }
    return {
      color: "#e5e7eb",
      dash: "1 3",
      width: 0.5,
      opacity: 0.4,
    };
  };

  const handlePlanetMouseEnter = (
    e: React.MouseEvent<SVGGElement>,
    name: string,
    pos: PlanetPosition
  ) => {
    const container = e.currentTarget.closest("div");
    const rect = container?.getBoundingClientRect();
    if (rect) {
      setTooltip({
        name: formatPlanetName(name),
        sign: pos.sign,
        degree: Math.round(pos.degreeInsideSign * 10) / 10,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  const handlePlanetMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    const container = e.currentTarget.closest("div");
    const rect = container?.getBoundingClientRect();
    if (rect && tooltip) {
      setTooltip({
        ...tooltip,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  return (
    <div className="w-full flex justify-center relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {ZODIAC_SIGNS.map((_, index) => (
            <path
              key={`arc-${index}`}
              id={`signArc_${index}`}
              d={arcPathForSign(index)}
            />
          ))}
        </defs>

        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="#000000"
          stroke="#000000"
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="#f9fafb"
          stroke="#e5e7eb"
        />

        <circle
          cx={center}
          cy={center}
          r={innerRadius - 24}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth={0.7}
        />

        <circle
          cx={center}
          cy={center}
          r={innerRadius - 54}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={0.7}
        />

        <circle
          cx={center}
          cy={center}
          r={planetRadius}
          fill="none"
          stroke="#555"
          strokeWidth={0.5}
          opacity={0.6}
        />

        {ZODIAC_SIGNS.map((sign, index) => {
          const startLon = index * CHART_CONSTANTS.DEGREES_PER_SIGN;
          const endLon = startLon + CHART_CONSTANTS.DEGREES_PER_SIGN;
          const start = pointOnCircle(outerRadius, startLon);
          const end = pointOnCircle(outerRadius, endLon);
          return (
            <g key={sign}>
              <line
                x1={start.x}
                y1={start.y}
                x2={end.x}
                y2={end.y}
                stroke="#111111"
                strokeWidth={1}
              />
              <text
                fill="#f7f7f7"
                fontSize="14"
                style={{ letterSpacing: "0.14em" }}
              >
                <textPath
                  href={`#signArc_${index}`}
                  startOffset="50%"
                  textAnchor="middle"
                >
                  {sign.toUpperCase()}
                </textPath>
              </text>
            </g>
          );
        })}

        {chart.aspects.map((asp, index) => {
          const p1 = planetPoints[asp.body1];
          const p2 = planetPoints[asp.body2];
          if (!p1 || !p2) return null;
          const style = getAspectStyle(asp.type, asp.orb || 0);
          return (
            <line
              key={`${asp.body1}-${asp.body2}-${index}`}
              x1={p1.x}
              y1={p1.y}
              x2={p2.x}
              y2={p2.y}
              stroke={style.color}
              strokeWidth={style.width}
              strokeDasharray={style.dash}
              opacity={style.opacity}
            />
          );
        })}

        {Object.entries(chart.planets).map(([name, pos]) => {
          const point = planetPoints[name];
          const key = name.toLowerCase();
          const icon = PLANET_ICONS[key];
          if (!point) return null;
          return (
            <g
              key={name}
              onMouseEnter={(e) => handlePlanetMouseEnter(e, name, pos)}
              onMouseMove={handlePlanetMouseMove}
              onMouseLeave={() => setTooltip(null)}
              style={{ cursor: "pointer" }}
            >
              {icon ? (
                <>
                  <title>{`${formatPlanetName(name)} in ${pos.sign} ${
                    Math.round(pos.degreeInsideSign * 10) / 10
                  }°`}</title>
                  <image
                    href={icon}
                    x={point.x - CHART_CONSTANTS.ICON_SIZE_PX / 2}
                    y={point.y - CHART_CONSTANTS.ICON_SIZE_PX / 2}
                    width={CHART_CONSTANTS.ICON_SIZE_PX}
                    height={CHART_CONSTANTS.ICON_SIZE_PX}
                  />
                </>
              ) : (
                <>
                  <title>{`${formatPlanetName(name)} in ${pos.sign} ${
                    Math.round(pos.degreeInsideSign * 10) / 10
                  }°`}</title>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={4}
                    fill="#111827"
                    stroke="#f9fafb"
                    strokeWidth={1}
                  />
                </>
              )}
            </g>
          );
        })}

        {chart.ascendant &&
          (() => {
            const asc = chart.ascendant;
            const ascPoint = planetPoints["ascendant"];
            const icon = PLANET_ICONS.ascendant;
            if (!ascPoint) return null;
            return (
              <g
                onMouseEnter={(e) =>
                  handlePlanetMouseEnter(e, "ascendant", asc)
                }
                onMouseMove={handlePlanetMouseMove}
                onMouseLeave={() => setTooltip(null)}
                style={{ cursor: "pointer" }}
              >
                {icon && (
                  <>
                    <title>{`Ascendant in ${asc.sign} ${
                      Math.round(asc.degreeInsideSign * 10) / 10
                    }°`}</title>
                    <image
                      href={icon}
                      x={ascPoint.x - CHART_CONSTANTS.ICON_SIZE_PX / 2}
                      y={ascPoint.y - CHART_CONSTANTS.ICON_SIZE_PX / 2}
                      width={CHART_CONSTANTS.ICON_SIZE_PX}
                      height={CHART_CONSTANTS.ICON_SIZE_PX}
                    />
                  </>
                )}
              </g>
            );
          })()}
      </svg>
      {tooltip && (
        <div
          className="absolute pointer-events-none bg-black text-white text-xs px-2 py-1 rounded shadow-lg z-50"
          style={{
            left: `${tooltip.x + 10}px`,
            top: `${tooltip.y - 10}px`,
            transform: "translate(0, -100%)",
          }}
        >
          <div className="font-semibold">{tooltip.name}</div>
          <div className="text-gray-300">
            {tooltip.sign} {tooltip.degree}°
          </div>
        </div>
      )}
    </div>
  );
};

export default NatalChart;
