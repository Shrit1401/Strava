"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  createdAt: string;
  sunSign: string;
  moonSign: string;
  ascendantSign: string;
  newYearData: NewYearData | null;
};

type Stats = {
  totalUsers: number;
  usersThisMonth: number;
  usersThisWeek: number;
  usersWithNewYearCount: number;
};

const AdminPage = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/admin/users?password=1401`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
        setStats(data.stats);
      } else {
        setError("Failed to fetch data");
      }
    } catch (err) {
      setError("Failed to fetch data");
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
  }, [isAuthenticated]);

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

  return (
    <div className="min-h-screen bg-[#f7f7f7] py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-20 h-20 relative">
              <Image
                src={getRandomIcon()}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h1 className="cormorant text-4xl md:text-5xl lg:text-6xl text-black tracking-tight">
              Admin Dashboard
            </h1>
            <div className="w-20 h-20 relative">
              <Image
                src={getRandomIcon()}
                alt=""
                fill
                className="object-contain"
              />
            </div>
          </div>
          <p className="text-sm text-[#575657]">
            {new Date().toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className="bg-white p-6 border border-black/5">
              <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                Total Users
              </p>
              <p className="cormorant text-3xl text-black">
                {stats.totalUsers}
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5">
              <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                This Month
              </p>
              <p className="cormorant text-3xl text-black">
                {stats.usersThisMonth}
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5">
              <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                This Week
              </p>
              <p className="cormorant text-3xl text-black">
                {stats.usersThisWeek}
              </p>
            </div>
            <div className="bg-white p-6 border border-black/5">
              <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                With Predictions
              </p>
              <p className="cormorant text-3xl text-black">
                {stats.usersWithNewYearCount}
              </p>
            </div>
          </div>
        )}

        <div className="bg-white p-8 border border-black/5 mb-12">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 relative shrink-0">
              <Image
                src={getRandomIcon()}
                alt=""
                fill
                className="object-contain"
              />
            </div>
            <h2 className="cormorant text-3xl text-black">Growth Strategy</h2>
          </div>
          <div className="space-y-6 text-sm text-[#575657] leading-relaxed">
            <div>
              <h3 className="cormorant text-xl text-black mb-3">
                Content & Social Media
              </h3>
              <ul className="space-y-2 ml-4 list-disc">
                <li>
                  Share personalized new year predictions on social media with
                  user testimonials
                </li>
                <li>
                  Create TikTok/Instagram Reels showing quick astrology insights
                </li>
                <li>
                  Post daily astrology tips and moon phase updates to build
                  engagement
                </li>
                <li>
                  Collaborate with astrology influencers for cross-promotion
                </li>
              </ul>
            </div>
            <div>
              <h3 className="cormorant text-xl text-black mb-3">
                Product Features
              </h3>
              <ul className="space-y-2 ml-4 list-disc">
                <li>
                  Add referral program - users get premium features for
                  referring friends
                </li>
                <li>
                  Implement sharing functionality for predictions and insights
                </li>
                <li>
                  Create email reminders for daily insights to increase
                  retention
                </li>
                <li>
                  Add community features - let users compare charts with friends
                </li>
              </ul>
            </div>
            <div>
              <h3 className="cormorant text-xl text-black mb-3">
                SEO & Discovery
              </h3>
              <ul className="space-y-2 ml-4 list-disc">
                <li>
                  Optimize for "astrology predictions 2026" and similar search
                  terms
                </li>
                <li>
                  Create blog posts about astrology topics to drive organic
                  traffic
                </li>
                <li>Add structured data markup for better search visibility</li>
                <li>
                  Target long-tail keywords like "personalized astrology reading
                  online"
                </li>
              </ul>
            </div>
            <div>
              <h3 className="cormorant text-xl text-black mb-3">
                User Experience
              </h3>
              <ul className="space-y-2 ml-4 list-disc">
                <li>
                  Simplify onboarding - reduce steps to get first prediction
                </li>
                <li>Add preview of what users will get before signup</li>
                <li>Create mobile app for better accessibility</li>
                <li>
                  Implement push notifications for important astrological events
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div>
          <h2 className="cormorant text-3xl text-black mb-6">
            All Users & New Year Predictions
          </h2>
          <div className="space-y-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="bg-white p-6 border border-black/5 space-y-4 hover:border-black/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-4 border-b border-black/5">
                  <div className="flex gap-4 flex-1">
                    <div className="w-16 h-16 relative shrink-0 hidden md:block">
                      <Image
                        src={getRandomIcon()}
                        alt=""
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="cormorant text-xl text-black mb-1">
                        {user.name || "Anonymous"}
                      </p>
                      <p className="text-xs text-[#575657]">{user.email}</p>
                      <p className="text-xs text-black/50 mt-1">
                        Joined:{" "}
                        {new Date(user.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-sm text-[#575657]">
                      <p>
                        ☉ {user.sunSign} ☽ {user.moonSign} ↑{" "}
                        {user.ascendantSign}
                      </p>
                    </div>
                    <button
                      onClick={() => router.push(`/admin/${user.id}`)}
                      className="px-4 py-2 bg-black text-white text-xs font-mono uppercase tracking-wider hover:bg-black/90 transition-colors shrink-0"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                {user.newYearData ? (
                  <div className="space-y-4 pt-4">
                    <div className="text-center py-4 border-y border-black/5">
                      <p className="text-xs uppercase tracking-wider text-black/50 mb-2">
                        Their 2026 Word
                      </p>
                      <p className="cormorant text-3xl font-bold text-black">
                        {user.newYearData.word}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs uppercase tracking-wider text-black/50 mb-3">
                          Good Things
                        </p>
                        <ul className="space-y-2">
                          {user.newYearData.goodThings.map((thing, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-[#575657] leading-relaxed"
                            >
                              • {thing}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wider text-black/50 mb-3">
                          Challenges
                        </p>
                        <ul className="space-y-2">
                          {user.newYearData.badThings.map((thing, idx) => (
                            <li
                              key={idx}
                              className="text-sm text-[#575657] leading-relaxed"
                            >
                              • {thing}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {user.newYearData.yearDescription && (
                      <div className="pt-4 border-t border-black/5">
                        <p className="text-sm text-[#575657] leading-relaxed">
                          {user.newYearData.yearDescription}
                        </p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="pt-4">
                    <p className="text-sm text-black/50 italic">
                      No new year prediction generated yet
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
