"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { DifficultyId, GameModeId } from "@/game/types";
import { GAME_MODES } from "@/game/config/modes";
import { DIFFICULTIES } from "@/game/config/difficulties";
import { soundEngine } from "@/lib/audio/soundEngine";
import { CountdownOverlay } from "@/components/hud/CountdownOverlay";
import { PauseModal } from "@/components/game/PauseModal";
import { ResultsModal } from "@/components/game/ResultsModal";

interface GameArenaProps {
  modeId: GameModeId;
  difficultyId: DifficultyId;
  onExitToMenu: () => void;
}

export const GameArena: React.FC<GameArenaProps> = ({
  modeId,
  difficultyId,
  onExitToMenu,
}) => {
  const [status, setStatus] = useState<"countdown" | "playing" | "paused" | "finished">("countdown");
  const [score, setScore] = useState(0);
  const [kills, setKills] = useState(0);
  const [shots, setShots] = useState(0);
  const [hits, setHits] = useState(0);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [shield, setShield] = useState(100);
  const [hull, setHull] = useState(100);
  const [currentWave, setCurrentWave] = useState(1);
  const [weaponLevel, setWeaponLevel] = useState(1);
  const [bombsCount, setBombsCount] = useState(2);
  const [isMuted, setIsMuted] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const keysRef = useRef<Record<string, boolean>>({});

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());

    const handleKeyDown = (e: KeyboardEvent) => {
      keysRef.current[e.code] = true;
      if (e.code === "Escape" || e.code === "KeyP") {
        setStatus((prev) => (prev === "playing" ? "paused" : prev));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      keysRef.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleCountdownComplete = () => {
    setStatus("playing");
    soundEngine.startMusic();
  };

  const handleRestart = () => {
    setScore(0);
    setKills(0);
    setShots(0);
    setHits(0);
    setCombo(0);
    setShield(100);
    setHull(100);
    setCurrentWave(1);
    setStatus("countdown");
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-4rem)] min-h-[500px] bg-black overflow-hidden select-none"
    >
      <iframe
        src="/standalone.html"
        className="w-full h-full border-0"
        title="Prime Edge Space Combat"
      />

      {status === "countdown" && (
        <CountdownOverlay onComplete={handleCountdownComplete} />
      )}
    </div>
  );
};
