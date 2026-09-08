"use client";

import React, { useState, useEffect } from "react";
import {
  Volume2,
  VolumeX,
  Crosshair,
  Sliders,
  Sparkles,
  Keyboard,
  RotateCcw,
  CheckCircle2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { soundEngine } from "@/lib/audio/soundEngine";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  const [isMuted, setIsMuted] = useState(false);
  const [sfxVol, setSfxVol] = useState(0.8);
  const [musicVol, setMusicVol] = useState(0.4);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [screenShake, setScreenShake] = useState(true);

  // Crosshair Customization State
  const [crosshair, setCrosshair] = useState({
    shape: "cross",
    color: "#38BDF8",
    size: 24,
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
    setSfxVol(soundEngine.getSfxVolume());
    setMusicVol(soundEngine.getMusicVolume());

    if (typeof window !== "undefined") {
      const savedCh = localStorage.getItem("prime_edge_crosshair");
      if (savedCh) {
        try {
          setCrosshair(JSON.parse(savedCh));
        } catch (e) {}
      }

      const savedMotion = localStorage.getItem("prime_edge_reduced_motion");
      if (savedMotion !== null) setReducedMotion(savedMotion === "true");

      const savedShake = localStorage.getItem("prime_edge_screenshake");
      if (savedShake !== null) setScreenShake(savedShake === "true");
    }
  }, []);

  const handleMuteToggle = (muted: boolean) => {
    setIsMuted(muted);
    soundEngine.setMuted(muted);
  };

  const handleSfxChange = (vol: number) => {
    setSfxVol(vol);
    soundEngine.setSfxVolume(vol);
    soundEngine.playHit();
  };

  const handleMusicChange = (vol: number) => {
    setMusicVol(vol);
    soundEngine.setMusicVolume(vol);
  };

  const handleSaveCrosshair = (newSettings: typeof crosshair) => {
    setCrosshair(newSettings);
    if (typeof window !== "undefined") {
      localStorage.setItem("prime_edge_crosshair", JSON.stringify(newSettings));
    }
    soundEngine.playCritical();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleClearData = () => {
    if (confirm("Are you sure you want to reset all local statistics and match records? This action cannot be undone.")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("prime_edge_player_stats_v1");
        alert("Career statistics have been reset.");
        window.location.reload();
      }
    }
  };

  const crosshairColors = [
    { name: "Cyber Blue", hex: "#38BDF8" },
    { name: "Neon Cyan", hex: "#00F0FF" },
    { name: "Tactical Green", hex: "#22C55E" },
    { name: "Pure White", hex: "#FFFFFF" },
    { name: "Amber Orange", hex: "#F59E0B" },
    { name: "Danger Red", hex: "#EF4444" },
  ];

  const crosshairShapes = [
    { id: "cross", name: "Tactical Cross" },
    { id: "dot", name: "Precision Dot" },
    { id: "circle", name: "Target Ring" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-prime-blue/15 border border-prime-blue/40 text-xs font-bold text-prime-blue-light uppercase tracking-wider mb-3">
          <Sliders className="w-3.5 h-3.5" />
          <span>System Preferences</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
          Settings & Customization
        </h1>
        <p className="text-sm text-prime-muted mt-2">
          Fine-tune audio levels, customize reticle optics, and configure input parameters.
        </p>
      </div>

      <div className="space-y-6">
        {/* Audio Synthesis Settings */}
        <Card className="p-6 bg-prime-surface border-prime-border">
          <div className="flex items-center gap-2.5 mb-6">
            <Volume2 className="w-5 h-5 text-prime-blue-light" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              Audio Synthesis Controls
            </h2>
          </div>

          <div className="space-y-6">
            {/* Master Audio Toggle */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm block">Master Audio</span>
                <span className="text-xs text-prime-muted">Enable or disable all procedural sound synthesizers.</span>
              </div>
              <Button
                variant={isMuted ? "secondary" : "cyber"}
                size="sm"
                onClick={() => handleMuteToggle(!isMuted)}
              >
                {isMuted ? (
                  <span className="text-red-400 flex items-center gap-1.5"><VolumeX className="w-4 h-4" /> Muted</span>
                ) : (
                  <span className="flex items-center gap-1.5"><Volume2 className="w-4 h-4" /> Active</span>
                )}
              </Button>
            </div>

            {/* SFX Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-bold">Sound Effects Volume</span>
                <span className="text-prime-blue-light">{Math.round(sfxVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={sfxVol}
                onChange={(e) => handleSfxChange(parseFloat(e.target.value))}
                className="w-full accent-prime-blue bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>

            {/* Music Ambience Volume */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-white font-bold">Ambient Synth Pulse Volume</span>
                <span className="text-cyan-400">{Math.round(musicVol * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={musicVol}
                onChange={(e) => handleMusicChange(parseFloat(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
              />
            </div>
          </div>
        </Card>

        {/* Reticle / Crosshair Optics */}
        <Card className="p-6 bg-prime-surface border-prime-border">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2.5">
              <Crosshair className="w-5 h-5 text-cyan-400" />
              <h2 className="text-lg font-bold uppercase tracking-wider text-white">
                Reticle & Crosshair Optics
              </h2>
            </div>
            {savedSuccess && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Optic Saved
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Left: Options */}
            <div className="space-y-5">
              {/* Color Picker */}
              <div>
                <label className="text-xs font-bold text-prime-muted uppercase block mb-2">
                  Reticle Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {crosshairColors.map((c) => (
                    <button
                      key={c.hex}
                      onClick={() => handleSaveCrosshair({ ...crosshair, color: c.hex })}
                      className={cn(
                        "w-8 h-8 rounded-full border-2 transition-transform active:scale-95 flex items-center justify-center",
                        crosshair.color === c.hex ? "border-white scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100"
                      )}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-white font-bold">Reticle Diameter</span>
                  <span className="text-prime-blue-light">{crosshair.size}px</span>
                </div>
                <input
                  type="range"
                  min="16"
                  max="44"
                  step="2"
                  value={crosshair.size}
                  onChange={(e) => handleSaveCrosshair({ ...crosshair, size: parseInt(e.target.value) })}
                  className="w-full accent-prime-blue bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
              </div>
            </div>

            {/* Right: Interactive Reticle Preview Box */}
            <div className="bg-prime-bg-card border border-prime-border rounded-2xl h-48 flex flex-col items-center justify-center relative overflow-hidden">
              <span className="text-[10px] text-prime-muted font-mono uppercase absolute top-2 left-3">
                Live Reticle Target Preview
              </span>

              {/* Mock Target Ring */}
              <div className="w-24 h-24 rounded-full border-2 border-prime-blue/40 bg-prime-blue/10 flex items-center justify-center relative animate-pulse">
                <div className="w-8 h-8 rounded-full bg-cyan-400/30" />

                {/* Reticle Render */}
                <div
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{ width: `${crosshair.size}px`, height: `${crosshair.size}px` }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: crosshair.color, boxShadow: `0 0 8px ${crosshair.color}` }}
                  />
                  <div className="absolute -top-2 w-0.5 h-2" style={{ backgroundColor: crosshair.color }} />
                  <div className="absolute -bottom-2 w-0.5 h-2" style={{ backgroundColor: crosshair.color }} />
                  <div className="absolute -left-2 h-0.5 w-2" style={{ backgroundColor: crosshair.color }} />
                  <div className="absolute -right-2 h-0.5 w-2" style={{ backgroundColor: crosshair.color }} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Input & Keybinds Legend */}
        <Card className="p-6 bg-prime-surface border-prime-border">
          <div className="flex items-center gap-2.5 mb-4">
            <Keyboard className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold uppercase tracking-wider text-white">
              Tactical Keybinds & Controls
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="flex items-center justify-between p-3 rounded-xl bg-prime-bg border border-prime-border">
              <span className="text-prime-muted">Aim & Acquire</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700">Mouse / Pointer</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-prime-bg border border-prime-border">
              <span className="text-prime-muted">Fire Weapon</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700">Left Click / Tap</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-prime-bg border border-prime-border">
              <span className="text-prime-muted">Tactical Reload</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700">[R] / Space</kbd>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-prime-bg border border-prime-border">
              <span className="text-prime-muted">Pause Simulation</span>
              <kbd className="px-2 py-1 rounded bg-slate-800 text-white border border-slate-700">[Esc] / [P]</kbd>
            </div>
          </div>
        </Card>

        {/* Danger Zone: Reset Data */}
        <Card className="p-6 bg-prime-surface border-red-500/30">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <span className="font-bold text-red-400 text-sm block">Reset Simulation Career Data</span>
              <span className="text-xs text-prime-muted">Clears all saved match histories, XP ranks, and local records.</span>
            </div>
            <Button variant="danger" size="sm" onClick={handleClearData} className="flex items-center gap-1.5">
              <Trash2 className="w-4 h-4" /> Reset Career Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

