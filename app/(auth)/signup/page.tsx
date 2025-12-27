"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/Button";
import { GeocoderAutocomplete } from "@geoapify/geocoder-autocomplete";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
] as const;

const TOTAL_STEPS = 3;

type FormData = {
  birthPlace: string;
  birthDay: string;
  birthMonth: string;
  birthYear: string;
  birthTime: string;
  latitude?: number;
  longitude?: number;
};

const INITIAL_FORM_DATA: FormData = {
  birthPlace: "Delhi, India",
  birthDay: "11",
  birthMonth: "January",
  birthYear: "2001",
  birthTime: "11:00 AM",
};

const INPUT_STYLES =
  "px-4 py-3 bg-transparent border border-white/30 text-white placeholder-white/50 focus:outline-none focus:border-white transition-colors";

const BUTTON_STYLES = "!bg-white !text-black !border-white hover:!bg-white/90";

type WelcomeStepProps = {
  onNext: () => void;
};

const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center justify-between text-center h-[50vh] space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="cormorant text-4xl md:text-5xl mb-4 text-white">
          Fall in the Stars
        </h1>
        <p className="text-white/80 max-w-lg">
          we're gonna ask some questions from you, answer it correctly we are
          gonna ask from stars who you are...
        </p>
      </div>
      <Button
        text="LETS GO"
        variant="primary"
        size="medium"
        onClick={onNext}
        className={`${BUTTON_STYLES} mt-8`}
      />
    </div>
  );
};

type BirthInfoStepProps = {
  formData: FormData;
  onInputChange: (field: keyof FormData, value: string | number) => void;
  onNext: () => void;
};

const BirthInfoStep = ({
  formData,
  onInputChange,
  onNext,
}: BirthInfoStepProps) => {
  const autocompleteRef = useRef<HTMLDivElement>(null);
  const geocoderInstanceRef = useRef<GeocoderAutocomplete | null>(null);
  const onInputChangeRef = useRef(onInputChange);

  useEffect(() => {
    onInputChangeRef.current = onInputChange;
  }, [onInputChange]);

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

        onInputChangeRef.current("birthPlace", address);

        if (coordinates && coordinates.length >= 2) {
          onInputChangeRef.current("longitude", coordinates[0]);
          onInputChangeRef.current("latitude", coordinates[1]);
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

  return (
    <div className="flex flex-col space-y-12 max-w-2xl mx-auto w-full">
      <div className="space-y-4 text-center ">
        <h2 className="cormorant text-3xl md:text-4xl  text-white">
          Your Birth Place
        </h2>
        <div
          ref={autocompleteRef}
          className="w-full geoapify-autocomplete-wrapper"
          style={{ position: "relative" }}
        />
      </div>

      <div className="space-y-4 text-center">
        <h2 className="cormorant text-3xl md:text-4xl  text-white">
          Your Birth Date & Time
        </h2>
        <div className="flex gap-3">
          <input
            type="text"
            value={formData.birthDay}
            onChange={(e) => onInputChange("birthDay", e.target.value)}
            className={`w-24 ${INPUT_STYLES}`}
            placeholder="Day"
          />
          <select
            value={formData.birthMonth}
            onChange={(e) => onInputChange("birthMonth", e.target.value)}
            className={`flex-1 ${INPUT_STYLES}`}
          >
            {MONTHS.map((month) => (
              <option key={month} value={month} className="bg-[#111]">
                {month}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={formData.birthYear}
            onChange={(e) => onInputChange("birthYear", e.target.value)}
            className={`w-32 ${INPUT_STYLES}`}
            placeholder="Year"
          />
        </div>
        <input
          type="time"
          value={formData.birthTime}
          onChange={(e) => onInputChange("birthTime", e.target.value)}
          className={`w-full ${INPUT_STYLES}`}
        />
      </div>

      <div className="flex justify-center pt-4">
        <Button
          text="NEXT"
          variant="primary"
          size="medium"
          onClick={onNext}
          className={BUTTON_STYLES}
        />
      </div>
    </div>
  );
};

type ResultsStepProps = {
  traits?: string;
};

const ResultsStep = ({
  traits = "Ambitious, Cool, Calm",
}: ResultsStepProps) => {
  return (
    <div className="flex flex-col items-center justify-between h-[50vh] text-center space-y-12 max-w-2xl mx-auto">
      <div className="space-y-2">
        <h2 className=" text-2xl md:text-3xl font-bold text-white/50">
          Stars Tell me You're
        </h2>
        <p className=" cormorant text-3xl md:text-4xl  text-white">{traits}</p>
      </div>
      <div className="space-y-6 pt-8">
        <h2 className="cormorant text-3xl md:text-4xl text-white">
          Let's Dive Deeper
        </h2>
        <Button
          text="LOGIN W GOOGLE"
          variant="primary"
          size="medium"
          className={BUTTON_STYLES}
        />
      </div>
    </div>
  );
};

const SignUpPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <WelcomeStep onNext={handleNext} />;
      case 2:
        return (
          <BirthInfoStep
            formData={formData}
            onInputChange={handleInputChange}
            onNext={handleNext}
          />
        );
      case 3:
        return <ResultsStep />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen overflow-y-hidden">
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 md:p-16 relative">
        <div className="w-full">{renderCurrentStep()}</div>
      </div>

      <div className="hidden md:flex md:w-1/2 relative">
        <img
          src="/start.png"
          alt="Background illustration"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

export default SignUpPage;
