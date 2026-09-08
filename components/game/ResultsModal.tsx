"use client";

import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  RotateCcw,
  Home,
  Trophy,
  CheckCircle2,
  Crosshair,
  Zap,
  Clock,
  Sparkles,
  Share2,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, formatTime, cn } from "@/lib/utils";
import {
  determineGrade,
  calculateXpEarned,
  getLevelFromXp,
} from "@/game/scoring/calculator";
import { saveLocalPlayerMatch, submitScoreEntry, getLocalPlayerStats } from "@/lib/storage/db";
import { soundEngine } from "@/lib/audio/soundEngine";
import { DifficultyId, GameModeId, ScoreSubmissionPayload } from "@/game/types";
import { GAME_MODES } from "@/game/config/modes";
import { DIFFICULTIES } from "@/game/config/difficulties";

interface ResultsModalProps {
  score: number;
  shots: number;
  hits: number;
  accuracy: number;
  bestCombo: number;
  duration: number;
  modeId: GameModeId;
  difficultyId: DifficultyId;
  targetsHitByType: {
    standard: number;
    small: number;
    critical: number;
    hazard: number;
  };
  reactionTimes: number[];
  onRestart: () => void;
  onExit: () => void;
}

export const ResultsModal: React.FC<ResultsModalProps> = ({
  score,
  shots,
  hits,
  accuracy,
  bestCombo,
  duration,
  modeId,
  difficultyId,
  targetsHitByType,
  reactionTimes,
  onRestart,
  onExit,
}) => {
  const [playerName, setPlayerName] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const misses = Math.max(0, shots - hits);
  const avgReactionTimeMs =
    reactionTimes.length > 0
      ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
      : 0;

  const grade = determineGrade(accuracy, score, bestCombo, modeId);
  const xpEarned = calculateXpEarned(score, accuracy, grade);

  const modeConfig = GAME_MODES[modeId] || GAME_MODES.classic;
  const diffConfig = DIFFICULTIES[difficultyId] || DIFFICULTIES.normal;

  useEffect(() => {
    // Play fanfare based on grade
    if (grade === "S+" || grade === "S" || grade === "A") {
      soundEngine.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ["#2563EB", "#00F0FF", "#38BDF8", "#F59E0B"],
        });
      } catch (e) {
        // Confetti fallback
      }
    } else {
      soundEngine.playGameOver();
    }

    // Pre-populate player name
    const stats = getLocalPlayerStats();
    if (stats.displayName) {
      setPlayerName(stats.displayName);
    }

    // Auto-record local match
    const payload: ScoreSubmissionPayload = {
      mode: modeId,
      difficulty: difficultyId,
      displayName: stats.displayName || "Marksman",
      score,
      shots,
      hits,
      accuracy,
      bestCombo,
      duration,
      targetsHit: {
        standard: targetsHitByType.standard,
        small: targetsHitByType.small,
        critical: targetsHitByType.critical,
      },
      avgReactionTimeMs,
    };
    saveLocalPlayerMatch(payload, xpEarned);
  }, []);

  const handleSubmitScore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim() || submitted || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const payload: ScoreSubmissionPayload = {
      mode: modeId,
      difficulty: difficultyId,
      displayName: playerName.trim(),
      score,
      shots,
      hits,
      accuracy,
      bestCombo,
      duration,
      targetsHit: {
        standard: targetsHitByType.standard,
        small: targetsHitByType.small,
        critical: targetsHitByType.critical,
      },
      avgReactionTimeMs,
    };

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        saveLocalPlayerMatch(payload, xpEarned);
        soundEngine.playCritical();
      } else {
        // If API route failed, use fallback local storage entry
        submitScoreEntry(payload);
        setSubmitted(true);
      }
    } catch (err) {
      // Fallback local storage
      submitScoreEntry(payload);
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const gradeColors: Record<string, { bg: string; text: string; glow: string }> = {
    "S+": {
      bg: "bg-gradient-to-br from-cyan-400 via-prime-blue to-purple-600",
      text: "text-white",
      glow: "shadow-neon-cyan drop-shadow-[0_0_20px_rgba(0,240,255,0.8)]",
    },
    S: {
      bg: "bg-gradient-to-br from-prime-blue to-indigo-600",
      text: "text-cyan-200",
      glow: "shadow-neon-blue drop-shadow-[0_0_15px_rgba(37,99,235,0.8)]",
    },
    A: {
      bg: "bg-gradient-to-br from-emerald-500 to-teal-700",
      text: "text-emerald-100",
      glow: "shadow-[0_0_15px_rgba(34,197,94,0.6)]",
    },
    B: {
      bg: "bg-gradient-to-br from-amber-500 to-yellow-600",
      text: "text-amber-100",
      glow: "shadow-[0_0_15px_rgba(245,158,11,0.6)]",
    },
    C: {
      bg: "bg-gradient-to-br from-slate-600 to-slate-800",
      text: "text-slate-200",
      glow: "",
    },
    D: {
      bg: "bg-gradient-to-br from-rose-700 to-red-900",
      text: "text-rose-200",
      glow: "shadow-neon-danger",
    },
  };

  const activeGradeStyle = gradeColors[grade] || gradeColors.C;
  const currentStats = getLocalPlayerStats();
  const playerLevel = getLevelFromXp(currentStats.xp);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-prime-bg/90 backdrop-blur-lg p-4 overflow-y-auto">
      <div className="max-w-2xl w-full bg-prime-surface border border-prime-border rounded-3xl p-6 sm:p-8 shadow-2xl relative my-auto">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-prime-border pb-6">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <Badge variant="cyber">{modeConfig.name}</Badge>
              <Badge
                variant={
                  difficultyId === "extreme"
                    ? "danger"
                    : difficultyId === "hard"
                    ? "warning"
                    : "primary"
                }
              >
                {diffConfig.name}
              </Badge>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-white">
              Mission Debrief
            </h2>
          </div>

          {/* Performance Grade Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase tracking-widest text-prime-muted font-bold block">
                Rank Grade
              </span>
              <span className="text-xs font-semibold text-slate-300">
                {grade === "S+"
                  ? "Apex Mastery"
                  : grade === "S"
                  ? "Superior Performance"
                  : grade === "A"
                  ? "Combat Ready"
                  : grade === "B"
                  ? "Standard Execution"
                  : "Refinement Required"}
              </span>
            </div>
            <div
              className={cn(
                "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center font-black text-3xl sm:text-4xl border-2 border-white/40 transform rotate-2",
                activeGradeStyle.bg,
                activeGradeStyle.text,
                activeGradeStyle.glow
              )}
            >
              {grade}
            </div>
          </div>
        </div>

        {/* Primary Score & XP Ticker */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-6">
          <div className="bg-prime-bg-card p-4 rounded-2xl border border-prime-blue/30 shadow-neon-blue/20 shadow-md">
            <span className="text-xs font-bold uppercase tracking-wider text-prime-blue-light">
              Final Score
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono text-white mt-1">
              {formatNumber(score)}
            </div>
          </div>

          <div className="bg-prime-bg-card p-4 rounded-2xl border border-prime-border">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-prime-muted">
                XP Earned
              </span>
              <span className="text-xs font-mono text-cyan-400">
                +{formatNumber(xpEarned)} XP
              </span>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-8 h-8 rounded-lg bg-prime-blue/20 border border-prime-blue/40 flex items-center justify-center text-xs font-bold text-prime-blue-light font-mono">
                L{playerLevel.level}
              </div>
              <div className="flex-1">
                <div className="flex justify-between text-[10px] text-prime-muted mb-1 font-mono">
                  <span>{playerLevel.title}</span>
                  <span>{playerLevel.progress}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-prime-blue to-cyan-400 rounded-full"
                    style={{ width: `${playerLevel.progress}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="bg-prime-bg-elevated/60 p-3 rounded-xl border border-prime-border">
            <div className="flex items-center gap-1.5 text-xs text-prime-muted mb-1">
              <Crosshair className="w-3.5 h-3.5 text-emerald-400" />
              <span>Accuracy</span>
            </div>
            <div className="text-xl font-bold font-mono text-emerald-400">
              {accuracy.toFixed(1)}%
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              {hits} / {shots} Hits
            </div>
          </div>

          <div className="bg-prime-bg-elevated/60 p-3 rounded-xl border border-prime-border">
            <div className="flex items-center gap-1.5 text-xs text-prime-muted mb-1">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>Best Streak</span>
            </div>
            <div className="text-xl font-bold font-mono text-cyan-300">
              {bestCombo}x
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Max Combo
            </div>
          </div>

          <div className="bg-prime-bg-elevated/60 p-3 rounded-xl border border-prime-border">
            <div className="flex items-center gap-1.5 text-xs text-prime-muted mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Criticals</span>
            </div>
            <div className="text-xl font-bold font-mono text-amber-300">
              {targetsHitByType.critical}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Bullseyes
            </div>
          </div>

          <div className="bg-prime-bg-elevated/60 p-3 rounded-xl border border-prime-border">
            <div className="flex items-center gap-1.5 text-xs text-prime-muted mb-1">
              <Clock className="w-3.5 h-3.5 text-prime-blue-light" />
              <span>Reaction</span>
            </div>
            <div className="text-xl font-bold font-mono text-white">
              {avgReactionTimeMs > 0 ? `${avgReactionTimeMs}ms` : "--"}
            </div>
            <div className="text-[10px] text-slate-400 font-mono mt-0.5">
              Avg Reflex
            </div>
          </div>
        </div>

        {/* Leaderboard Submission Form */}
        <div className="bg-prime-bg-card p-4 rounded-2xl border border-prime-border mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-white flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" />
              Post to Leaderboard
            </span>
            {submitted && (
              <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Score Recorded!
              </span>
            )}
          </div>

          <form onSubmit={handleSubmitScore} className="flex gap-2">
            <input
              type="text"
              placeholder="Callsign / Player Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              maxLength={20}
              disabled={submitted || isSubmitting}
              className="flex-1 bg-prime-bg border border-prime-border rounded-xl px-3.5 py-2 text-sm text-white placeholder-prime-muted focus:outline-none focus:border-prime-blue-light disabled:opacity-60"
            />
            <Button
              type="submit"
              variant={submitted ? "secondary" : "primary"}
              size="sm"
              disabled={!playerName.trim() || submitted || isSubmitting}
            >
              {isSubmitting ? "Submitting..." : submitted ? "Saved" : "Submit"}
            </Button>
          </form>
          {errorMessage && (
            <p className="text-xs text-red-400 mt-1">{errorMessage}</p>
          )}
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="cyber"
            size="lg"
            onClick={onRestart}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Play Again
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={onExit}
            className="flex-1 flex items-center justify-center gap-2 text-slate-200"
          >
            <Home className="w-5 h-5" />
            Main Menu
          </Button>
        </div>
      </div>
    </div>
  );
};
