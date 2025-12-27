"use client";

import React from "react";
import NatalChart from "@/components/NatalChart";
import Predictions from "@/components/Predictions";
import BirthDataForm from "@/components/BirthDataForm";
import { useChartForm } from "@/hooks/useChartForm";

const AstrologyPage = () => {
  const {
    birthData,
    chart,
    submitted,
    loading,
    error,
    updateBirthData,
    fetchChart,
  } = useChartForm();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchChart();
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-[#111827]">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-12">
          <section className="flex-1 max-w-xl">
            <header className="mb-10">
              <div className="text-xs tracking-[0.25em] uppercase text-gray-500 mb-3 cormorant">
                Natal chart
              </div>
              <h1 className="text-3xl lg:text-4xl font-light mb-4 cormorant">
                Make your own chart.
              </h1>
            </header>

            <BirthDataForm
              birthData={birthData}
              loading={loading}
              error={error}
              onUpdate={updateBirthData}
              onSubmit={handleSubmit}
            />
          </section>

          <section className="flex-1 flex justify-center lg:justify-end">
            {submitted && !loading && chart && <NatalChart chart={chart} />}
          </section>
        </div>

        {submitted && !loading && chart?.interpretations && (
          <Predictions interpretations={chart.interpretations} />
        )}
      </div>
    </div>
  );
};

export default AstrologyPage;
