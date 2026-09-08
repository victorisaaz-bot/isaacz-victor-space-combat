import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = false,
  glow = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        "bg-prime-surface/90 backdrop-blur-md rounded-2xl border border-prime-border p-5 text-prime-text transition-all duration-300 relative overflow-hidden",
        hoverEffect && "hover:border-prime-border-bright hover:-translate-y-1 hover:shadow-neon-blue/20 hover:shadow-xl",
        glow && "border-prime-blue/50 shadow-neon-blue/30 shadow-lg",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
