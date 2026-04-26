'use client';

import React from 'react';

export const VideoViewer: React.FC = () => {
  return (
    <button
      aria-label="Remote Feed / Video Monitor"
      className="absolute top-16 -right-12 w-40 h-28 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-neon-red outline-none rotate-2"
    >
      <div className="absolute inset-1 bg-obsidian overflow-hidden flex items-center justify-center">
        <div className="w-full h-full bg-gradient-to-t from-neon-red/5 to-transparent animate-pulse" />
        <div className="absolute text-[8px] font-mono text-neon-red/60 tracking-widest animate-pulse">
          SIGNAL_WAITING...
        </div>
      </div>
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-4 h-1 bg-grey-medium" />
      <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-grey-medium opacity-0 hover:opacity-100 transition-opacity uppercase">
        Monitor
      </span>
    </button>
  );
};
