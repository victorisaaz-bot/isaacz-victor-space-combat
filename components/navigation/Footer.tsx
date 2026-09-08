import React from "react";
import Link from "next/link";
import { Crosshair, Shield, Zap, Sparkles } from "lucide-react";

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-prime-bg border-t border-prime-border py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-prime-blue to-cyan-500 flex items-center justify-center shadow-neon-blue">
                <Crosshair className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-widest text-white">
                PRIME <span className="text-prime-blue-light">EDGE</span>
              </span>
            </div>
            <p className="text-sm text-prime-muted max-w-sm">
              The premier browser-based arcade shooting experience. Hone your reflexes, master target tracking, and climb the global leaderboards.
            </p>
            <div className="flex items-center gap-2 text-xs text-prime-muted pt-2">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Servers Online &bull; Anti-Cheat Verified</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Game Modes
            </h4>
            <ul className="space-y-2 text-sm text-prime-muted">
              <li>
                <Link href="/play" className="hover:text-prime-blue-light transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-prime-blue-light" /> Classic Range
                </Link>
              </li>
              <li>
                <Link href="/play" className="hover:text-prime-blue-light transition-colors flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-cyan-400" /> Time Attack
                </Link>
              </li>
              <li>
                <Link href="/play" className="hover:text-prime-blue-light transition-colors flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-400" /> Survival Mode
                </Link>
              </li>
              <li>
                <Link href="/play" className="hover:text-prime-blue-light transition-colors flex items-center gap-1.5">
                  <Crosshair className="w-3.5 h-3.5 text-purple-400" /> Precision Sniper
                </Link>
              </li>
            </ul>
          </div>

          {/* System Info */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white mb-3">
              Specifications
            </h4>
            <div className="space-y-1.5 text-xs text-prime-muted">
              <div className="flex justify-between">
                <span>Rendering</span>
                <span className="text-slate-300 font-mono">60+ FPS Canvas</span>
              </div>
              <div className="flex justify-between">
                <span>Audio Engine</span>
                <span className="text-slate-300 font-mono">Web Audio Synth</span>
              </div>
              <div className="flex justify-between">
                <span>Version</span>
                <span className="text-prime-blue-light font-mono">v1.0.0 Release</span>
              </div>
              <div className="flex justify-between">
                <span>Platform</span>
                <span className="text-slate-300 font-mono">Next.js App Router</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-prime-border/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-prime-muted">
          <p>&copy; 2026 Prime Edge. All rights reserved. Purely fictional arcade entertainment.</p>
          <div className="flex gap-6">
            <Link href="/settings" className="hover:text-white transition-colors">Settings</Link>
            <Link href="/leaderboard" className="hover:text-white transition-colors">Leaderboards</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Player Stats</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
