'use client';

import React, { useState } from 'react';

export const VideoViewer: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('FEED_RECONNECTED');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="absolute top-16 -right-12 flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className="text-xs font-mono text-neon-red animate-pulse uppercase">
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAction}
        aria-label="Remote Feed / Video Monitor"
        style={{ transform: 'rotateX(-20deg) rotateZ(2deg)' }}
        className="group relative z-20 w-40 h-28 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neon-red outline-none transform-gpu"
      >
        <div className="absolute inset-1 bg-obsidian overflow-hidden flex items-center justify-center">
          {/* CRT Scanline Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none z-10" />

          <div className={`w-full h-full bg-gradient-to-t animate-pulse ${status ? 'from-neon-amber/20' : 'from-neon-red/5'} to-transparent`} />

          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 opacity-60 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity">
            <div className={`text-[10px] font-mono tracking-widest animate-pulse ${status ? 'text-neon-amber' : 'text-neon-red'}`}>
              {status ? 'FEED_LIVE' : 'SIGNAL_WAITING...'}
            </div>
            <div className={`text-[8px] font-mono uppercase tracking-tighter opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity ${status ? 'text-neon-amber' : 'text-grey-medium'}`}>
              {status ? 'REMOTE_LINK: ACTIVE' : 'REMOTE_LINK: IDLE'}
            </div>
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-grey-medium" />
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-red opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Video Monitor
        </span>
      </button>
    </div>
  );
};
