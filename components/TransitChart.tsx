"use client";

import Image from "next/image";

interface TransitChartProps {
  planet1: {
    name: string;
    longitude: number;
    icon: string;
  };
  planet2: {
    name: string;
    longitude: number;
    icon: string;
  };
  aspect: {
    type: string;
    angle: number;
  };
  size?: number;
}

const TransitChart = ({
  planet1,
  planet2,
  aspect,
  size = 400,
}: TransitChartProps) => {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.35;
  const planetRadius = size * 0.3;
  const numberRadius = size * 0.42;

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

  const p1 = pointOnCircle(planetRadius, planet1.longitude);
  const p2 = pointOnCircle(planetRadius, planet2.longitude);

  const controlRadius = planetRadius * 0.6;
  const midAngle =
    (angleForLongitude(planet1.longitude) +
      angleForLongitude(planet2.longitude)) /
    2;
  const controlX = center + controlRadius * Math.cos(midAngle);
  const controlY = center + controlRadius * Math.sin(midAngle);

  const aspectLabelRadius = planetRadius * 0.75;
  const labelX = center + aspectLabelRadius * Math.cos(midAngle);
  const labelY = center + aspectLabelRadius * Math.sin(midAngle);

  const getAspectColor = (type: string): string => {
    const lower = type.toLowerCase();
    if (lower.includes("trine")) return "#6b7280";
    if (lower.includes("sextile")) return "#9ca3af";
    if (lower.includes("conjunction")) return "#374151";
    if (lower.includes("opposition")) return "#111111";
    if (lower.includes("square")) return "#111111";
    if (lower.includes("none")) return "#d1d5db";
    return "#d1d5db";
  };

  const getAspectStyle = (
    type: string
  ): { strokeWidth: number; opacity: number } => {
    const lower = type.toLowerCase();
    if (lower.includes("trine") || lower.includes("sextile")) {
      return { strokeWidth: 1, opacity: 0.5 };
    }
    if (lower.includes("square") || lower.includes("opposition")) {
      return { strokeWidth: 1.5, opacity: 0.8 };
    }
    return { strokeWidth: 1.2, opacity: 0.6 };
  };

  const hasAspect = aspect.type && aspect.type.toLowerCase() !== "none";
  const aspectColor = getAspectColor(aspect.type);
  const aspectStyle = getAspectStyle(aspect.type);

  return (
    <div className="w-full flex justify-center py-8">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={1}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={0.7}
        />
        <circle
          cx={center}
          cy={center}
          r={innerRadius - 20}
          fill="none"
          stroke="#d1d5db"
          strokeWidth={0.5}
        />
        <circle
          cx={center}
          cy={center}
          r={planetRadius}
          fill="none"
          stroke="#9ca3af"
          strokeWidth={0.5}
          opacity={0.8}
        />

        {Array.from({ length: 12 }, (_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x = center + numberRadius * Math.cos(angle);
          const y = center + numberRadius * Math.sin(angle);
          return (
            <text
              key={i}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="#6b7280"
              fontSize="12"
              fontFamily="sans-serif"
            >
              {i + 1}
            </text>
          );
        })}

        {hasAspect && (
          <>
            <path
              d={`M ${p1.x} ${p1.y} Q ${controlX} ${controlY} ${p2.x} ${p2.y}`}
              fill="none"
              stroke={aspectColor}
              strokeWidth={aspectStyle.strokeWidth}
              opacity={aspectStyle.opacity}
            />

            <text
              x={labelX}
              y={labelY}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={aspectColor}
              fontSize="10"
              fontFamily="sans-serif"
              fontWeight="500"
              letterSpacing="0.05em"
            >
              {aspect.type.toUpperCase()}
            </text>
          </>
        )}

        <g>
          <circle
            cx={p1.x}
            cy={p1.y}
            r={12}
            fill="white"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <image
            href={planet1.icon}
            x={p1.x - 8}
            y={p1.y - 8}
            width={16}
            height={16}
          />
        </g>

        <g>
          <circle
            cx={p2.x}
            cy={p2.y}
            r={12}
            fill="white"
            stroke="#9ca3af"
            strokeWidth={1}
          />
          <image
            href={planet2.icon}
            x={p2.x - 8}
            y={p2.y - 8}
            width={16}
            height={16}
          />
        </g>

        <circle
          cx={center}
          cy={center}
          r={size * 0.08}
          fill="#f9fafb"
          stroke="#d1d5db"
          strokeWidth={0.5}
        />
      </svg>
    </div>
  );
};

export default TransitChart;
