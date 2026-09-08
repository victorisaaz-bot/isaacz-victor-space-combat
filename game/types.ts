export type GameStatus = "idle" | "countdown" | "playing" | "paused" | "finished";

export type GameModeId = "classic" | "time-attack" | "survival" | "precision";

export type DifficultyId = "easy" | "normal" | "hard" | "extreme";

export type TargetType = "standard" | "small" | "critical" | "moving" | "hazard";

export interface Target {
  id: string;
  x: number; // 0 to 100 percentage in arena
  y: number; // 0 to 100 percentage in arena
  radius: number; // size in percentage or pixels
  type: TargetType;
  speed: number;
  vx: number;
  vy: number;
  createdAt: number;
  duration: number; // lifespan in milliseconds
  maxDuration: number;
  points: number;
  isHit?: boolean;
}

export interface FloatingPoint {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  createdAt: number;
  duration: number;
  isCritical?: boolean;
}

export interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
}

export interface GameModeConfig {
  id: GameModeId;
  name: string;
  tagline: string;
  description: string;
  badge: string;
  iconName: string;
  defaultDuration: number; // in seconds (e.g. 45)
  targetScoreGoal?: number; // for time-attack
  hasHealth?: boolean; // for survival
  maxHealth?: number;
  hasAmmo?: boolean;
  maxAmmo?: number;
  reloadTime?: number; // ms
  precisionRequired?: boolean;
  scoringRules: {
    baseHit: number;
    smallHit: number;
    criticalHit: number;
    comboStepBonus: number;
    missPenalty: number;
    hazardPenalty: number;
  };
}

export interface DifficultyConfig {
  id: DifficultyId;
  name: string;
  multiplier: number;
  description: string;
  color: string;
  targetRadius: number; // standard target radius in px
  smallTargetRadius: number;
  targetLifespanMs: number;
  spawnIntervalMs: number;
  maxSimultaneousTargets: number;
  movingTargetSpeed: number;
  movingTargetChance: number;
  hazardTargetChance: number;
}

export interface GameState {
  status: GameStatus;
  mode: GameModeId;
  difficulty: DifficultyId;
  score: number;
  shots: number;
  hits: number;
  combo: number;
  bestCombo: number;
  timeRemaining: number;
  maxDuration: number;
  health: number;
  maxHealth: number;
  ammo: number;
  maxAmmo: number;
  isReloading: boolean;
  targetsHitByType: {
    standard: number;
    small: number;
    critical: number;
    hazard: number;
  };
  reactionTimes: number[];
}

export interface ScoreSubmissionPayload {
  mode: GameModeId;
  difficulty: DifficultyId;
  displayName: string;
  score: number;
  shots: number;
  hits: number;
  accuracy: number;
  bestCombo: number;
  duration: number;
  targetsHit: {
    standard: number;
    small: number;
    critical: number;
  };
  avgReactionTimeMs: number;
}

export interface LeaderboardEntry {
  id: string;
  playerId: string;
  displayName: string;
  mode: GameModeId;
  difficulty: DifficultyId;
  score: number;
  accuracy: number;
  bestCombo: number;
  duration: number;
  grade: "S+" | "S" | "A" | "B" | "C" | "D";
  createdAt: string;
}

export interface MatchHistoryItem {
  id: string;
  mode: GameModeId;
  difficulty: DifficultyId;
  score: number;
  accuracy: number;
  bestCombo: number;
  grade: "S+" | "S" | "A" | "B" | "C" | "D";
  date: string;
}

export interface PlayerStats {
  displayName: string;
  totalGames: number;
  totalShots: number;
  totalHits: number;
  globalAccuracy: number;
  totalScore: number;
  bestScore: number;
  bestCombo: number;
  favoriteMode: GameModeId;
  level: number;
  xp: number;
  matchHistory: MatchHistoryItem[];
}
