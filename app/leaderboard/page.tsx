"use client";

import React, { useState, useEffect } from "react";
import {
  Trophy,
  Search,
  Filter,
  Medal,
  Calendar,
  Crosshair,
  Zap,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { formatNumber, cn } from "@/lib/utils";
import { LeaderboardEntry } from "@/game/types";
import { getLeaderboardEntries } from "@/lib/storage/db";

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [modeFilter, setModeFilter] = useState<string>("all");
  const [diffFilter, setDiffFilter] = useState<string>("all");
  const [timeframeFilter, setTimeframeFilter] = useState<"all" | "weekly" | "today">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (modeFilter !== "all") params.set("mode", modeFilter);
      if (diffFilter !== "all") params.set("difficulty", diffFilter);
      if (timeframeFilter !== "all") params.set("timeframe", timeframeFilter);

      const res = await fetch(`/api/leaderboard?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setEntries(data.entries || []);
      } else {
        setEntries(
          getLeaderboardEntries({
            mode: modeFilter !== "all" ? modeFilter : undefined,
            difficulty: diffFilter !== "all" ? diffFilter : undefined,
            timeframe: timeframeFilter,
          })
        );
      }
    } catch (e) {
      setEntries(
        getLeaderboardEntries({
          mode: modeFilter !== "all" ? modeFilter : undefined,
          difficulty: diffFilter !== "all" ? diffFilter : undefined,
          timeframe: timeframeFilter,
        })
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, [modeFilter, diffFilter, timeframeFilter]);

  const filteredEntries = entries.filter((e) =>
    e.displayName.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-xs font-bold text-amber-300 uppercase tracking-wider mb-3">
          <Trophy className="w-3.5 h-3.5" />
          <span>Global Combat Rankings</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Apex Marksmen
        </h1>
        <p className="text-sm text-prime-muted mt-2">
          Verified high scores across all combat simulations and difficulty tiers.
        </p>
      </div>

      {/* Top 3 Podium Cards */}
      {filteredEntries.length >= 3 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {/* Rank 2 */}
          <div className="order-2 md:order-1">
            <Card className="bg-prime-surface border-slate-400/40 p-5 text-center flex flex-col items-center relative">
              <div className="w-12 h-12 rounded-2xl bg-slate-400/20 text-slate-300 border border-slate-400/50 flex items-center justify-center font-black text-xl mb-3">
                #2
              </div>
              <span className="font-bold text-white text-base truncate max-w-full">
                {filteredEntries[1].displayName}
              </span>
              <span className="text-xs text-prime-muted uppercase font-mono mt-0.5">
                {filteredEntries[1].mode} &bull; {filteredEntries[1].difficulty}
              </span>
              <div className="text-2xl font-black font-mono text-white mt-3">
                {formatNumber(filteredEntries[1].score)}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">
                {filteredEntries[1].accuracy}% ACC &bull; {filteredEntries[1].bestCombo}x
              </div>
            </Card>
          </div>

          {/* Rank 1 */}
          <div className="order-1 md:order-2 -mt-4">
            <Card className="bg-gradient-to-b from-prime-surface via-prime-bg-card to-prime-surface border-amber-500/60 shadow-neon-blue p-6 text-center flex flex-col items-center relative">
              <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest">
                Current Champion
              </div>
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-300 border border-amber-500/50 flex items-center justify-center font-black text-2xl mb-3 shadow-[0_0_15px_rgba(245,158,11,0.4)]">
                #1
              </div>
              <span className="font-black text-white text-lg truncate max-w-full">
                {filteredEntries[0].displayName}
              </span>
              <span className="text-xs text-amber-300/80 uppercase font-mono mt-0.5">
                {filteredEntries[0].mode} &bull; {filteredEntries[0].difficulty}
              </span>
              <div className="text-3xl font-black font-mono text-white mt-3 drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
                {formatNumber(filteredEntries[0].score)}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">
                {filteredEntries[0].accuracy}% ACC &bull; {filteredEntries[0].bestCombo}x STREAK
              </div>
            </Card>
          </div>

          {/* Rank 3 */}
          <div className="order-3">
            <Card className="bg-prime-surface border-amber-700/40 p-5 text-center flex flex-col items-center relative">
              <div className="w-12 h-12 rounded-2xl bg-amber-700/20 text-amber-400 border border-amber-700/50 flex items-center justify-center font-black text-xl mb-3">
                #3
              </div>
              <span className="font-bold text-white text-base truncate max-w-full">
                {filteredEntries[2].displayName}
              </span>
              <span className="text-xs text-prime-muted uppercase font-mono mt-0.5">
                {filteredEntries[2].mode} &bull; {filteredEntries[2].difficulty}
              </span>
              <div className="text-2xl font-black font-mono text-white mt-3">
                {formatNumber(filteredEntries[2].score)}
              </div>
              <div className="text-xs text-emerald-400 font-mono mt-0.5">
                {filteredEntries[2].accuracy}% ACC &bull; {filteredEntries[2].bestCombo}x
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Filters Bar */}
      <Card className="mb-6 p-4 bg-prime-surface/80 border-prime-border">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Mode Tabs */}
          <div className="flex flex-wrap gap-1.5 w-full lg:w-auto">
            {["all", "classic", "time-attack", "survival", "precision"].map((mode) => (
              <button
                key={mode}
                onClick={() => setModeFilter(mode)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all",
                  modeFilter === mode
                    ? "bg-prime-blue text-white shadow-neon-blue"
                    : "bg-prime-bg text-prime-muted hover:text-white"
                )}
              >
                {mode === "all" ? "All Modes" : mode.replace("-", " ")}
              </button>
            ))}
          </div>

          {/* Difficulty & Search */}
          <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-end">
            <select
              value={diffFilter}
              onChange={(e) => setDiffFilter(e.target.value)}
              className="bg-prime-bg border border-prime-border text-xs text-white rounded-xl px-3 py-2 focus:outline-none focus:border-prime-blue-light"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Recruit (Easy)</option>
              <option value="normal">Operative (Normal)</option>
              <option value="hard">Elite (Hard)</option>
              <option value="extreme">Prime Edge (Extreme)</option>
            </select>

            <div className="relative flex-1 sm:w-48">
              <Search className="w-3.5 h-3.5 text-prime-muted absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search marksman..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-prime-bg border border-prime-border text-xs text-white rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-prime-blue-light placeholder-prime-muted"
              />
            </div>

            <button
              onClick={fetchEntries}
              className="p-2 rounded-xl bg-prime-bg border border-prime-border text-prime-muted hover:text-white hover:border-prime-border-bright transition-all"
              title="Refresh"
            >
              <RefreshCw className={cn("w-4 h-4", loading && "animate-spin")} />
            </button>
          </div>
        </div>
      </Card>

      {/* Rankings Table */}
      <div className="bg-prime-surface border border-prime-border rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-prime-bg-card/90 text-[11px] uppercase tracking-wider text-prime-muted font-bold border-b border-prime-border">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Rank</th>
                <th className="py-3.5 px-4">Marksman</th>
                <th className="py-3.5 px-4">Mode</th>
                <th className="py-3.5 px-4">Difficulty</th>
                <th className="py-3.5 px-4 text-right">Score</th>
                <th className="py-3.5 px-4 text-right">Accuracy</th>
                <th className="py-3.5 px-4 text-right">Streak</th>
                <th className="py-3.5 px-4 sm:px-6 text-center">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-prime-border/50 font-mono text-xs">
              {filteredEntries.map((entry, idx) => (
                <tr
                  key={entry.id}
                  className="hover:bg-prime-bg-elevated/50 transition-colors group"
                >
                  <td className="py-3.5 px-4 sm:px-6 font-bold text-slate-300">
                    #{idx + 1}
                  </td>
                  <td className="py-3.5 px-4 font-sans font-bold text-white group-hover:text-prime-blue-light transition-colors">
                    {entry.displayName}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-prime-muted text-[11px]">
                    {entry.mode}
                  </td>
                  <td className="py-3.5 px-4 uppercase text-[11px]">
                    <span
                      className={
                        entry.difficulty === "extreme"
                          ? "text-red-400"
                          : entry.difficulty === "hard"
                          ? "text-amber-400"
                          : "text-prime-blue-light"
                      }
                    >
                      {entry.difficulty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right font-black text-white text-sm">
                    {formatNumber(entry.score)}
                  </td>
                  <td className="py-3.5 px-4 text-right text-emerald-400">
                    {entry.accuracy}%
                  </td>
                  <td className="py-3.5 px-4 text-right text-cyan-300">
                    {entry.bestCombo}x
                  </td>
                  <td className="py-3.5 px-4 sm:px-6 text-center">
                    <Badge variant="cyber">{entry.grade}</Badge>
                  </td>
                </tr>
              ))}
              {filteredEntries.length === 0 && (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-prime-muted font-sans">
                    No simulation records found for the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

