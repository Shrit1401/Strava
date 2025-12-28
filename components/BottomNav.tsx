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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-black flex justify-center items-center gap-0 py-0">
      <Link
        href="/dashboard"
        className={`px-8 py-4 text-white uppercase font-mono text-sm tracking-wide transition-opacity ${
          pathname === "/dashboard"
            ? "opacity-100"
            : "opacity-70 hover:opacity-100"
        }`}
      >
        HOME
      </Link>
      <Link
        href="/ask"
        className={`px-8 py-4 text-white uppercase font-mono text-sm tracking-wide transition-opacity ${
          pathname === "/ask" ? "opacity-100" : "opacity-70 hover:opacity-100"
        }`}
      >
        ASK
      </Link>
      <Link
        href="/you"
        className={`px-8 py-4 text-white uppercase font-mono text-sm tracking-wide transition-opacity ${
          pathname === "/you" ? "opacity-100" : "opacity-70 hover:opacity-100"
        }`}
      >
        YOU
      </Link>
    </nav>
  );
};

export default BottomNav;
