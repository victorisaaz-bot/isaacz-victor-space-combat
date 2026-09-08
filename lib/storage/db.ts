import { LeaderboardEntry, ScoreSubmissionPayload, PlayerStats, MatchHistoryItem } from "@/game/types";
import { determineGrade } from "@/game/scoring/calculator";

// Seeded sample competitive leaderboard entries
const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: "lb-1",
    playerId: "p-apex",
    displayName: "Valkyrie_99",
    mode: "classic",
    difficulty: "extreme",
    score: 18450,
    accuracy: 98.2,
    bestCombo: 42,
    duration: 45,
    grade: "S+",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "lb-2",
    playerId: "p-ghost",
    displayName: "CyberGhost",
    mode: "classic",
    difficulty: "hard",
    score: 15200,
    accuracy: 96.5,
    bestCombo: 34,
    duration: 45,
    grade: "S+",
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
  },
  {
    id: "lb-3",
    playerId: "p-neo",
    displayName: "NeoSniper",
    mode: "precision",
    difficulty: "extreme",
    score: 14800,
    accuracy: 100.0,
    bestCombo: 28,
    duration: 40,
    grade: "S+",
    createdAt: new Date(Date.now() - 3600000 * 20).toISOString(),
  },
  {
    id: "lb-4",
    playerId: "p-blaze",
    displayName: "BlazeTrigger",
    mode: "survival",
    difficulty: "hard",
    score: 13950,
    accuracy: 94.0,
    bestCombo: 29,
    duration: 72,
    grade: "S",
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: "lb-5",
    playerId: "p-pulse",
    displayName: "PulseRider",
    mode: "time-attack",
    difficulty: "normal",
    score: 11400,
    accuracy: 91.2,
    bestCombo: 22,
    duration: 30,
    grade: "S",
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: "lb-6",
    playerId: "p-shadow",
    displayName: "ShadowStrike",
    mode: "classic",
    difficulty: "normal",
    score: 9800,
    accuracy: 88.5,
    bestCombo: 19,
    duration: 45,
    grade: "A",
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: "lb-7",
    playerId: "p-vector",
    displayName: "VectorAim",
    mode: "precision",
    difficulty: "hard",
    score: 9200,
    accuracy: 92.4,
    bestCombo: 18,
    duration: 40,
    grade: "A",
    createdAt: new Date(Date.now() - 3600000 * 54).toISOString(),
  },
];

// Global in-memory cache for server API runtime
let globalLeaderboard: LeaderboardEntry[] = [...INITIAL_LEADERBOARD];

export function getLeaderboardEntries(filters?: {
  mode?: string;
  difficulty?: string;
  timeframe?: "all" | "weekly" | "today";
}): LeaderboardEntry[] {
  let entries = [...globalLeaderboard];

  if (filters?.mode && filters.mode !== "all") {
    entries = entries.filter((e) => e.mode === filters.mode);
  }

  if (filters?.difficulty && filters.difficulty !== "all") {
    entries = entries.filter((e) => e.difficulty === filters.difficulty);
  }

  if (filters?.timeframe === "today") {
    const dayAgo = Date.now() - 24 * 3600 * 1000;
    entries = entries.filter((e) => new Date(e.createdAt).getTime() >= dayAgo);
  } else if (filters?.timeframe === "weekly") {
    const weekAgo = Date.now() - 7 * 24 * 3600 * 1000;
    entries = entries.filter((e) => new Date(e.createdAt).getTime() >= weekAgo);
  }

  // Sort descending by score, then accuracy
  return entries.sort((a, b) => b.score - a.score || b.accuracy - a.accuracy);
}

