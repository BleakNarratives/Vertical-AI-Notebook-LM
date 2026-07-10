'use client';

import React, { useState } from 'react';

export const VideoViewer: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('FEED_SYNCHRONIZED');
    setTimeout(() => setStatus(null), 2000);
  };

  const isActive = status === 'FEED_SYNCHRONIZED';

  return (
    <div className="absolute top-16 -right-12 flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className={`text-xs font-mono animate-pulse uppercase ${isActive ? 'text-neon-amber' : 'text-neon-red'}`}>
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAction}
        aria-label="Remote Feed / Video Monitor"
        style={{ transform: 'rotateX(-20deg) rotateZ(var(--tw-rotate, 2deg)) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className={`group relative z-20 w-40 h-28 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:translate-y-1 focus-visible:ring-2 outline-none transform-gpu ${isActive ? 'focus-visible:ring-neon-amber' : 'focus-visible:ring-neon-red'}`}
      >
        <div className="absolute inset-1 bg-obsidian overflow-hidden flex items-center justify-center">
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[size:100%_2px,3px_100%] pointer-events-none" />

          <div className={`w-full h-full animate-pulse transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-neon-amber/20 to-transparent' : 'bg-gradient-to-t from-neon-red/5 to-transparent'}`} />

          {/* REC indicator */}
          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-60">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse transition-colors duration-500 ${isActive ? 'bg-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.8)]' : 'bg-neon-red'}`} />
            <span className={`text-[8px] font-mono uppercase transition-colors duration-500 ${isActive ? 'text-neon-amber' : 'text-neon-red'}`}>REC</span>
          </div>

          <div className={`absolute text-[10px] font-mono tracking-widest animate-pulse transition-colors duration-500 ${isActive ? 'text-neon-amber' : 'text-neon-red/60'}`}>
            {isActive ? 'FEED_LIVE' : 'SIGNAL_WAITING...'}
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-grey-medium" />
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Monitor
        </span>
      </button>
    </div>
  );
};
