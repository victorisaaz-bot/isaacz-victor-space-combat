"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Crosshair,
  Zap,
  ShieldAlert,
  Play,
  CheckCircle2,
  Gauge,
  Flame,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { GAME_MODES } from "@/game/config/modes";
import { DIFFICULTIES } from "@/game/config/difficulties";
import { DifficultyId, GameModeId } from "@/game/types";
import { cn } from "@/lib/utils";

export default function PlaySelectPage() {
  const [selectedMode, setSelectedMode] = useState<GameModeId>("classic");
  const [selectedDiff, setSelectedDiff] = useState<DifficultyId>("normal");

  const activeMode = GAME_MODES[selectedMode];
  const activeDiff = DIFFICULTIES[selectedDiff];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prime-blue/15 border border-prime-blue/40 text-xs font-bold text-prime-blue-light uppercase tracking-wider mb-3">
          <Crosshair className="w-3.5 h-3.5" />
          <span>Mission Deployment Center</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Select Simulation Parameters
        </h1>
        <p className="text-sm text-prime-muted mt-2">
          Configure your tactical challenge, difficulty tier, and launch the shooting range.
        </p>
      </div>

      {/* Step 1: Mode Selection */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-prime-blue text-white flex items-center justify-center text-xs font-black font-mono">
            1
          </span>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            Choose Game Mode
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(GAME_MODES).map((mode) => {
            const isSelected = selectedMode === mode.id;
            return (
              <div
                key={mode.id}
                onClick={() => setSelectedMode(mode.id)}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative overflow-hidden select-none",
                  isSelected
                    ? "bg-prime-surface border-prime-blue-light shadow-neon-blue ring-1 ring-prime-blue-light"
                    : "bg-prime-surface/60 border-prime-border hover:border-prime-border-bright hover:bg-prime-surface/90"
                )}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 text-prime-blue-light">
                    <CheckCircle2 className="w-5 h-5 fill-prime-blue/30" />
                  </div>
                )}
                <div>
                  <Badge variant={mode.id === "survival" ? "danger" : mode.id === "precision" ? "warning" : "cyber"}>
                    {mode.badge}
                  </Badge>
                  <h3 className="text-lg font-black uppercase tracking-wide text-white mt-3 mb-1">
                    {mode.name}
                  </h3>
                  <p className="text-xs text-prime-muted leading-relaxed mb-4">
                    {mode.tagline}
                  </p>
                </div>

                <div className="text-[11px] text-prime-blue-light font-mono pt-3 border-t border-prime-border/50 flex justify-between">
                  <span>Duration: {mode.defaultDuration}s</span>
                  <span>{mode.hasAmmo ? `${mode.maxAmmo} Rounds` : "Unlimited"}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Difficulty Selection */}
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-6 h-6 rounded-full bg-prime-blue text-white flex items-center justify-center text-xs font-black font-mono">
            2
          </span>
          <h2 className="text-lg font-bold uppercase tracking-wider text-white">
            Select Difficulty Rating
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Object.values(DIFFICULTIES).map((diff) => {
            const isSelected = selectedDiff === diff.id;
            return (
              <div
                key={diff.id}
                onClick={() => setSelectedDiff(diff.id)}
                className={cn(
                  "p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative select-none",
                  isSelected
                    ? "bg-prime-surface border-white/50 shadow-lg ring-1 ring-white/50"
                    : "bg-prime-surface/60 border-prime-border hover:border-prime-border-bright hover:bg-prime-surface/90"
                )}
              >
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span
                      className="text-xs font-black font-mono uppercase tracking-widest px-2.5 py-0.5 rounded-full"
                      style={{ backgroundColor: `${diff.color}20`, color: diff.color }}
                    >
                      {diff.multiplier}x Multiplier
                    </span>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </div>

                  <h3 className="text-lg font-black uppercase tracking-wide text-white mb-1">
                    {diff.name}
                  </h3>
                  <p className="text-xs text-prime-muted leading-relaxed">
                    {diff.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mission Briefing & Launch Card */}
      <Card className="bg-gradient-to-r from-prime-surface via-prime-bg-card to-prime-surface border-prime-blue/50 shadow-2xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="cyber">{activeMode.name}</Badge>
              <Badge variant="primary">{activeDiff.name} &bull; {activeDiff.multiplier}x Score</Badge>
            </div>
            <h3 className="text-2xl font-black uppercase text-white tracking-tight">
              Ready for Simulation
            </h3>
            <p className="text-sm text-prime-muted max-w-xl">
              {activeMode.description}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              href={`/play/${selectedMode}?diff=${selectedDiff}`}
              className="w-full sm:w-auto"
            >
              <Button
                variant="cyber"
                size="xl"
                className="w-full sm:w-auto px-10 shadow-neon-cyan group"
              >
                <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
                <span>Deploy to Range</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}

