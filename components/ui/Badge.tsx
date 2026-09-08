import React from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "primary" | "secondary" | "success" | "warning" | "danger" | "cyber";
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = "primary",
  ...props
}) => {
  const variantStyles = {
    primary: "bg-prime-blue/15 text-prime-blue-light border-prime-blue/40",
    secondary: "bg-slate-800 text-slate-300 border-slate-700",
    success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border-amber-500/30",
    danger: "bg-rose-500/15 text-rose-400 border-rose-500/30",
    cyber: "bg-cyan-500/15 text-cyan-300 border-cyan-400/40 shadow-sm",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider border",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};