export function submitScoreEntry(payload: ScoreSubmissionPayload): { success: boolean; entry?: LeaderboardEntry; error?: string } {
  // Server-side anti-tamper validation
  if (!payload.displayName || payload.displayName.trim().length === 0) {
    return { success: false, error: "Display name is required" };
  }

  if (payload.shots < 0 || payload.hits < 0 || payload.hits > payload.shots) {
    return { success: false, error: "Invalid shot/hit balance ratio" };
  }

  if (payload.score < 0 || payload.score > 200000) {
    return { success: false, error: "Score outside legitimate boundary" };
  }

  const calculatedAccuracy = payload.shots > 0 ? (payload.hits / payload.shots) * 100 : 0;
  if (Math.abs(calculatedAccuracy - payload.accuracy) > 2.0) {
    return { success: false, error: "Accuracy anomaly detected" };
  }

  const grade = determineGrade(payload.accuracy, payload.score, payload.bestCombo, payload.mode);

  const newEntry: LeaderboardEntry = {
    id: "lb-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    playerId: "player-local",
    displayName: payload.displayName.trim().slice(0, 24),
    mode: payload.mode,
    difficulty: payload.difficulty,
    score: payload.score,
    accuracy: payload.accuracy,
    bestCombo: payload.bestCombo,
    duration: payload.duration,
    grade,
    createdAt: new Date().toISOString(),
  };

  globalLeaderboard.unshift(newEntry);

  return { success: true, entry: newEntry };
}

// Player Local Storage Helper (client-side)
const LOCAL_STORAGE_STATS_KEY = "prime_edge_player_stats_v1";

export function getLocalPlayerStats(): PlayerStats {
  if (typeof window === "undefined") {
    return getDefaultStats();
  }

  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    if (!raw) return getDefaultStats();
    return JSON.parse(raw);
  } catch (e) {
    return getDefaultStats();
  }
}

export function saveLocalPlayerMatch(
  payload: ScoreSubmissionPayload,
  xpEarned: number
): PlayerStats {
  const current = getLocalPlayerStats();
  const grade = determineGrade(payload.accuracy, payload.score, payload.bestCombo, payload.mode);

  const matchItem: MatchHistoryItem = {
    id: "m-" + Date.now(),
    mode: payload.mode,
    difficulty: payload.difficulty,
    score: payload.score,
    accuracy: payload.accuracy,
    bestCombo: payload.bestCombo,
    grade,
    date: new Date().toISOString(),
  };

  const totalGames = current.totalGames + 1;
  const totalShots = current.totalShots + payload.shots;
  const totalHits = current.totalHits + payload.hits;
  const globalAccuracy = totalShots > 0 ? Math.round((totalHits / totalShots) * 1000) / 10 : 0;
  const totalScore = current.totalScore + payload.score;
  const bestScore = Math.max(current.bestScore, payload.score);
  const bestCombo = Math.max(current.bestCombo, payload.bestCombo);
  const newXp = current.xp + xpEarned;

  const history = [matchItem, ...(current.matchHistory || [])].slice(0, 50);

  // Compute favorite mode
  const modeCounts: Record<string, number> = {};
  history.forEach((h) => {
    modeCounts[h.mode] = (modeCounts[h.mode] || 0) + 1;
  });
  let favoriteMode = payload.mode;
  let maxCount = 0;
  Object.entries(modeCounts).forEach(([m, count]) => {
    if (count > maxCount) {
      maxCount = count;
      favoriteMode = m as any;
    }
  });

  const updated: PlayerStats = {
    displayName: payload.displayName || current.displayName || "Marksman",
    totalGames,
    totalShots,
    totalHits,
    globalAccuracy,
    totalScore,
    bestScore,
    bestCombo,
    favoriteMode,
    level: Math.floor(Math.sqrt(newXp / 250)) + 1,
    xp: newXp,
    matchHistory: history,
  };

  if (typeof window !== "undefined") {
    localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(updated));
  }

  return updated;
}

function getDefaultStats(): PlayerStats {
  return {
    displayName: "Marksman",
    totalGames: 0,
    totalShots: 0,
    totalHits: 0,
    globalAccuracy: 0,
    totalScore: 0,
    bestScore: 0,
    bestCombo: 0,
    favoriteMode: "classic",
    level: 1,
    xp: 0,
    matchHistory: [],
  };
}
