"use client";

import React from "react";
import { ChartData, ZodiacPosition } from "@/types/chart";
import PlanetPrediction from "./PlanetPrediction";

type PredictionsProps = {
  chart: ChartData;
};

const PLANET_ORDER = [
  "sun",
  "ascendant",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
];

const Predictions = ({ chart }: PredictionsProps) => {
  const planetHouses = chart.planetHouses || {};

  const getPlanetData = (
    planetName: string
  ): { position: ZodiacPosition; house: number } | null => {
    if (planetName === "ascendant") {
      if (!chart.ascendant) return null;
      return {
        position: chart.ascendant,
        house: 1,
      };
    }

    const position = chart.planets[planetName];
    if (!position) return null;

    const house = planetHouses[planetName] || 1;
    return { position, house };
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-12">
      {PLANET_ORDER.map((planetName) => {
        const planetData = getPlanetData(planetName);
        if (!planetData) return null;

        return (
          <PlanetPrediction
            key={planetName}
            planetName={planetName}
            position={planetData.position}
            house={planetData.house}
          />
        );
      })}
    </div>
  );
};

export default Predictions;
