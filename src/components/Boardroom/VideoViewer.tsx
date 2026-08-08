'use client';

import React, { useState } from 'react';
import { FocusIndicator } from './FocusIndicator';

export const VideoViewer: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('FEED_SYNCHRONIZED');
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: 'MONITOR', action: 'FEED_SYNC' }
    }));
    setTimeout(() => setStatus(null), 2000);
  };

  const isActive = status === 'FEED_SYNCHRONIZED';

  return (
    <div className="absolute top-16 right-4 flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && <div className="text-[10px] font-mono animate-pulse uppercase text-neon-amber">{status}</div>}
      </div>
      <button
        id="boardroom-videoviewer"
        type="button"
        id="boardroom-videoviewer"
        onClick={handleAction}
        aria-label="Remote Feed / Video Monitor [V]"
        style={{ transform: 'rotateX(-20deg) rotateZ(var(--tw-rotate, 2deg)) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className={`group relative z-20 w-40 h-28 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:translate-y-1 outline-none transform-gpu`}
      >
        <FocusIndicator color={isActive ? 'neon-amber' : 'neon-red'} />
        <div className="absolute inset-1 bg-obsidian overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[size:100%_2px,3px_100%] pointer-events-none" />
          <div className={`w-full h-full animate-pulse transition-colors duration-500 ${isActive ? 'bg-gradient-to-t from-neon-amber/20 to-transparent' : 'bg-gradient-to-t from-neon-red/5 to-transparent'}`} />

          {/* Remote Guest Silhouette (Atmospheric Delight) */}
          <div className={`absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-20 transition-all ${isActive ? 'duration-1000 delay-300 opacity-40 translate-y-2' : 'duration-300 opacity-0 translate-y-10'}`}>
            <div className="w-full h-full bg-black rounded-t-[40%] blur-sm" />
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-10 bg-black rounded-full blur-sm" />
          </div>

          <div className="absolute top-2 right-2 flex items-center gap-1 opacity-60">
            <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${isActive ? 'bg-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.8)]' : 'bg-neon-red'}`} />
            <span className={`text-[8px] font-mono uppercase ${isActive ? 'text-neon-amber' : 'text-neon-red'}`}>REC</span>
          </div>
          <div className={`absolute text-[10px] font-mono tracking-widest animate-pulse ${isActive ? 'text-neon-amber' : 'text-neon-red/60'}`}>{isActive ? 'FEED_LIVE' : 'SIGNAL_WAITING...'}</div>

          {/* Remote Guest Silhouette (Atmospheric Shadow) */}
          {isActive && (
            <div className="absolute bottom-0 w-24 h-24 bg-gradient-to-t from-black/80 to-transparent opacity-40 blur-md pointer-events-none translate-y-4">
              <div className="w-12 h-12 bg-black rounded-full mx-auto" />
            </div>
          )}
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-grey-medium" />
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity uppercase whitespace-nowrap z-50">
          Monitor [V]
        </span>

      </button>
    </div>
  );
};
