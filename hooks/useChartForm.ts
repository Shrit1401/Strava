import { useState } from "react";
import { ChartData } from "@/types/chart";

type BirthData = {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
};

const DEFAULT_BIRTH_DATA: BirthData = {
  date: "2008-01-14",
  time: "11:00",
  latitude: 28.7041,
  longitude: 77.1025,
};

export const useChartForm = () => {
  const [birthData, setBirthData] = useState<BirthData>(DEFAULT_BIRTH_DATA);
  const [chart, setChart] = useState<ChartData | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateBirthData = (updates: Partial<BirthData>) => {
    setBirthData((prev) => ({ ...prev, ...updates }));
  };

  const fetchChart = async () => {
    setSubmitted(false);
    setLoading(true);
    setError(null);

    try {
      const [year, month, day] = birthData.date.split("-").map(Number);
      const [hour, minute] = birthData.time.split(":").map(Number);

      const response = await fetch("/api/natal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          year,
          month,
          day,
          hour,
          minute,
          second: 0,
          timezone: "Asia/Kolkata",
          lat: birthData.latitude,
          lon: birthData.longitude,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data?.error || "Failed to generate chart");
      }

      const data = await response.json();
      setChart(data.chart as ChartData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return {
    birthData,
    chart,
    submitted,
    loading,
    error,
    updateBirthData,
    fetchChart,
  };
};

