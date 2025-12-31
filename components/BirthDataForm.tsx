"use client";

import React, { useEffect, useRef } from "react";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";

type BirthData = {
  date: string;
  time: string;
  latitude: number;
  longitude: number;
  location?: string;
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
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const geocoderInstanceRef = useRef<GeocoderAutocomplete | null>(null);
  const onUpdateRef = useRef(onUpdate);

  useEffect(() => {
    onUpdateRef.current = onUpdate;
  }, [onUpdate]);

  useEffect(() => {
    if (!autocompleteRef.current || geocoderInstanceRef.current) return;

    if (autocompleteRef.current.innerHTML.trim() !== "") {
      autocompleteRef.current.innerHTML = "";
    }

    const apiKey = process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY || "";

    if (!apiKey) {
      console.warn(
        "Geoapify API key not found. Please set NEXT_PUBLIC_GEOAPIFY_API_KEY"
      );
      return;
    }

    const autocomplete = new GeocoderAutocomplete(
      autocompleteRef.current,
      apiKey,
      {
        placeholder: "Enter your birth place",
        lang: "en",
        limit: 5,
        skipIcons: false,
        skipDetails: false,
      }
    );

    geocoderInstanceRef.current = autocomplete;

    autocomplete.on("select", (feature) => {
      if (feature) {
        const properties = feature.properties;
        const address = properties.formatted || properties.name || "";
        const coordinates = feature.geometry?.coordinates;

        onUpdateRef.current({ location: address });

        if (coordinates && coordinates.length >= 2) {
          onUpdateRef.current({
            longitude: coordinates[0],
            latitude: coordinates[1],
          });
        }
      }
    });

    return () => {
      if (geocoderInstanceRef.current) {
        if (autocompleteRef.current) {
          autocompleteRef.current.innerHTML = "";
        }
        geocoderInstanceRef.current = null;
      }
    };
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!birthData.latitude || !birthData.longitude) {
      return;
    }
    onSubmit(e);
  };

  const isFormValid =
    birthData.date &&
    birthData.time &&
    birthData.latitude &&
    birthData.longitude;

  return (
    <form className="space-y-6 text-sm leading-relaxed" onSubmit={handleSubmit}>
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
        My birth place is{" "}
        <span className="inline-block w-full max-w-md">
          <div
            ref={autocompleteRef}
            className="w-full geoapify-autocomplete-wrapper geoapify-light-theme"
            style={{ position: "relative" }}
          />
        </span>
        .
      </p>

      {!birthData.latitude || !birthData.longitude ? (
        <p className="text-xs text-gray-500">
          Please select a valid birth place from the suggestions
        </p>
      ) : null}

      <div className="pt-4">
        <button
          type="submit"
          disabled={loading || !isFormValid}
          className={`px-8 py-3 cursor-pointer text-xs tracking-[0.2em] uppercase border border-black bg-black text-white hover:bg-white hover:text-black transition-colors ${
            loading || !isFormValid ? "opacity-60 cursor-not-allowed" : ""
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
