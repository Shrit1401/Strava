"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Button from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import Loader from "@/components/Loader";
import type { ChartData } from "@/types/chart";
import { getRandomIcon } from "@/utils/astrology";

type NewYearData = {
  word: string;
  contentBlocks: string[];
  yearDescription: string;
  goodThings: string[];
  badThings: string[];
};

const NewYearPage = () => {
  const [userName, setUserName] = useState("");
  const [sunSign, setSunSign] = useState("");
  const [moonSign, setMoonSign] = useState("");
  const [ascendantSign, setAscendantSign] = useState("");
  const [loading, setLoading] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [newYearData, setNewYearData] = useState<NewYearData | null>(null);
  const [resultLoading, setResultLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user) {
          const name =
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "";
          setUserName(name);
        }

        const chartResponse = await fetch("/api/natal-chart");

        if (chartResponse.ok) {
          const chartResult = await chartResponse.json();
          const chart: ChartData = chartResult.chart;

          if (chart.planets?.sun) {
            setSunSign(chart.planets.sun.sign);
          }
          if (chart.planets?.moon) {
            setMoonSign(chart.planets.moon.sign);
          }
          if (chart.ascendant) {
            setAscendantSign(chart.ascendant.sign);
          }
        }
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStart = async () => {
    setResultLoading(true);
    setShowResult(true);

    try {
      const response = await fetch("/api/new-year");
      if (response.ok) {
        const data = await response.json();
        setNewYearData(data);
      } else {
        setNewYearData({
          word: "Explorer",
          contentBlocks: [
            `Alright ${
              userName || "there"
            }, let me tell you what I see coming for you in 2026. It's going to be a year where you finally start moving in directions you've been avoiding.`,
            `Your heart is going to feel things deeply this year - like, really deeply. There are going to be moments where you're going to wonder if you can handle it, but you can.`,
            `Here's what I think is going to happen: you're going to make some decisions that scare you, but they're the right ones. That's going to be uncomfortable at first, but it's also going to be exactly what you need.`,
          ],
          yearDescription: `Look, ${
            userName || "there"
          }, 2026 is going to be wild for you. It's going to be messy and beautiful and hard and exactly what you need.`,
          goodThings: [
            "You'll finally have that breakthrough moment you've been waiting for",
            "Someone important is going to see you in a way you've always wanted to be seen",
            "You'll make a decision that changes everything for the better",
          ],
          badThings: [
            "You're going to have to let go of something you've been holding onto too tightly",
            "There's going to be a moment where you realize you've been lying to yourself about something",
            "You'll have to face a truth you've been avoiding",
          ],
        });
      }
    } catch (error) {
      console.error("Failed to fetch prediction:", error);
      setNewYearData({
        word: "Explorer",
        contentBlocks: [
          `Alright ${
            userName || "there"
          }, let me tell you what I see coming for you in 2026. It's going to be a year where you finally start moving in directions you've been avoiding.`,
          `Your heart is going to feel things deeply this year - like, really deeply. There are going to be moments where you're going to wonder if you can handle it, but you can.`,
          `Here's what I think is going to happen: you're going to make some decisions that scare you, but they're the right ones. That's going to be uncomfortable at first, but it's also going to be exactly what you need.`,
        ],
        yearDescription: `Look, ${
          userName || "there"
        }, 2026 is going to be wild for you. It's going to be messy and beautiful and hard and exactly what you need.`,
        goodThings: [
          "You'll finally have that breakthrough moment you've been waiting for",
          "Someone important is going to see you in a way you've always wanted to be seen",
          "You'll make a decision that changes everything for the better",
        ],
        badThings: [
          "You're going to have to let go of something you've been holding onto too tightly",
          "There's going to be a moment where you realize you've been lying to yourself about something",
          "You'll have to face a truth you've been avoiding",
        ],
      });
    } finally {
      setResultLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] flex flex-col">
      {!showResult ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
          <h1 className="cormorant  text-4xl md:text-5xl lg:text-6xl text-black text-center mb-6 tracking-tight">
            Let's See What 2026 Holds For You
          </h1>

          <p className="text-sm md:text-base text-[#575657] text-center mb-12">
            {userName || "User"} | ☉ {sunSign || "..."} ☽ {moonSign || "..."} ↑{" "}
            {ascendantSign || "..."}
          </p>

          <Button
            text="LET'S START"
            variant="primary"
            size="large"
            className="font-mono"
            onClick={handleStart}
          />
        </div>
      ) : resultLoading ? (
        <Loader />
      ) : (
        <div className="flex-1 flex flex-col px-6 md:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto w-full space-y-12">
            <div className="text-center mb-12">
              <h1 className="cormorant text-4xl md:text-5xl lg:text-6xl text-black text-center mb-6 tracking-tight">
                Let's See What 2026 Holds For You
              </h1>

              <p className="text-sm md:text-base text-[#575657] text-center">
                {userName || "User"} | ☉ {sunSign || "..."} ☽{" "}
                {moonSign || "..."} ↑ {ascendantSign || "..."}
              </p>
            </div>

            {newYearData?.contentBlocks?.map((block, index) => (
              <p
                key={index}
                className="text-sm md:text-base text-[#575657] leading-relaxed"
              >
                {block}
              </p>
            ))}

            <div className="pt-8 text-center">
              <p className="cormorant text-xl md:text-2xl lg:text-3xl text-black mb-2 tracking-tight">
                Stars Are Telling In Next Year You'll Be
              </p>
              <p className="cormorant text-4xl md:text-5xl lg:text-6xl font-bold text-black tracking-tight">
                {newYearData?.word || "Explorer"}
              </p>
            </div>

            {newYearData?.yearDescription && (
              <p className="text-sm md:text-base text-[#575657] leading-relaxed pt-4 text-center">
                {newYearData.yearDescription}
              </p>
            )}

            <div className="space-y-24 pt-20">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_120px] gap-8 items-start">
                <div className="space-y-2">
                  <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                    The Good
                  </p>
                  <div className="border-t border-black/5 pt-6">
                    <h3 className="cormorant text-3xl font-light text-black mb-6">
                      Good Things Which Will Happen With You
                    </h3>
                    {newYearData?.goodThings &&
                    newYearData.goodThings.length > 0 ? (
                      <ul className="space-y-4">
                        {newYearData.goodThings.map((thing, index) => (
                          <li
                            key={index}
                            className="text-base text-black/70 leading-relaxed"
                          >
                            {thing}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-black/70 leading-relaxed">
                        Loading...
                      </p>
                    )}
                  </div>
                </div>
                <div className="hidden md:block shrink-0 text-md">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={getRandomIcon()}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-[120px_1fr] gap-8 items-start">
                <div className="hidden md:block shrink-0 text-md order-2 md:order-1">
                  <div className="w-full aspect-square relative">
                    <Image
                      src={getRandomIcon()}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="space-y-2 order-1 md:order-2">
                  <p className="text-xs font-normal uppercase tracking-[0.15em] text-black/50">
                    The Real
                  </p>
                  <div className="border-t border-black/5 pt-6">
                    <h3 className="cormorant text-3xl font-light text-black mb-6">
                      Bad Things Which Will Happen With You
                    </h3>
                    {newYearData?.badThings &&
                    newYearData.badThings.length > 0 ? (
                      <ul className="space-y-4">
                        {newYearData.badThings.map((thing, index) => (
                          <li
                            key={index}
                            className="text-base text-black/70 leading-relaxed"
                          >
                            {thing}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-base text-black/70 leading-relaxed">
                        Loading...
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewYearPage;
