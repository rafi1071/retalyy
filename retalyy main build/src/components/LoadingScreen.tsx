import React, { useState, useEffect } from 'react';
import { RetalyyIconMark } from './RetalyyLogo';

interface LoadingScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onFinish, duration = 950 }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [go, setGo] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => setGo(true), 30);
    const fadeTimer = setTimeout(() => setIsFadingOut(true), duration);
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration + 450);
    return () => {
      clearTimeout(startTimer);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-[#07100C] transition-opacity duration-500 select-none ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-label="Loading Retalyy"
    >
      <div className="flex flex-col items-center gap-7">
        <div className="relative">
          <div className="absolute inset-0 -m-6 rounded-full bg-[#46D279]/20 blur-2xl animate-pulse" />
          <div className="relative" style={{ animation: 'rtFadeUp .8s cubic-bezier(.16,1,.3,1) both' }}>
            <RetalyyIconMark size={46} variant="transparent" />
          </div>
        </div>
        <div className="w-28 h-px bg-white/10 overflow-hidden relative">
          <div
            className="absolute inset-y-0 left-0 bg-[#46D279]"
            style={{ width: '100%', transform: go ? 'translateX(0)' : 'translateX(-100%)', transition: `transform ${duration}ms cubic-bezier(.16,1,.3,1)` }}
          />
        </div>
      </div>
    </div>
  );
};
