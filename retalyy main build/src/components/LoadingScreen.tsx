import React, { useState, useEffect } from 'react';
import { RetalyyLogo, RetalyyIconMark } from './RetalyyLogo';

interface LoadingScreenProps {
  onFinish?: () => void;
  duration?: number;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ 
  onFinish,
  duration = 950 
}) => {
  const [progress, setProgress] = useState(12);
  const [phaseText, setPhaseText] = useState('CALIBRATING OPERATIONS ENGINE');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Step 1: Progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 98) {
          clearInterval(interval);
          return 100;
        }
        const step = prev < 50 ? 18 : prev < 85 ? 12 : 6;
        const next = Math.min(100, prev + step);
        
        if (next > 40 && next <= 75) {
          setPhaseText('SYNCHRONIZING CONTINUOUS DOUBLE-ENTRY LEDGERS');
        } else if (next > 75) {
          setPhaseText('RETALYY OPERATIONS INFRASTRUCTURE READY');
        }
        return next;
      });
    }, duration / 12);

    // Step 2: Begin fade out
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, duration);

    // Step 3: Call onFinish after fade out completes
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, duration + 450);

    return () => {
      clearInterval(interval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [duration, onFinish]);

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0C2B1C] text-white transition-all duration-500 select-none overflow-hidden ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      aria-label="Loading Retalyy platform"
    >
      {/* Background ambient lighting */}
      <div className="absolute w-[540px] h-[540px] rounded-full bg-[#27B665]/15 blur-[120px] pointer-events-none -top-24 -right-24 animate-pulse" />
      <div className="absolute w-[460px] h-[460px] rounded-full bg-[#46D279]/10 blur-[100px] pointer-events-none -bottom-24 -left-24" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      {/* Main Center Content */}
      <div className="relative z-10 flex flex-col items-center px-6 text-center max-w-md">
        
        {/* Pulsing Icon Halo */}
        <div className="relative mb-8 flex items-center justify-center">
          <div className="absolute inset-0 rounded-3xl bg-[#46D279]/20 blur-xl animate-ping" />
          <div className="relative p-3.5 rounded-2xl bg-white/5 border border-white/10 shadow-2xl backdrop-blur-md">
            <RetalyyIconMark size={52} variant="transparent" />
          </div>
        </div>

        {/* Wordmark Logo with Green Accent Glow */}
        <div className="mb-8 transform transition-transform duration-700 hover:scale-105">
          <RetalyyLogo variant="light" size="xl" animated={true} />
        </div>

        {/* Progress Bar Container */}
        <div className="w-64 sm:w-80 h-1.5 rounded-full bg-white/10 overflow-hidden relative border border-white/10 mb-4 shadow-inner">
          <div 
            className="h-full bg-gradient-to-r from-[#27B665] via-[#8EDDA6] to-[#46D279] rounded-full transition-all duration-300 relative shadow-[0_0_16px_#46D279]"
            style={{ width: `${progress}%` }}
          >
            {/* Travelling light beacon */}
            <div className="absolute right-0 top-0 bottom-0 w-3 bg-white blur-[2px] opacity-90 animate-pulse" />
          </div>
        </div>

        {/* Status Text & Telemetry Readout */}
        <div className="flex items-center justify-between w-64 sm:w-80 text-[11px] font-mono text-[#8EDDA6] mb-3">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#46D279] animate-ping" />
            <span className="truncate max-w-[200px] tracking-wide">{phaseText}</span>
          </span>
          <span className="font-bold tabular-nums text-white/90">{progress}%</span>
        </div>

        {/* Subtitle tag */}
        <div className="text-[11px] font-mono text-white/40 tracking-wider uppercase pt-3 border-t border-white/10 w-64 sm:w-80">
          Autonomous Operations Platform · Enterprise Cloud
        </div>
      </div>
    </div>
  );
};
