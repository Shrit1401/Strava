"use client";

import Link from "next/link";
import Button from "./ui/Button";
import { usePathname } from "next/navigation";

const navItems = [
  {
    label: "About",
    href: "/about",
  },
  {
    label: "Contact",
    href: "/contact",
  },
  {
    label: "Natal Chart",
    href: "/natal-chart",
  },
];

type NavbarProps = {
  isAuth?: boolean;
};

const Navbar = ({ isAuth }: NavbarProps) => {
  const pathname = usePathname();

  return (
    <nav
      className={`w-full z-20 px-8 py-4 flex justify-between items-center  ${
        isAuth ? "fixed top-0 left-0 border-b border-black/10" : ""
      }`}
      style={{
        minHeight: 56,
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <h2
          className={`cormorant font-bold text-2xl tracking-tight ${
            isAuth ? "text-white" : ""
          }`}
        >
          Strava
        </h2>
      </Link>
      <div className="flex items-center gap-5">
        <ul className="flex items-center gap-4 text-sm">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`transition-colors ${
                  pathname === item.href
                    ? isAuth
                      ? "text-white underline underline-offset-2"
                      : "text-black underline underline-offset-2"
                    : isAuth
                    ? "text-white hover:text-white"
                    : "text-[#575657] hover:text-black"
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex gap-2">
          <Button
            size="small"
            text="Login"
            variant="outline"
            href="/login"
            className={`font-normal ${
              isAuth ? "!text-white !border-white hover:!bg-white/10" : ""
            }`}
          />
          <Button
            size="small"
            text="Create Account"
            variant="primary"
            href="/signup"
            className={`font-normal ${
              isAuth
                ? "!bg-white !text-black !border-white hover:!bg-white/90"
                : ""
            }`}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
