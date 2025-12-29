"use client";

import Image from "next/image";

interface TransitChartProps {
  planet1: {
    name: string;
    longitude: number;
    icon: string;
    sign?: string;
    degree?: number;
  };
  planet2: {
    name: string;
    longitude: number;
    icon: string;
    sign?: string;
    degree?: number;
  };
  aspect: {
    type: string;
    angle: number;
  };
  size?: number;
  variant?: "dark" | "light";
}

const TransitChart = ({
  planet1,
  planet2,
  aspect,
  size = 400,
  variant = "dark",
}: TransitChartProps) => {
  const center = size / 2;
  const outerRadius = size * 0.4;
  const innerRadius = size * 0.35;
  const planetRadius = size * 0.3;
  const numberRadius = size * 0.42;
  
  const isLight = variant === "light";
  const textColor = isLight ? "text-black" : "text-white";
  const textColorMuted = isLight ? "text-black/70" : "text-white/70";
  const textColorSubtle = isLight ? "text-black/50" : "text-white/50";
  const borderColor = isLight ? "border-black/10" : "border-white/10";
  const circleStroke = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.3)";
  const planetCircleStroke = isLight ? "rgba(0, 0, 0, 0.15)" : "rgba(255, 255, 255, 0.25)";
  const planetFill = isLight ? "white" : "white";
  const centerFill = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.1)";
  const centerStroke = isLight ? "rgba(0, 0, 0, 0.1)" : "rgba(255, 255, 255, 0.2)";

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
    <div className="w-full flex flex-col items-center py-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="mb-4">
        <circle
          cx={center}
          cy={center}
          r={outerRadius}
          fill="none"
          stroke={circleStroke}
          strokeWidth={1}
        />
        <circle
          cx={center}
          cy={center}
          r={planetRadius}
          fill="none"
          stroke={planetCircleStroke}
          strokeWidth={0.8}
        />

        {hasAspect && (
          <>
            <path
              d={`M ${p1.x} ${p1.y} Q ${controlX} ${controlY} ${p2.x} ${p2.y}`}
              fill="none"
              stroke={aspectColor}
              strokeWidth={aspectStyle.strokeWidth + 0.5}
              opacity={Math.min(aspectStyle.opacity + 0.2, 1)}
            />
          </>
        )}

        <g>
          <circle
            cx={p1.x}
            cy={p1.y}
            r={12}
            fill={planetFill}
            stroke={isLight ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)"}
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
            fill={planetFill}
            stroke={isLight ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.5)"}
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
          r={size * 0.06}
          fill={centerFill}
          stroke={centerStroke}
          strokeWidth={0.8}
        />
      </svg>
      
      <div className={`text-center space-y-3 mt-2 max-w-md ${textColor}`}>
        <div className={`${textColor} text-base font-light tracking-wide`}>
          {planet1.name} {hasAspect ? aspect.type.toLowerCase() : "&"} {planet2.name}
        </div>
        <div className="space-y-1">
          {planet1.sign && (
            <div className={`${textColorMuted} text-xs font-light`}>
              {planet1.name} in {planet1.sign} {planet1.degree !== undefined ? `${planet1.degree.toFixed(1)}°` : ''}
            </div>
          )}
          {planet2.sign && (
            <div className={`${textColorMuted} text-xs font-light`}>
              {planet2.name} in {planet2.sign} {planet2.degree !== undefined ? `${planet2.degree.toFixed(1)}°` : ''}
            </div>
          )}
        </div>
        {hasAspect && (
          <div className={`${textColorSubtle} text-xs font-light uppercase tracking-wider pt-1 ${borderColor} border-t`}>
            {aspect.angle.toFixed(1)}° aspect
          </div>
        )}
      </div>
    </div>
  );
};

export default TransitChart;
