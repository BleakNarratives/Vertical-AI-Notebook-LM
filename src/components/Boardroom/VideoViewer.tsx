'use client';

import React, { useState } from 'react';

export const VideoViewer: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('Connection Established');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="absolute top-16 -right-12 flex flex-col items-center gap-2">
      {status && (
        <div aria-live="polite" className="text-[10px] font-mono text-neon-red animate-pulse uppercase">
          {status}
        </div>
      )}
      <button
        type="button"
        onClick={handleAction}
        aria-label="Remote Feed / Video Monitor"
        className="group relative z-20 w-40 h-28 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neon-red outline-none rotate-2"
      >
        <div className="absolute inset-1 bg-obsidian overflow-hidden flex items-center justify-center">
          <div className="w-full h-full bg-gradient-to-t from-neon-red/5 to-transparent animate-pulse" />
          <div className="absolute text-[10px] font-mono text-neon-red/60 tracking-widest animate-pulse">
            SIGNAL_WAITING...
          </div>
        </div>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-grey-medium" />
        <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Monitor
        </span>
      </button>
    </div>
  );
};
