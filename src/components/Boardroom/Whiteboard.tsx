'use client';

import React, { useState } from 'react';
import { FocusIndicator } from './FocusIndicator';

export const Whiteboard: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  const handleFocus = (e: React.FocusEvent<HTMLButtonElement>) => {
    e.currentTarget.style.setProperty('--x', '50%');
    e.currentTarget.style.setProperty('--y', '50%');
  };

  const handleAction = () => {
    setStatus('ITERATION_LOOP_LOGGED');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="absolute top-12 -left-12 flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className="text-xs font-mono text-neon-amber animate-pulse uppercase">
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onMouseMove={handleMouseMove}
        onFocus={handleFocus}
        onClick={handleAction}
        aria-label="Iteration Whiteboard (Strategy)"
        style={{ transform: 'rotateX(-20deg) rotateZ(var(--tw-rotate, -3deg)) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className="group relative z-20 w-32 h-48 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:translate-y-1 outline-none transform-gpu cursor-none"
      >
        <div className="absolute inset-2 bg-obsidian/50 border border-grey-dark p-2 overflow-hidden">
          {/* Simulated Marker Tip (Delight) */}
          <div className="absolute w-2 h-2 bg-neon-amber rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 blur-[1px] pointer-events-none transition-opacity duration-300 z-50 mix-blend-screen"
               style={{ left: 'var(--x, 50%)', top: 'var(--y, 50%)', transform: 'translate(-50%, -50%)' }} />

          {/* Voodoo Loop Sketch */}
          <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none stroke-neon-red" viewBox="0 0 100 150" fill="none">
            <path d="M50,30 Q80,30 80,60 Q80,90 50,90 Q20,90 20,60 Q20,30 50,30 Z" strokeWidth="0.5" />
            <path d="M50,90 L50,120 M40,110 L60,110" strokeWidth="0.5" />
            <circle cx="40" cy="50" r="2" fill="currentColor" />
            <circle cx="60" cy="50" r="2" fill="currentColor" />
          </svg>

          <div className="w-full h-full border-l border-b border-neon-amber/20 flex flex-col gap-2 opacity-40">
             <div className="h-0.5 w-3/4 bg-neon-amber/40" />
             <div className="h-0.5 w-1/2 bg-neon-amber/40" />
             <div className="h-0.5 w-5/6 bg-neon-amber/40" />
             <div className="mt-auto flex justify-between items-end">
               <div className="h-4 w-4 rounded-full border border-neon-red/40" />
               <div className="text-[8px] font-mono text-neon-amber/40">v2.6.0</div>
             </div>
          </div>
        </div>
        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Whiteboard
        </span>

        <FocusIndicator color="neon-amber" />
      </button>
    </div>
  );
};
