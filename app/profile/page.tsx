"use client";

import React, { useState, useEffect } from "react";
import {
  User,
  Award,
  Crosshair,
  Zap,
  Target,
  Trophy,
  History,
  Edit2,
  Check,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { formatNumber } from "@/lib/utils";
import { getLocalPlayerStats } from "@/lib/storage/db";
import { getLevelFromXp } from "@/game/scoring/calculator";
import { PlayerStats } from "@/game/types";

export default function ProfilePage() {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState("");

  useEffect(() => {
    const s = getLocalPlayerStats();
    setStats(s);
    setNameInput(s.displayName || "Marksman");
  }, []);

  const handleSaveName = () => {
    if (!nameInput.trim() || !stats) return;
    const updated = { ...stats, displayName: nameInput.trim() };
    setStats(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("prime_edge_player_stats_v1", JSON.stringify(updated));
    }
    setIsEditingName(false);
  };

  if (!stats) return null;

  const playerLevel = getLevelFromXp(stats.xp);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      {/* Profile Header Banner */}
      <Card className="bg-gradient-to-r from-prime-surface via-prime-bg-card to-prime-surface border-prime-blue/50 shadow-2xl p-6 sm:p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            {/* Avatar Level Hexagon */}
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-br from-prime-blue via-blue-600 to-cyan-500 flex flex-col items-center justify-center text-white shadow-neon-blue font-mono border-2 border-cyan-300/40">
              <span className="text-[10px] uppercase tracking-widest text-cyan-200 font-bold">LEVEL</span>
              <span className="text-3xl sm:text-4xl font-black">{playerLevel.level}</span>
            </div>

            <div>
              {/* Player Callsign / Name */}
              <div className="flex items-center justify-center sm:justify-start gap-2">
                {isEditingName ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={nameInput}
                      onChange={(e) => setNameInput(e.target.value)}
                      maxLength={20}
                      className="bg-prime-bg border border-prime-blue-light text-white text-lg font-bold px-3 py-1 rounded-xl focus:outline-none"
                    />
                    <Button variant="primary" size="sm" onClick={handleSaveName}>
                      <Check className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                      {stats.displayName}
                    </h1>
                    <button
                      onClick={() => setIsEditingName(true)}
                      className="text-prime-muted hover:text-prime-blue-light p-1 rounded-lg transition-colors"
                      title="Edit Callsign"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>

              {/* Title Badge */}
              <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="cyber">{playerLevel.title}</Badge>
                <span className="text-xs text-prime-muted font-mono">
                  {formatNumber(stats.xp)} Total XP
                </span>
              </div>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full md:w-72 bg-prime-bg/70 p-4 rounded-2xl border border-prime-border">
            <div className="flex justify-between items-center text-xs font-mono text-prime-muted mb-1.5">
              <span>XP to Level {playerLevel.level + 1}</span>
              <span className="text-cyan-400 font-bold">{playerLevel.progress}%</span>
            </div>
            <div className="w-full h-2.5 bg-slate-900 rounded-full overflow-hidden border border-slate-700">
              <div
                className="h-full bg-gradient-to-r from-prime-blue to-cyan-400 rounded-full shadow-[0_0_10px_rgba(0,240,255,0.6)]"
                style={{ width: `${playerLevel.progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-prime-muted font-mono mt-1">
              <span>{formatNumber(playerLevel.currentXp)} XP</span>
              <span>{formatNumber(playerLevel.nextLevelXp)} XP</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Career Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            Total Matches
          </span>
          <span className="text-2xl font-black font-mono text-white">
            {formatNumber(stats.totalGames)}
          </span>
        </Card>

        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            Global Accuracy
          </span>
          <span className="text-2xl font-black font-mono text-emerald-400">
            {stats.globalAccuracy}%
          </span>
        </Card>

        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            High Score
          </span>
          <span className="text-2xl font-black font-mono text-amber-300">
            {formatNumber(stats.bestScore)}
          </span>
        </Card>

        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            Max Streak
          </span>
          <span className="text-2xl font-black font-mono text-cyan-300">
            {stats.bestCombo}x
          </span>
        </Card>

        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            Total Targets Hit
          </span>
          <span className="text-2xl font-black font-mono text-white">
            {formatNumber(stats.totalHits)}
          </span>
        </Card>

        <Card className="p-4 bg-prime-surface border-prime-border text-center">
          <span className="text-[10px] uppercase tracking-wider text-prime-muted font-bold block mb-1">
            Favorite Mode
          </span>
          <span className="text-lg font-black uppercase text-prime-blue-light truncate block">
            {stats.favoriteMode || "Classic"}
          </span>
        </Card>
      </div>

      {/* Match History Table */}
      <Card className="bg-prime-surface border-prime-border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-prime-blue-light" />
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              Recent Combat Records
            </h2>
          </div>
          <span className="text-xs text-prime-muted font-mono">
            Last {stats.matchHistory?.length || 0} Matches
          </span>
        </div>

        {stats.matchHistory && stats.matchHistory.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-prime-bg-card text-prime-muted uppercase border-b border-prime-border">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Mode</th>
                  <th className="py-3 px-4">Difficulty</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4 text-right">Accuracy</th>
                  <th className="py-3 px-4 text-right">Max Streak</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-prime-border/50">
                {stats.matchHistory.map((m) => (
                  <tr key={m.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 text-prime-muted">
                      {new Date(m.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-white font-sans font-bold uppercase">
                      {m.mode}
                    </td>
                    <td className="py-3 px-4 uppercase text-prime-blue-light">
                      {m.difficulty}
                    </td>
                    <td className="py-3 px-4 text-right font-black text-white">
                      {formatNumber(m.score)}
                    </td>
                    <td className="py-3 px-4 text-right text-emerald-400">
                      {m.accuracy}%
                    </td>
                    <td className="py-3 px-4 text-right text-cyan-300">
                      {m.bestCombo}x
                    </td>
                    <td className="py-3 px-4 text-center font-sans">
                      <Badge variant="cyber">{m.grade}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-prime-muted text-sm">
            No matches recorded yet. Launch your first simulation in the Modes menu!
          </div>
        )}
      </Card>
    </div>
  );
}

