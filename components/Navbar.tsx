"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const navItems = [
  {
    label: "Masterhead",
    href: "/head",
  },
  {
    label: "Natal Chart",
    href: "/natal-chart",
  },
];

type NavbarProps = {
  isAsk?: boolean;
  isAuth?: boolean;
};

const Navbar = ({ isAuth, isAsk }: NavbarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLButtonElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const targetElement = event.target as HTMLElement;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        !hamburgerRef.current?.contains(target) &&
        !targetElement.closest("a") &&
        !targetElement.closest("button")
      ) {
        setDropdownOpen(false);
      }
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        !hamburgerRef.current?.contains(target) &&
        !targetElement.closest("a") &&
        !targetElement.closest("button")
      ) {
        setMobileMenuOpen(false);
      }
    };

    if (dropdownOpen || mobileMenuOpen) {
      setTimeout(() => {
        document.addEventListener("click", handleClickOutside);
      }, 0);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen, mobileMenuOpen]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.refresh();
  };

  const userName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split("@")[0] ||
    "User";

  return (
    <nav
      className={`w-full z-20 px-4 md:px-8 py-4 flex justify-between items-center ${
        isAuth || isAsk ? "fixed top-0 left-0 border-b border-black/10" : ""
      } ${isAuth || isAsk ? "bg-black text-white" : "bg-transparent"}`}
      style={{
        minHeight: 56,
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <h2
          className={`cormorant font-bold text-xl md:text-2xl tracking-tight ${
            isAuth || isAsk ? "text-white" : ""
          }`}
        >
          Strava
        </h2>
      </Link>

      <div className="hidden md:flex items-center gap-5">
        <ul className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? isAuth || isAsk
                      ? "text-white underline underline-offset-2"
                      : "text-black underline underline-offset-2"
                    : isAuth || isAsk
                    ? "text-white hover:text-white"
                    : "text-[#575657] hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        {!loading && (
          <div className="flex gap-2 items-center">
            {user ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className={`transition-colors cursor-pointer px-4 py-2 rounded-md font-normal text-sm flex items-center gap-2 ${
                    isAuth || isAsk
                      ? "text-white hover:bg-white/10"
                      : "text-[#575657] hover:text-black"
                  }`}
                >
                  {userName}
                  <svg
                    className={`w-4 h-4 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>
                {dropdownOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                      isAuth || isAsk
                        ? "bg-[#2a2a2a] border border-white/30"
                        : ""
                    }`}
                  >
                    <Link
                      href="/dashboard"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDropdownOpen(false);
                      }}
                      className={`block px-4 py-2 text-sm transition-colors cursor-pointer ${
                        isAuth || isAsk
                          ? "text-white hover:bg-white/10"
                          : "text-[#575657] hover:bg-gray-100"
                      }`}
                    >
                      Dashboard
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className={`block w-full text-left px-4 py-2 text-sm transition-colors ${
                        isAuth || isAsk
                          ? "text-white hover:bg-white/10"
                          : "text-[#575657] hover:bg-gray-100"
                      }`}
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Button
                  size="small"
                  text="Login"
                  variant="outline"
                  href="/login"
                  className={`font-normal ${
                    isAuth || isAsk
                      ? "text-white! border-white! hover:bg-white/10!"
                      : ""
                  }`}
                />
                <Button
                  size="small"
                  text="Create Account"
                  variant="primary"
                  href="/signup"
                  className={`font-normal ${
                    isAuth || isAsk
                      ? "bg-white! text-black! border-white! hover:bg-white/90!"
                      : ""
                  }`}
                />
              </>
            )}
          </div>
        )}
      </div>

      <div className="md:hidden flex items-center gap-2">
        {!loading && user && (
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className={`transition-colors cursor-pointer px-3 py-2 rounded-md font-normal text-sm flex items-center gap-1 ${
                isAuth || !isAsk
                  ? "text-white hover:bg-white/10"
                  : "text-[#575657] hover:text-black"
              }`}
            >
              <span className="truncate max-w-[80px]">{userName}</span>
              <svg
                className={`w-4 h-4 transition-transform ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div
                className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 z-50 ${
                  isAuth || !isAsk
                    ? "bg-[#1a1a1a] border border-white/10"
                    : "bg-white border border-gray-200"
                }`}
              >
                <Link
                  href="/dashboard"
                  onClick={(e) => {
                    e.stopPropagation();
                    setDropdownOpen(false);
                  }}
                  className={`block px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isAuth || !isAsk
                      ? "text-white hover:bg-white/10"
                      : "text-[#575657] hover:bg-gray-100"
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSignOut();
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm transition-colors cursor-pointer ${
                    isAuth || !isAsk
                      ? "text-white hover:bg-white/10"
                      : "text-[#575657] hover:bg-gray-100"
                  }`}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
        <button
          ref={hamburgerRef}
          onClick={(e) => {
            e.stopPropagation();
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className={`p-2 rounded-md transition-colors ${
            isAuth || !isAsk
              ? "text-white hover:bg-white/10"
              : "text-[#575657] hover:bg-gray-100"
          }`}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className={`md:hidden fixed top-[56px] left-0 right-0 z-50 ${
            isAuth || !isAsk
              ? "bg-[#111] border-b border-black/10"
              : "bg-white border-b border-gray-200"
          }`}
        >
          <ul className="flex flex-col py-4">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-8 py-3 text-sm transition-colors ${
                    pathname === item.href
                      ? isAuth || !isAsk
                        ? "text-white underline underline-offset-2 bg-white/5"
                        : "text-black underline underline-offset-2 bg-gray-100"
                      : isAuth
                      ? "text-white hover:bg-white/10"
                      : "text-[#575657] hover:bg-gray-100"
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          {!loading && !user && (
            <div className="flex flex-col gap-2 px-8 pb-4">
              <Button
                size="small"
                text="Login"
                variant="outline"
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-normal w-full ${
                  isAuth || isAsk
                    ? "text-white! border-white! hover:bg-white/10!"
                    : ""
                }`}
              />
              <Button
                size="small"
                text="Create Account"
                variant="primary"
                href="/signup"
                onClick={() => setMobileMenuOpen(false)}
                className={`font-normal w-full ${
                  isAuth || isAsk
                    ? "bg-white text-black! border-white! hover:bg-white/90!"
                    : ""
                }`}
              />
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
