"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { usePathname } from "next/navigation";
const navItems = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <nav className="px-6 py-4 flex justify-between items-center">
      <h2 className="cormorant font-bold text-2xl">Strava</h2>

      <div className="flex gap-4">
        <ul className="flex items-center gap-4 font  text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`${
                  pathname === item.href ? "text-black" : "text-[#575657]"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>

        <Button size="small" text="Start" href="/astrology" />
      </div>
    </nav>
  );
};

export default Navbar;
