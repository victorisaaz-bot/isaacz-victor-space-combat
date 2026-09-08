"use client";

import React, { useEffect } from "react";
import { Play, RotateCcw, Home, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { soundEngine } from "@/lib/audio/soundEngine";

interface PauseModalProps {
  onResume: () => void;
  onRestart: () => void;
  onExit: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const PauseModal: React.FC<PauseModalProps> = ({
  onResume,
  onRestart,
  onExit,
  isMuted,
  onToggleMute,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "p" || e.key === "P") {
        onResume();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onResume]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-prime-bg/85 backdrop-blur-md p-4">
      <div className="max-w-md w-full bg-prime-surface border border-prime-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-center">
        {/* Glow backdrop */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-2 bg-prime-blue-light shadow-neon-blue rounded-full" />

        <h2 className="text-3xl font-black uppercase tracking-wider text-white mb-2">
          Simulation Paused
        </h2>
        <p className="text-sm text-prime-muted mb-8">
          All targets and timers suspended. Resume whenever you are ready.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            variant="cyber"
            size="lg"
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5 fill-current" />
            Resume Simulation
          </Button>

          <Button
            variant="secondary"
            size="md"
            onClick={onRestart}
            className="w-full flex items-center justify-center gap-2 text-slate-200"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Mission
          </Button>

          <Button
            variant="outline"
            size="md"
            onClick={onToggleMute}
            className="w-full flex items-center justify-center gap-2"
          >
            {isMuted ? (
              <>
                <VolumeX className="w-4 h-4 text-red-400" />
                <span>Audio Muted (Click to Enable)</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-prime-blue-light" />
                <span>Audio Enabled (Click to Mute)</span>
              </>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onExit}
            className="w-full mt-2 text-prime-muted hover:text-white flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            Exit to Menu
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-prime-border text-[11px] text-prime-muted">
          Press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">ESC</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 font-mono text-white">P</kbd> to resume
        </div>
      </div>
    </div>
  );
};
