import { DifficultyId, GameModeId } from "../types";
import { GAME_MODES } from "../config/modes";
import { DIFFICULTIES } from "../config/difficulties";

export interface HitCalculationResult {
  points: number;
  isCritical: boolean;
  isSmall: boolean;
  isHazard: boolean;
  multiplier: number;
  newCombo: number;
}

export function calculateHitScore(
  modeId: GameModeId,
  difficultyId: DifficultyId,
  targetType: "standard" | "small" | "critical" | "moving" | "hazard",
  distanceFromCenterRatio: number, // 0 = exact dead center (critical), 1 = target edge
  currentCombo: number
): HitCalculationResult {
  const mode = GAME_MODES[modeId] || GAME_MODES.classic;
  const diff = DIFFICULTIES[difficultyId] || DIFFICULTIES.normal;

  if (targetType === "hazard") {
    return {
      points: -mode.scoringRules.hazardPenalty,
      isCritical: false,
      isSmall: false,
      isHazard: true,
      multiplier: 1,
      newCombo: 0, // resets combo
    };
  }

  const isSmall = targetType === "small";
  const isCritical = distanceFromCenterRatio <= 0.35 || targetType === "critical";

  let base = mode.scoringRules.baseHit;
  if (isCritical) {
    base = mode.scoringRules.criticalHit;
  } else if (isSmall) {
    base = mode.scoringRules.smallHit;
  }

  const newCombo = currentCombo + 1;
  const comboTierMultiplier = 1 + Math.min(newCombo, 50) * 0.1; // +10% per combo step, capped
  const difficultyMultiplier = diff.multiplier;

  const points = Math.round(base * comboTierMultiplier * difficultyMultiplier);

  return {
    points,
    isCritical,
    isSmall,
    isHazard: false,
    multiplier: Math.round(comboTierMultiplier * difficultyMultiplier * 10) / 10,
    newCombo,
  };
}

export function calculateAccuracy(hits: number, shots: number): number {
  if (shots <= 0) return 0;
  return Math.min(100, Math.max(0, Math.round((hits / shots) * 1000) / 10));
}

export function determineGrade(
  accuracy: number,
  score: number,
  bestCombo: number,
  modeId: GameModeId
): "S+" | "S" | "A" | "B" | "C" | "D" {
  if (accuracy >= 95 && bestCombo >= 15 && score >= 8000) return "S+";
  if (accuracy >= 90 && score >= 6000) return "S";
  if (accuracy >= 80 && score >= 4000) return "A";
  if (accuracy >= 68 && score >= 2500) return "B";
  if (accuracy >= 50) return "C";
  return "D";
}

export function calculateXpEarned(score: number, accuracy: number, grade: string): number {
  const gradeBonus = grade === "S+" ? 2.0 : grade === "S" ? 1.6 : grade === "A" ? 1.3 : grade === "B" ? 1.1 : 1.0;
  const accuracyBonus = 1 + accuracy / 100;
  return Math.round((score / 15) * gradeBonus * accuracyBonus);
}

export function getLevelFromXp(totalXp: number): { level: number; progress: number; currentXp: number; nextLevelXp: number; title: string } {
  const titles = [
    "Rookie Marksman",
    "Cyber Scout",
    "Range Specialist",
    "Sharpshooter",
    "Deadshot Operative",
    "Elite Vanguard",
    "Prime Ghost",
    "Apex Assassin",
    "Edge Legend",
    "Grandmaster Apex",
  ];

  let level = 1;
  let xpNeeded = 500;
  let accumulated = 0;

  while (totalXp >= accumulated + xpNeeded && level < 100) {
    accumulated += xpNeeded;
    level++;
    xpNeeded = Math.round(500 * Math.pow(1.22, level - 1));
  }

  const currentLevelProgressXp = Math.max(0, totalXp - accumulated);
  const progress = Math.min(100, Math.round((currentLevelProgressXp / xpNeeded) * 100));
  const titleIndex = Math.min(titles.length - 1, Math.floor((level - 1) / 2));

  return {
    level,
    progress,
    currentXp: currentLevelProgressXp,
    nextLevelXp: xpNeeded,
    title: titles[titleIndex],
  };
}
