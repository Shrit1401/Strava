"use client";

import React from "react";
import Image from "next/image";
import { ZodiacPosition } from "@/types/chart";
import {
  formatDegrees,
  getHouseName,
  getPlanetInterpretation,
} from "@/utils/astrology";

type PlanetPredictionProps = {
  planetName: string;
  position: ZodiacPosition;
  house: number;
};

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

const PlanetPrediction = ({
  planetName,
  position,
  house,
}: PlanetPredictionProps) => {
  const displayName = planetName.toUpperCase();
  const iconPath = PLANET_ICONS[planetName] || "/planets/sun.svg";
  const formattedDegrees = formatDegrees(position.degreeInsideSign);
  const houseName = getHouseName(house);
  const interpretation = getPlanetInterpretation(
    planetName,
    position.sign,
    house
  );

  return (
    <div className="mb-12">
      <div className="mb-4">
        <Image src={iconPath} alt={planetName} width={12} height={12} />
      </div>
      <h3 className=" font-medium uppercase">{displayName}</h3>
      <div className="text-[10px] text-gray-700 mb-4">
        <div className="uppercase">
          {position.sign}, {formattedDegrees}
        </div>
        <div className="uppercase">{houseName}</div>
      </div>
      <p className="text-sm leading-relaxed text-gray-900">{interpretation}</p>
    </div>
  );
};

export default PlanetPrediction;
