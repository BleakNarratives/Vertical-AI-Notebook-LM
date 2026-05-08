'use client';

import React, { useState } from 'react';

export const Whiteboard: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('Strategy Updated');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="absolute top-12 -left-12 flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center">
        {status && (
          <div aria-live="polite" className="text-xs font-mono text-neon-amber animate-pulse uppercase">
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAction}
        aria-label="Iteration Whiteboard (Strategy)"
        style={{ transform: 'rotateX(-20deg) rotateZ(-3deg)' }}
        className="group relative z-20 w-32 h-48 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neon-amber outline-none transform-gpu"
      >
        <div className="absolute inset-2 bg-obsidian/50 border border-grey-dark p-2 overflow-hidden">
          <div className="w-full h-full border-l border-b border-neon-amber/20 flex flex-col gap-2 opacity-40">
             <div className="h-0.5 w-3/4 bg-neon-amber/40" />
             <div className="h-0.5 w-1/2 bg-neon-amber/40" />
             <div className="h-0.5 w-5/6 bg-neon-amber/40" />
             <div className="mt-auto h-4 w-4 rounded-full border border-neon-red/40" />
          </div>
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Whiteboard
        </span>
      </button>
    </div>
  );
};
