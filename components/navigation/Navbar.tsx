"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Crosshair,
  Trophy,
  User,
  Settings,
  Volume2,
  VolumeX,
  Play,
  Flame,
} from "lucide-react";
import { soundEngine } from "@/lib/audio/soundEngine";
import { cn } from "@/lib/utils";

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
  }, []);

  const toggleSound = () => {
    const next = !isMuted;
    setIsMuted(next);
    soundEngine.setMuted(next);
    if (!next) {
      soundEngine.playHit();
    }
  };

  const navLinks = [
    { href: "/", label: "Home", icon: Flame },
    { href: "/play", label: "Modes", icon: Crosshair },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  // If in active fullscreen gameplay route, we render a minimal translucent header or hide
  const isPlayingArena = pathname.startsWith("/play/") && pathname !== "/play";

  if (isPlayingArena) {
    return null; // Arena has its own custom high-performance HUD
  }

  return (
    <header className="sticky top-0 z-40 w-full bg-prime-bg/85 backdrop-blur-xl border-b border-prime-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          href="/"
          className="flex items-center gap-3 group select-none cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-prime-blue to-cyan-500 flex items-center justify-center shadow-neon-blue group-hover:scale-105 transition-transform">
            <Crosshair className="w-6 h-6 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-black tracking-widest text-white">
                PRIME
              </span>
              <span className="text-xl font-black tracking-widest text-prime-blue-light drop-shadow-[0_0_8px_rgba(96,165,250,0.8)]">
                EDGE
              </span>
            </div>
            <p className="text-[10px] tracking-widest uppercase text-prime-muted font-bold -mt-1">
              Arcade Shooting Range
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                  isActive
                    ? "bg-prime-blue/20 text-prime-blue-light border border-prime-blue/40 shadow-sm"
                    : "text-prime-muted hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Mute/Unmute Toggle */}
          <button
            onClick={toggleSound}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={cn(
              "w-10 h-10 rounded-xl border flex items-center justify-center transition-all",
              isMuted
                ? "border-red-500/30 bg-red-500/10 text-red-400 hover:bg-red-500/20"
                : "border-prime-blue/40 bg-prime-blue/10 text-prime-blue-light hover:bg-prime-blue/20"
            )}
            title={isMuted ? "Sound Off (Click to enable)" : "Sound On"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Quick Play CTA */}
          <Link
            href="/play"
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider bg-gradient-to-r from-prime-blue to-blue-600 hover:from-blue-600 hover:to-prime-blue text-white shadow-neon-blue border border-blue-400/40 hover:scale-105 active:scale-95 transition-all"
          >
            <Play className="w-4 h-4 fill-current" />
            <span className="hidden sm:inline">Play Now</span>
          </Link>
        </div>
      </div>
    </header>
  );
};
