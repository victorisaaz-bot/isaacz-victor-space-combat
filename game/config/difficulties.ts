import { DifficultyConfig, DifficultyId } from "../types";

export const DIFFICULTIES: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: "easy",
    name: "Recruit",
    multiplier: 1.0,
    description: "Large targets, generous lifetimes, relaxed pace.",
    color: "#22C55E", // green
    targetRadius: 42,
    smallTargetRadius: 28,
    targetLifespanMs: 3200,
    spawnIntervalMs: 1100,
    maxSimultaneousTargets: 3,
    movingTargetSpeed: 0.4,
    movingTargetChance: 0.15,
    hazardTargetChance: 0.0,
  },
  normal: {
    id: "normal",
    name: "Operative",
    multiplier: 1.5,
    description: "Balanced target size, dynamic movement, standard timer.",
    color: "#38BDF8", // cyan/blue
    targetRadius: 34,
    smallTargetRadius: 22,
    targetLifespanMs: 2400,
    spawnIntervalMs: 850,
    maxSimultaneousTargets: 4,
    movingTargetSpeed: 0.8,
    movingTargetChance: 0.35,
    hazardTargetChance: 0.1,
  },
  hard: {
    id: "hard",
    name: "Elite",
    multiplier: 2.2,
    description: "Smaller targets, fast kinetic drift, hazards, tight windows.",
    color: "#F59E0B", // amber
    targetRadius: 26,
    smallTargetRadius: 17,
    targetLifespanMs: 1600,
    spawnIntervalMs: 600,
    maxSimultaneousTargets: 5,
    movingTargetSpeed: 1.3,
    movingTargetChance: 0.55,
    hazardTargetChance: 0.2,
  },
  extreme: {
    id: "extreme",
    name: "Prime Edge",
    multiplier: 3.2,
    description: "Hyper-speed reflex combat, micro-targets, erratic trajectories.",
    color: "#EF4444", // red
    targetRadius: 20,
    smallTargetRadius: 13,
    targetLifespanMs: 1100,
    spawnIntervalMs: 420,
    maxSimultaneousTargets: 6,
    movingTargetSpeed: 2.0,
    movingTargetChance: 0.75,
    hazardTargetChance: 0.3,
  },
};
