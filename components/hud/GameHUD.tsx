"use client";

import React from "react";
import { Pause, Volume2, VolumeX, Shield, Zap, Crosshair, RotateCcw } from "lucide-react";
import { formatNumber, formatTime, cn } from "@/lib/utils";
import { soundEngine } from "@/lib/audio/soundEngine";
import { GameModeConfig } from "@/game/types";

interface GameHUDProps {
  score: number;
  timeRemaining: number;
  accuracy: number;
  combo: number;
  bestCombo: number;
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  modeConfig: GameModeConfig;
  onPause: () => void;
  onReload: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  score,
  timeRemaining,
  accuracy,
  combo,
  health,
  maxHealth,
  ammo,
  maxAmmo,
  isReloading,
  modeConfig,
  onPause,
  onReload,
  isMuted,
  onToggleMute,
}) => {
  const isTimeCritical = timeRemaining <= 10 && timeRemaining > 0;
  const isHealthCritical = modeConfig.hasHealth && health <= 30;
  const comboMultiplier = 1 + Math.min(combo, 50) * 0.1;

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-4 sm:p-6 z-30">
      {/* Top Bar HUD */}
      <div className="flex items-start justify-between gap-4">
        {/* Left: Mode & Pause */}
        <div className="flex items-center gap-3">
          <button
            onClick={onPause}
            className="pointer-events-auto p-2.5 rounded-xl bg-prime-surface/80 hover:bg-prime-surface border border-prime-border hover:border-prime-blue-light text-white transition-all shadow-lg active:scale-90"
            title="Pause Game [Esc / P]"
          >
            <Pause className="w-5 h-5 fill-current" />
          </button>

          <button
            onClick={onToggleMute}
            className="pointer-events-auto p-2.5 rounded-xl bg-prime-surface/80 hover:bg-prime-surface border border-prime-border text-prime-muted hover:text-white transition-all"
            title="Toggle Sound"
          >
            {isMuted ? <VolumeX className="w-5 h-5 text-red-400" /> : <Volume2 className="w-5 h-5 text-prime-blue-light" />}
          </button>

          <div className="hidden sm:flex flex-col bg-prime-surface/75 backdrop-blur-md px-4 py-1.5 rounded-xl border border-prime-border">
            <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold">
              Mission Mode
            </span>
            <span className="text-sm font-bold text-white flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-prime-blue-light animate-ping" />
              {modeConfig.name}
            </span>
          </div>
        </div>

        {/* Center: Score & Combo Multiplier */}
        <div className="flex flex-col items-center">
          <div className="bg-prime-surface/85 backdrop-blur-md px-6 py-2 rounded-2xl border border-prime-blue/40 shadow-neon-blue flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-widest text-prime-blue-light font-bold">
              Current Score
            </span>
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-tight text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.7)]">
              {formatNumber(score)}
            </span>
          </div>

          {/* Combo Multiplier Meter */}
          {combo > 1 && (
            <div className="mt-2 flex items-center gap-2 bg-gradient-to-r from-prime-blue-deep/90 to-cyan-900/90 border border-cyan-400/50 px-3.5 py-1 rounded-full animate-bounce shadow-neon-cyan">
              <Zap className="w-3.5 h-3.5 text-cyan-300 fill-current animate-pulse" />
              <span className="text-xs font-black tracking-wider text-cyan-200">
                COMBO &times;{combo} ({comboMultiplier.toFixed(1)}x)
              </span>
            </div>
          )}
        </div>

        {/* Right: Timer & Accuracy */}
        <div className="flex items-center gap-3">
          {/* Accuracy Widget */}
          <div className="hidden md:flex flex-col items-end bg-prime-surface/75 backdrop-blur-md px-4 py-1.5 rounded-xl border border-prime-border">
            <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold">
              Accuracy
            </span>
            <span className="text-sm font-bold font-mono text-emerald-400">
              {accuracy.toFixed(1)}%
            </span>
          </div>

          {/* Timer Clock */}
          <div
            className={cn(
              "flex flex-col items-center px-5 py-2 rounded-2xl border backdrop-blur-md transition-all",
              isTimeCritical
                ? "bg-red-950/80 border-red-500 shadow-neon-danger animate-pulse"
                : "bg-prime-surface/85 border-prime-border shadow-lg"
            )}
          >
            <span
              className={cn(
                "text-[10px] uppercase tracking-widest font-bold",
                isTimeCritical ? "text-red-400" : "text-prime-muted"
              )}
            >
              Time Left
            </span>
            <span
              className={cn(
                "text-2xl sm:text-3xl font-black font-mono tracking-tight",
                isTimeCritical ? "text-red-400" : "text-white"
              )}
            >
              {formatTime(timeRemaining)}
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Bar HUD */}
      <div className="flex items-end justify-between gap-4">
        {/* Left: Health Meter (Survival Mode) */}
        {modeConfig.hasHealth ? (
          <div
            className={cn(
              "flex flex-col gap-1 bg-prime-surface/85 backdrop-blur-md p-3 rounded-2xl border transition-all w-52",
              isHealthCritical
                ? "border-red-500 bg-red-950/70 shadow-neon-danger animate-pulse"
                : "border-prime-border"
            )}
          >
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="flex items-center gap-1 text-prime-muted">
                <Shield className="w-3.5 h-3.5 text-prime-blue-light" />
                SHIELD
              </span>
              <span
                className={
                  isHealthCritical ? "text-red-400 font-mono" : "text-emerald-400 font-mono"
                }
              >
                {Math.max(0, Math.round(health))} HP
              </span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700/50">
              <div
                className={cn(
                  "h-full transition-all duration-300 rounded-full",
                  health > 50
                    ? "bg-gradient-to-r from-emerald-500 to-cyan-400 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                    : health > 25
                    ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                    : "bg-gradient-to-r from-red-600 to-rose-500 shadow-neon-danger"
                )}
                style={{ width: `${Math.max(0, Math.min(100, (health / maxHealth) * 100))}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="hidden sm:block text-xs font-mono text-prime-muted/60">
            PRIME EDGE // TARGET SYSTEM ACTIVE
          </div>
        )}

        {/* Center: Mobile Touch Tap Hint / Weapon Indicator */}
        <div className="sm:hidden text-center text-[11px] text-prime-muted/80 bg-prime-surface/60 px-3 py-1 rounded-full">
          Tap targets to shoot
        </div>

        {/* Right: Ammo Counter & Quick Reload */}
        {modeConfig.hasAmmo && (
          <div className="flex items-center gap-2 pointer-events-auto">
            <button
              onClick={onReload}
              disabled={isReloading || ammo === maxAmmo}
              className={cn(
                "flex flex-col items-center bg-prime-surface/85 backdrop-blur-md px-4 py-2 rounded-2xl border transition-all active:scale-95",
                isReloading
                  ? "border-amber-500/70 bg-amber-950/40 text-amber-300 animate-pulse"
                  : ammo === 0
                  ? "border-red-500 bg-red-950/60 text-red-400 shadow-neon-danger animate-bounce"
                  : "border-prime-border hover:border-prime-blue-light text-white"
              )}
              title="Click or press [R] to reload"
            >
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold text-prime-muted">
                  {isReloading ? "RELOADING..." : ammo === 0 ? "EMPTY!" : "AMMO"}
                </span>
                <RotateCcw className={cn("w-3 h-3 text-prime-blue-light", isReloading && "animate-spin")} />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-xl font-black font-mono">
                  {isReloading ? "--" : ammo}
                </span>
                <span className="text-xs text-prime-muted font-mono">
                  / {maxAmmo}
                </span>
              </div>
              {/* Bullet indicators */}
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: maxAmmo }).map((_, i) => (
                  <div
                    key={i}
                    className={cn(
                      "w-1.5 h-3 rounded-xs transition-all",
                      i < ammo
                        ? "bg-cyan-400 shadow-[0_0_4px_rgba(0,240,255,0.8)]"
                        : "bg-slate-700 opacity-40"
                    )}
                  />
                ))}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
