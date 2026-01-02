"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Loader from "@/components/Loader";
import { getRandomIcon } from "@/utils/astrology";

type NewYearData = {
  word: string;
  contentBlocks: string[];
  yearDescription: string;
  goodThings: string[];
  badThings: string[];
};

type User = {
  id: string;
  email: string;
  name: string | null;
  birthDate: string;
  birthTime: string;
  birthPlace: string;
  createdAt: string;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
};

type Activity = {
  totalGenerations: number;
  mostActiveType: string;
  activitySummary: Record<string, number>;
  recentActivity: Array<{
    type: string;
    date: string;
    hasContent: boolean;
  }>;
  daysSinceJoined: number;
  activityInsight: string;
};

const UserDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const userId = Array.isArray(params.userId)
    ? params.userId[0]
    : params.userId || "";
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [newYearData, setNewYearData] = useState<NewYearData | null>(null);
  const [activity, setActivity] = useState<Activity | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(
        `/api/admin/users/${userId}?password=1401`
      );
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setNewYearData(data.newYearData);
        setActivity(data.activity);
      } else {
        setError("Failed to fetch user data");
      }
    } catch (err) {
      setError("Failed to fetch user data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === "1401") {
      setIsAuthenticated(true);
    } else {
      setError("Incorrect password");
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, userId]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-6">
        <div className="max-w-md w-full">
          <h1 className="cormorant text-4xl md:text-5xl text-black text-center mb-8 tracking-tight">
            Admin Access
          </h1>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full px-4 py-3 border border-black/10 bg-white text-black placeholder:text-black/40 focus:outline-none focus:border-black/30 transition-colors"
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-600 text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full py-3 bg-black text-white hover:bg-black/90 transition-colors font-mono text-sm uppercase tracking-wider"
            >
              Enter
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] flex items-center justify-center px-6">
        <div className="text-center">
          <p className="cormorant text-2xl text-black mb-4">User not found</p>
          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-[#575657] hover:text-black underline"
          >
            Back to Admin
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatActivityType = (type: string) => {
    return type
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => router.push("/admin")}
            className="text-sm text-[#575657] hover:text-black underline"
          >
            ← Back to Admin
          </button>
        </div>

        <div className="bg-white p-8 border border-black/5">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-32 h-32 relative shrink-0">
              <Image
                src={getRandomIcon()}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="cormorant text-4xl md:text-5xl text-black mb-2 tracking-tight">
                  {user.name || "Anonymous User"}
                </h1>
                <p className="text-sm text-[#575657]">{user.email}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-1">
                    Joined
                  </p>
                  <p className="text-[#575657]">{formatDate(user.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-1">
                    Birth Place
                  </p>
                  <p className="text-[#575657]">{user.birthPlace}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wider text-black/50 mb-1">
                    Birth Date
                  </p>
                  <p className="text-[#575657]">{formatDate(user.birthDate)}</p>
                </div>
              </div>
              <div className="pt-4 border-t border-black/5">
                <p className="text-sm text-[#575657] mb-2">
                  ☉ {user.sunSign} ☽ {user.moonSign} ↑ {user.ascendantSign}
                </p>
              </div>
            </div>
          </div>
        </div>

        {activity && (
          <div className="bg-white p-8 border border-black/5">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 relative shrink-0">
                <Image
                  src={getRandomIcon()}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <div>
                <h2 className="cormorant text-3xl text-black mb-2">
                  Activity Analysis
                </h2>
                <p className="text-xs text-black/50">
                  {activity.daysSinceJoined} days on platform
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#f7f7f7] p-6">
                <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                  Total Generations
                </p>
                <p className="cormorant text-3xl text-black">
                  {activity.totalGenerations}
                </p>
              </div>
              <div className="bg-[#f7f7f7] p-6">
                <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                  Most Active
                </p>
                <p className="cormorant text-xl text-black">
                  {activity.mostActiveType
                    ? formatActivityType(activity.mostActiveType)
                    : "None"}
                </p>
              </div>
              <div className="bg-[#f7f7f7] p-6">
                <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                  Avg Per Day
                </p>
                <p className="cormorant text-3xl text-black">
                  {activity.daysSinceJoined > 0
                    ? (
                        activity.totalGenerations / activity.daysSinceJoined
                      ).toFixed(1)
                    : "0"}
                </p>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="cormorant text-xl text-black mb-4">
                Activity Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(activity.activitySummary).map(
                  ([type, count]) => (
                    <div
                      key={type}
                      className="bg-[#f7f7f7] p-4 text-center"
                    >
                      <p className="text-xs text-black/50 mb-1">
                        {formatActivityType(type)}
                      </p>
                      <p className="cormorant text-2xl text-black">{count}</p>
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="pt-6 border-t border-black/5">
              <h3 className="cormorant text-xl text-black mb-4">
                AI Insight
              </h3>
              <div className="prose max-w-none">
                <p className="text-sm text-[#575657] leading-relaxed whitespace-pre-line">
                  {activity.activityInsight}
                </p>
              </div>
            </div>
          </div>
        )}

        {newYearData ? (
          <div className="bg-white p-8 border border-black/5 space-y-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 relative shrink-0">
                <Image
                  src={getRandomIcon()}
                  alt=""
                  fill
                  className="object-contain"
                />
              </div>
              <h2 className="cormorant text-3xl text-black">
                2026 New Year Prediction
              </h2>
            </div>

            <div className="text-center py-8 border-y border-black/5">
              <p className="text-xs uppercase tracking-wider text-black/50 mb-4">
                Their 2026 Archetype
              </p>
              <p className="cormorant text-5xl md:text-6xl font-bold text-black tracking-tight">
                {newYearData.word}
              </p>
            </div>

            <div className="space-y-6">
              {newYearData.contentBlocks.map((block, index) => (
                <div key={index} className="flex gap-6">
                  <div className="w-12 h-12 relative shrink-0 hidden md:block">
                    <Image
                      src={getRandomIcon()}
                      alt=""
                      fill
                      className="object-contain opacity-50"
                    />
                  </div>
                  <p className="text-sm md:text-base text-[#575657] leading-relaxed flex-1">
                    {block}
                  </p>
                </div>
              ))}
            </div>

            {newYearData.yearDescription && (
              <div className="pt-6 border-t border-black/5">
                <p className="text-sm md:text-base text-[#575657] leading-relaxed text-center">
                  {newYearData.yearDescription}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 border-t border-black/5">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 relative shrink-0">
                    <Image
                      src={getRandomIcon()}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="cormorant text-2xl text-black">
                    Good Things
                  </h3>
                </div>
                <ul className="space-y-3">
                  {newYearData.goodThings.map((thing, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#575657] leading-relaxed flex gap-3"
                    >
                      <span className="text-black shrink-0">•</span>
                      <span>{thing}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 relative shrink-0">
                    <Image
                      src={getRandomIcon()}
                      alt=""
                      fill
                      className="object-contain"
                    />
                  </div>
                  <h3 className="cormorant text-2xl text-black">
                    Challenges
                  </h3>
                </div>
                <ul className="space-y-3">
                  {newYearData.badThings.map((thing, idx) => (
                    <li
                      key={idx}
                      className="text-sm text-[#575657] leading-relaxed flex gap-3"
                    >
                      <span className="text-black shrink-0">•</span>
                      <span>{thing}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 border border-black/5 text-center">
            <p className="text-sm text-black/50 italic">
              No new year prediction generated yet
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailPage;

