"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const BottomNav = () => {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading || !user) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50">
      <div className="flex flex-col items-end pb-0">
        <div className="mb-6 mr-2">
          <Link
            href="/new-year"
            className="px-4 sm:px-6 py-2 sm:py-3 text-black bg-white uppercase font-mono text-[10px] sm:text-xs tracking-wide border border-[#333] transition-opacity hover:opacity-80 whitespace-nowrap"
            title="CLICK HERE TO KNOW ABOUT 2026! →"
          >
            <span className="hidden sm:inline">
              CLICK HERE TO KNOW ABOUT 2026! →
            </span>
            <span className="sm:hidden">2026 →</span>
          </Link>
        </div>
        <nav className="flex items-center gap-0 justify-center bg-black w-full py-2">
          <Link
            href="/dashboard"
            className={`px-4 sm:px-8 py-2 sm:py-4 text-white uppercase font-mono text-xs sm:text-sm tracking-wide transition-opacity ${
              pathname === "/dashboard"
                ? "opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            HOME
          </Link>
          <Link
            href="/ask"
            className={`px-4 sm:px-8 py-2 sm:py-4 text-white uppercase font-mono text-xs sm:text-sm tracking-wide transition-opacity ${
              pathname === "/ask"
                ? "opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            ASK
          </Link>
          <Link
            href="/you"
            className={`px-4 sm:px-8 py-2 sm:py-4 text-white uppercase font-mono text-xs sm:text-sm tracking-wide transition-opacity ${
              pathname === "/you"
                ? "opacity-100"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            YOU
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default BottomNav;
