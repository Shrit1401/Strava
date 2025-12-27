"use client";

import React from "react";

type BirthData = {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
};

type BirthDataFormProps = {
  birthData: BirthData;
  loading: boolean;
  error: string | null;
  onUpdate: (updates: Partial<BirthData>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
};

const BirthDataForm = ({
  birthData,
  loading,
  error,
  onUpdate,
  onSubmit,
}: BirthDataFormProps) => {
  return (
    <form className="space-y-6 text-sm leading-relaxed" onSubmit={onSubmit}>
      <p className="text-gray-800">
        I was born on{" "}
        <input
          id="birth-date"
          type="date"
          value={birthData.date}
          onChange={(e) => onUpdate({ date: e.target.value })}
          required
          disabled={loading}
          className="border-b border-black bg-transparent px-1 pb-0.5 text-sm focus:outline-none focus:border-black"
        />{" "}
        at{" "}
        <input
          id="birth-time"
          type="time"
          value={birthData.time}
          onChange={(e) => onUpdate({ time: e.target.value })}
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
            value={birthData.latitude}
            onChange={(e) => onUpdate({ latitude: Number(e.target.value) })}
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
            value={birthData.longitude}
            onChange={(e) => onUpdate({ longitude: Number(e.target.value) })}
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
        <div className="text-xs text-red-600 pt-2" role="alert">
          {error}
        </div>
      )}
    </form>
  );
};

export default BirthDataForm;

