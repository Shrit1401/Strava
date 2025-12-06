import React, { useState } from "react";

export type ChartData = {
  utc: string;
  planets: Record<
    string,
    {
      longitude: number;
      sign: string;
      signIndex: number;
      degreeInsideSign: number;
    }
  >;
  ascendant: {
    longitude: number;
    sign: string;
    signIndex: number;
    degreeInsideSign: number;
  } | null;
  houses:
    | {
        house: number;
        longitude: number;
        sign: string;
        signIndex: number;
        degreeInsideSign: number;
      }[]
    | null;
  aspects: {
    body1: string;
    body2: string;
    angle: number;
    type: string;
    orb: number;
  }[];
};

const NatalChart = ({ chart }: { chart: ChartData }) => {
  const [tooltip, setTooltip] = useState<{
    name: string;
    sign: string;
    degree: number;
    x: number;
    y: number;
  } | null>(null);

  const size = 560;
  const center = size / 2;
  const outerRadius = 240;
  const innerRadius = 210;
  const planetRadius = 175;
  const signTextRadius = outerRadius - 20;

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

  const angleForLongitude = (lon: number) => {
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

  const arcPathForSign = (index: number) => {
    const startLon = index * 30;
    const endLon = startLon + 30;
    const a1 = angleForLongitude(startLon);
    const a2 = angleForLongitude(endLon);
    const x1 = center + signTextRadius * Math.cos(a1);
    const y1 = center + signTextRadius * Math.sin(a1);
    const x2 = center + signTextRadius * Math.cos(a2);
    const y2 = center + signTextRadius * Math.sin(a2);
    return `M ${x1} ${y1} A ${signTextRadius} ${signTextRadius} 0 0 1 ${x2} ${y2}`;
  };

  const angularDistance = (lon1: number, lon2: number) => {
    const diff = Math.abs(lon1 - lon2);
    return Math.min(diff, 360 - diff);
  };

  const iconSizePx = 18;
  const minAngularSeparation = 8;

  const planetAngles: Record<string, number> = {};
  const planetEntries = Object.entries(chart.planets);

  planetEntries.forEach(([name, pos]) => {
    planetAngles[name] = pos.longitude;
  });

  if (chart.ascendant) {
    planetAngles["ascendant"] = chart.ascendant.longitude;
  }

  const allEntries = [
    ...planetEntries.map(([name, pos]) => ({ name, longitude: pos.longitude })),
    ...(chart.ascendant
      ? [{ name: "ascendant", longitude: chart.ascendant.longitude }]
      : []),
  ];

  const sortedEntries = allEntries.sort((a, b) => a.longitude - b.longitude);

  for (let pass = 0; pass < 3; pass++) {
    for (let i = 0; i < sortedEntries.length; i++) {
      const current = sortedEntries[i];
      const next = sortedEntries[(i + 1) % sortedEntries.length];
      const currentAngle = planetAngles[current.name];
      const nextAngle = planetAngles[next.name];
      const dist = angularDistance(currentAngle, nextAngle);

      if (dist < minAngularSeparation) {
        const diff = nextAngle - currentAngle;
        let normalizedDiff = diff;
        if (diff > 180) normalizedDiff = diff - 360;
        else if (diff < -180) normalizedDiff = diff + 360;

        const adjustment =
          (minAngularSeparation - Math.abs(normalizedDiff)) / 2 + 0.5;

        let newCurrentAngle = currentAngle - adjustment;
        let newNextAngle = nextAngle + adjustment;

        if (newCurrentAngle < 0) newCurrentAngle += 360;
        if (newCurrentAngle >= 360) newCurrentAngle -= 360;
        if (newNextAngle < 0) newNextAngle += 360;
        if (newNextAngle >= 360) newNextAngle -= 360;

        planetAngles[current.name] = newCurrentAngle;
        planetAngles[next.name] = newNextAngle;
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

  const planetIcons: Record<string, string> = {
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

  const formatPlanetName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
  };

  const getAspectStyle = (type: string, orb: number) => {
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

  return (
    <div className="w-full flex justify-center relative">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          {signs.map((_, index) => (
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

        {signs.map((sign, index) => {
          const startLon = index * 30;
          const endLon = startLon + 30;
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
          const icon = planetIcons[key];
          if (!point) return null;
          return (
            <g
              key={name}
              onMouseEnter={(e) => {
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
              }}
              onMouseMove={(e) => {
                const container = e.currentTarget.closest("div");
                const rect = container?.getBoundingClientRect();
                if (rect && tooltip) {
                  setTooltip({
                    ...tooltip,
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                  });
                }
              }}
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
                    x={point.x - iconSizePx / 2}
                    y={point.y - iconSizePx / 2}
                    width={iconSizePx}
                    height={iconSizePx}
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
            const ascAngle = planetAngles["ascendant"] || asc.longitude;
            const ascPoint = pointOnCircle(planetRadius, ascAngle);
            const icon = planetIcons.ascendant;
            return (
              <g
                onMouseEnter={(e) => {
                  const container = e.currentTarget.closest("div");
                  const rect = container?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      name: "Ascendant",
                      sign: asc.sign,
                      degree: Math.round(asc.degreeInsideSign * 10) / 10,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
                onMouseMove={(e) => {
                  const container = e.currentTarget.closest("div");
                  const rect = container?.getBoundingClientRect();
                  if (rect && tooltip) {
                    setTooltip({
                      ...tooltip,
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                    });
                  }
                }}
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
                      x={ascPoint.x - iconSizePx / 2}
                      y={ascPoint.y - iconSizePx / 2}
                      width={iconSizePx}
                      height={iconSizePx}
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
