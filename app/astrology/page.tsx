"use client";
import React, { useState } from "react";
import NatalChart, { ChartData } from "@/components/NatalChart";

const AstrologyPage = () => {
  const [birthDate, setBirthDate] = useState("2008-01-14");
  const [birthTime, setBirthTime] = useState("11:00");
  const [latitude, setLatitude] = useState(28.7041);
  const [longitude, setLongitude] = useState(77.1025);

  const [chart, setChart] = useState<ChartData | null>(null);

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(false);
    setLoading(true);
    setError(null);
    try {
      const [year, month, day] = birthDate.split("-").map(Number);
      const [hour, minute] = birthTime.split(":").map(Number);
      const res = await fetch("/api/natal", {
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
          lat: latitude,
          lon: longitude,
        }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data?.error || "Submission failed");
      }
      const data = await res.json();
      setChart(data.chart as ChartData);
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <div className="flex-1 max-w-xl">
            <div className="mb-10">
              <div className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3 cormorant">
                Natal chart
              </div>
              <h1 className="text-3xl lg:text-4xl font-light mb-4 cormorant">
                Make your own chart.
              </h1>
            </div>
            <form
              className="space-y-6 text-sm leading-relaxed"
              onSubmit={handleSubmit}
            >
              <p className="text-gray-800">
                I was born on{" "}
                <input
                  id="birth-date"
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  required
                  disabled={loading}
                  className="border-b border-black bg-transparent px-1 pb-0.5 text-sm focus:outline-none focus:border-black"
                />{" "}
                at{" "}
                <input
                  id="birth-time"
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  required
                  disabled={loading}
                  className="border-b border-black bg-transparent px-1 pb-0.5 text-sm focus:outline-none focus:border-black"
                />
                .
              </p>
              <p className="text-gray-800">
                My coordinates are{" "}
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-gray-500 text-xs uppercase tracking-[0.18em]">
                    Lat
                  </span>
                  <input
                    id="latitude"
                    type="number"
                    value={latitude}
                    onChange={(e) => setLatitude(Number(e.target.value))}
                    required
                    disabled={loading}
                    step="any"
                    className="w-24 border-b border-black bg-transparent px-1 pb-0.5 text-sm focus:outline-none focus:border-black"
                  />
                </span>{" "}
                and{" "}
                <span className="inline-flex items-baseline gap-1">
                  <span className="text-gray-500 text-xs uppercase tracking-[0.18em]">
                    Lon
                  </span>
                  <input
                    id="longitude"
                    type="number"
                    value={longitude}
                    onChange={(e) => setLongitude(Number(e.target.value))}
                    required
                    disabled={loading}
                    step="any"
                    className="w-24 border-b border-black bg-transparent px-1 pb-0.5 text-sm focus:outline-none focus:border-black"
                  />
                </span>
                .
              </p>

              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`px-8 py-3 cursor-pointer text-xs tracking-[0.2em] uppercase border border-black bg-black text-white hover:bg-white hover:text-black transition-colors ${
                    loading ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  {loading ? "Calculating..." : "Get your chart"}
                </button>
              </div>

              {error && (
                <div className="text-xs text-red-600 pt-2">{error}</div>
              )}
            </form>
          </div>

          <div className="flex-1 flex justify-center lg:justify-end">
            <div>
              {submitted && !loading && chart && <NatalChart chart={chart} />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AstrologyPage;
