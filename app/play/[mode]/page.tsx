"use client";

import React from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { GameArena } from "@/components/game/GameArena";
import { DifficultyId, GameModeId } from "@/game/types";
import { GAME_MODES } from "@/game/config/modes";
import { DIFFICULTIES } from "@/game/config/difficulties";

export default function PlayModeArenaPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const modeParam = (params?.mode as string) || "classic";
  const diffParam = (searchParams.get("diff") as string) || "normal";

  const validModeId: GameModeId = GAME_MODES[modeParam]
    ? (modeParam as GameModeId)
    : "classic";

  const validDiffId: DifficultyId = DIFFICULTIES[diffParam as DifficultyId]
    ? (diffParam as DifficultyId)
    : "normal";

  const handleExitToMenu = () => {
    router.push("/play");
  };

  return (
    <div className="w-full flex-1 flex flex-col justify-center items-center">
      <GameArena
        modeId={validModeId}
        difficultyId={validDiffId}
        onExitToMenu={handleExitToMenu}
      />
    </div>
  );
}

