'use client';

import React, { useState } from 'react';

export const Laptop: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);

  const handleAccess = () => {
    if (status) return; // Prevent spamming during sequence

    setStatus('Synchronizing...');
    setIsFlashing(true);

    setTimeout(() => {
      setStatus('Authenticating...');
      setIsFlashing(false);
    }, 800);

    setTimeout(() => {
      setStatus('Terminal Synchronized');
      setIsFlashing(true);
    }, 1600);

    setTimeout(() => {
      setStatus(null);
      setIsFlashing(false);
    }, 3000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className="text-xs font-mono text-neon-red animate-pulse uppercase">
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAccess}
        aria-label="Access Terminal (Workstation)"
        style={{ transform: 'rotateX(-20deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className="group relative w-48 h-32 transition-all hover:scale-105 focus-visible:scale-105 active:translate-y-1 focus:outline-none transform-gpu"
      >
        {/* Laptop Screen (Open) */}
        <div className="absolute top-0 left-4 right-4 h-24 bg-obsidian border border-grey-medium rounded-t-sm overflow-hidden flex flex-col">
          <div className="h-1.5 bg-grey-dark border-b border-grey-medium flex items-center px-1 gap-0.5">
            <div className="w-1 h-1 rounded-full bg-neon-red/40" />
            <div className="w-1 h-1 rounded-full bg-neon-amber/40" />
          </div>
          <div className={`flex-1 p-2 font-mono text-xs text-left text-grey-medium leading-tight transition-all duration-300 ${isFlashing ? 'brightness-150' : ''}`}>
            <div className="text-neon-red opacity-80">{">"} AUTH_INIT...</div>
            <div className="mt-1 opacity-40">Loading Obelisk OS v0.1.0</div>
            <div className="mt-1 opacity-40">System Link: ACTIVE</div>
            <div className="mt-2 animate-pulse">_</div>
          </div>
          {/* Screen Glare and Data Flash */}
          <div className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none transition-opacity duration-300 ${isFlashing ? 'bg-white/20 opacity-100' : ''}`} />
        </div>

        {/* Laptop Base (Keyboard area) */}
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-grey-dark border-x border-b border-grey-medium rounded-b-sm shadow-xl [transform:rotateX(45deg)] origin-top">
          <div className="absolute inset-2 grid grid-cols-6 gap-0.5 opacity-20">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-grey-medium h-1" />
            ))}
          </div>
          <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-8 h-4 border border-grey-medium/50 rounded-sm" />
        </div>

        {/* Label hidden until focus/hover */}
        <span className="absolute -top-10 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-red opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap transition-opacity uppercase tracking-tighter">
          Terminal / IDEal / 4ward
        </span>

        {/* Focus indicator (Corners) */}
        <div className="absolute -inset-1 opacity-0 group-focus-visible:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-neon-red" />
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-neon-red" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-neon-red" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-neon-red" />
        </div>
      </button>
    </div>
  );
};
