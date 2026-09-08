"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Crosshair,
  Zap,
  ShieldAlert,
  Trophy,
  Play,
  Flame,
  Award,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Cpu,
  Volume2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GAME_MODES } from "@/game/config/modes";
import { DIFFICULTIES } from "@/game/config/difficulties";
import { getLocalPlayerStats, getLeaderboardEntries } from "@/lib/storage/db";
import { getLevelFromXp } from "@/game/scoring/calculator";
import { formatNumber } from "@/lib/utils";
import { LeaderboardEntry, PlayerStats } from "@/game/types";

export default function HomePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [topEntries, setTopEntries] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    setStats(getLocalPlayerStats());
    setTopEntries(getLeaderboardEntries().slice(0, 3));
  }, []);

  const playerLevel = stats ? getLevelFromXp(stats.xp) : null;

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 flex flex-col items-center justify-center text-center px-4 overflow-hidden">
        {/* Glow ambient circle */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-prime-blue/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-prime-surface/90 border border-prime-blue/40 text-xs font-bold text-prime-blue-light uppercase tracking-widest mb-6 shadow-neon-blue/40 shadow-sm animate-float">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>PRIME EDGE &bull; NEXT-GEN BROWSER SHOOTER</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-none">
            MASTER THE{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-prime-blue-light via-cyan-400 to-blue-500 drop-shadow-[0_0_25px_rgba(56,189,248,0.6)]">
              EDGE
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-prime-muted max-w-2xl mb-10 leading-relaxed font-medium">
            Test your reflex speed, target acquisition, and precision aiming in a lightning-fast 60 FPS arcade range designed for casual players and competitive aim masters.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link href="/play" className="w-full sm:w-auto">
              <Button
                variant="cyber"
                size="xl"
                className="w-full sm:w-auto px-10 shadow-neon-cyan group"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                <span>Deploy Instantly</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/leaderboard" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="xl"
                className="w-full sm:w-auto px-8 text-slate-200"
              >
                <Trophy className="w-5 h-5 text-amber-400" />
                <span>Leaderboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Player Career Ticker (if played) */}
      {stats && stats.totalGames > 0 && (
        <section className="w-full max-w-6xl px-4 mb-16">
          <Card className="bg-gradient-to-r from-prime-surface via-prime-bg-card to-prime-surface border-prime-blue/40 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-prime-blue to-cyan-500 flex items-center justify-center font-black text-xl text-white shadow-neon-blue font-mono">
                  L{playerLevel?.level}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{stats.displayName}</h3>
                    <Badge variant="cyber">{playerLevel?.title}</Badge>
                  </div>
                  <p className="text-xs text-prime-muted mt-0.5">
                    Career XP: {formatNumber(stats.xp)} &bull; {stats.totalGames} Simulation Rounds Completed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 text-center md:text-right">
                <div>
                  <span className="text-[10px] uppercase font-bold text-prime-muted block">High Score</span>
                  <span className="text-lg font-mono font-black text-white">{formatNumber(stats.bestScore)}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-prime-muted block">Accuracy</span>
                  <span className="text-lg font-mono font-black text-emerald-400">{stats.globalAccuracy}%</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-prime-muted block">Max Streak</span>
                  <span className="text-lg font-mono font-black text-cyan-300">{stats.bestCombo}x</span>
                </div>
              </div>
            </div>
          </Card>
        </section>
      )}

      {/* Game Modes Section */}
      <section className="w-full max-w-6xl px-4 py-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-prime-blue-light text-xs font-bold uppercase tracking-widest mb-1">
              <Flame className="w-4 h-4" />
              <span>Tactical Simulations</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-white tracking-tight">
              Select Your Game Mode
            </h2>
          </div>
          <Link href="/play" className="text-sm font-bold text-prime-blue-light hover:underline flex items-center gap-1">
            View all parameters <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Object.values(GAME_MODES).map((mode) => {
            return (
              <Card
                key={mode.id}
                hoverEffect
                className="flex flex-col justify-between border-prime-border/80 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Badge variant={mode.id === "survival" ? "danger" : mode.id === "precision" ? "warning" : "cyber"}>
                      {mode.badge}
                    </Badge>
                    <span className="text-xs font-mono text-prime-muted">{mode.defaultDuration}s</span>
                  </div>

                  <h3 className="text-xl font-black uppercase tracking-wide text-white group-hover:text-prime-blue-light transition-colors mb-2">
                    {mode.name}
                  </h3>

                  <p className="text-xs text-prime-muted leading-relaxed mb-6">
                    {mode.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-prime-border/60">
                  <Link href={`/play/${mode.id}`}>
                    <Button variant="primary" size="md" className="w-full">
                      Launch Mode
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Live Leaderboard Teaser */}
      <section className="w-full max-w-6xl px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Leaderboard Showcase */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-400" />
                <h3 className="text-2xl font-black uppercase text-white tracking-tight">
                  Apex Leaderboard
                </h3>
              </div>
              <Link href="/leaderboard" className="text-xs font-bold text-prime-blue-light uppercase tracking-wider hover:underline">
                Full Rankings &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {topEntries.map((entry, idx) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-prime-surface border border-prime-border hover:border-prime-border-bright transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center font-black font-mono text-sm ${
                        idx === 0
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-sm"
                          : idx === 1
                          ? "bg-slate-300/20 text-slate-200 border border-slate-400/50"
                          : "bg-amber-700/20 text-amber-400 border border-amber-700/50"
                      }`}
                    >
                      #{idx + 1}
                    </div>
                    <div>
                      <span className="font-bold text-white text-sm block">
                        {entry.displayName}
                      </span>
                      <span className="text-[11px] text-prime-muted uppercase font-mono">
                        {entry.mode} &bull; {entry.difficulty}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-base font-black font-mono text-white block">
                        {formatNumber(entry.score)}
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">
                        {entry.accuracy}% ACC
                      </span>
                    </div>
                    <Badge variant="cyber">{entry.grade}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Feature Highlights */}
          <div className="flex flex-col gap-4">
            <Card className="bg-prime-surface border-prime-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-prime-blue/20 text-prime-blue-light">
                  <Cpu className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase">60 FPS Engine</h4>
              </div>
              <p className="text-xs text-prime-muted leading-relaxed">
                Decoupled Canvas loop ensures ultra-low input latency for precision flick-shooting.
              </p>
            </Card>

            <Card className="bg-prime-surface border-prime-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300">
                  <Volume2 className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Web Audio Synth</h4>
              </div>
              <p className="text-xs text-prime-muted leading-relaxed">
                Procedural sound synthesis with zero external MP3 dependencies for instant playback.
              </p>
            </Card>

            <Card className="bg-prime-surface border-prime-border">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-400">
                  <Award className="w-5 h-5" />
                </div>
                <h4 className="text-sm font-bold text-white uppercase">Anti-Tamper Scoring</h4>
              </div>
              <p className="text-xs text-prime-muted leading-relaxed">
                Server-side verified score validation prevents spoofed accuracy or impossible records.
              </p>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}

