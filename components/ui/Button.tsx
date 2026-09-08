"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger" | "cyber";
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  glow = false,
  disabled,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-prime-blue-light focus:ring-offset-2 focus:ring-offset-prime-bg";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-5 py-2.5 text-sm gap-2",
    lg: "px-7 py-3.5 text-base gap-2.5",
    xl: "px-9 py-4 text-lg gap-3",
  };

  const variantStyles = {
    primary:
      "bg-gradient-to-r from-prime-blue to-blue-600 hover:from-blue-600 hover:to-prime-blue text-white border border-blue-400/30 shadow-md hover:shadow-neon-blue",
    secondary:
      "bg-prime-surface hover:bg-prime-bg-elevated text-prime-text border border-prime-border hover:border-prime-border-bright",
    outline:
      "bg-transparent hover:bg-prime-blue/10 text-prime-blue-light border border-prime-blue-light/50 hover:border-prime-blue-light",
    ghost:
      "bg-transparent hover:bg-white/5 text-prime-muted hover:text-prime-text",
    danger:
      "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white border border-red-400/30 shadow-md hover:shadow-neon-danger",
    cyber:
      "bg-gradient-to-r from-cyan-500 via-prime-blue to-indigo-600 text-white border border-cyan-300/50 shadow-neon-cyan hover:brightness-110",
  };

  return (
    <button
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        glow && "shadow-neon-blue animate-pulse-glow",
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
