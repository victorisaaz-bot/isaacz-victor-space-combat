"use client";

import React, { useEffect, useState } from "react";
import { soundEngine } from "@/lib/audio/soundEngine";

interface CountdownOverlayProps {
  onComplete: () => void;
  startCount?: number;
}

export const CountdownOverlay: React.FC<CountdownOverlayProps> = ({
  onComplete,
  startCount = 3,
}) => {
  const [count, setCount] = useState<number | string>(startCount);

  useEffect(() => {
    let current = startCount;
    soundEngine.playCountdown();

    const timer = setInterval(() => {
      current--;
      if (current > 0) {
        setCount(current);
        soundEngine.playCountdown();
      } else if (current === 0) {
        setCount("GO!");
        soundEngine.playGo();
      } else {
        clearInterval(timer);
        onComplete();
      }
    }, 850);

    return () => clearInterval(timer);
  }, [onComplete, startCount]);

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-prime-bg/75 backdrop-blur-sm pointer-events-none select-none">
      <div className="text-center">
        <div className="text-xs uppercase tracking-[0.4em] text-prime-blue-light font-bold mb-3 animate-pulse">
          Prepare Weapons
        </div>
        <div
          key={String(count)}
          className={`font-black tracking-tighter animate-ping-once transition-transform ${
            count === "GO!"
              ? "text-7xl sm:text-9xl text-cyan-400 drop-shadow-[0_0_40px_rgba(0,240,255,0.9)] scale-110"
              : "text-8xl sm:text-9xl text-white drop-shadow-[0_0_30px_rgba(37,99,235,0.9)]"
          }`}
        >
          {count}
        </div>
      </div>
    </div>
  );
};
