"use client";

import Link from "next/link";
import React from "react";

interface ButtonProps {
  text: string;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const Button = ({
  text,
  variant = "primary",
  size = "medium",
  onClick,
  disabled,
  className,
  children,
  href,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-mono tracking-wide uppercase border transition-colors duration-150 cursor-pointer tranistion-all duration-300 ease-in-out hover:opacity-80";

  const variantStyles =
    variant === "primary"
      ? "bg-black text-white border-black"
      : variant === "secondary"
      ? "bg-white text-black border-black"
      : "bg-transparent text-black border-black";

  const sizeStyles =
    size === "small"
      ? "px-4 py-2 text-xs"
      : size === "medium"
      ? "px-8 py-3 text-sm"
      : "px-10 py-4 text-base";

  const content = children ?? text;

  if (href) {
    return (
      <Link
        href={href}
        className={`${baseStyles} ${variantStyles} ${sizeStyles} ${
          disabled ? "opacity-50 pointer-events-none cursor-not-allowed" : ""
        } ${className || ""}`}
        tabIndex={disabled ? -1 : undefined}
        aria-disabled={disabled ? "true" : undefined}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className || ""}`}
    >
      {content}
    </button>
  );
};

export default Button;
