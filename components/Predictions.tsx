"use client";

import React from "react";
import { ChartInterpretation } from "@/types/chart";
import PredictionSection from "./PredictionSection";

type PredictionsProps = {
  interpretations: ChartInterpretation;
};

const PREDICTION_SECTIONS = [
  {
    key: "corePersonality" as const,
    title: "Core Personality",
    color: "text-gray-900",
    bgColor: "bg-gray-50",
  },
  {
    key: "career" as const,
    title: "Career & Direction",
    color: "text-blue-900",
    bgColor: "bg-blue-50",
  },
  {
    key: "relationships" as const,
    title: "Relationships",
    color: "text-pink-900",
    bgColor: "bg-pink-50",
  },
  {
    key: "strengths" as const,
    title: "Strengths",
    color: "text-green-900",
    bgColor: "bg-green-50",
  },
  {
    key: "challenges" as const,
    title: "Challenges",
    color: "text-orange-900",
    bgColor: "bg-orange-50",
  },
] as const;

const Predictions = ({ interpretations }: PredictionsProps) => {
  return (
    <div className="w-full max-w-4xl mx-auto mt-12 space-y-8">
      <header className="mb-8">
        <div className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3 cormorant">
          Chart Predictions
        </div>
        <h2 className="text-2xl lg:text-3xl font-light cormorant">
          Your Astrological Profile
        </h2>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PREDICTION_SECTIONS.map((section) => (
          <PredictionSection
            key={section.key}
            title={section.title}
            items={interpretations[section.key]}
            color={section.color}
            bgColor={section.bgColor}
          />
        ))}
      </div>
    </div>
  );
};

export default Predictions;
