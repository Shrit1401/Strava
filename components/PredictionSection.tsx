"use client";

import React from "react";

type PredictionSectionProps = {
  title: string;
  items: string[];
  color: string;
  bgColor: string;
};

const PredictionSection = ({
  title,
  items,
  color,
  bgColor,
}: PredictionSectionProps) => {
  if (items.length === 0) return null;

  return (
    <div
      className={`${bgColor} rounded-lg p-6 border border-gray-200 transition-shadow hover:shadow-md`}
    >
      <h3 className={`${color} text-lg font-medium mb-4 cormorant`}>
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item, index) => (
          <li
            key={index}
            className="text-sm text-gray-700 leading-relaxed pl-4 relative before:content-['•'] before:absolute before:left-0 before:text-gray-400"
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PredictionSection;

