'use client';

import React, { useState } from 'react';

export const Whiteboard: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    e.currentTarget.style.setProperty('--x', `${x}%`);
    e.currentTarget.style.setProperty('--y', `${y}%`);
  };

  const handleAction = () => {
    setStatus('Strategy Updated');
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
        onClick={handleAction}
        aria-label="Iteration Whiteboard (Strategy)"
        style={{ transform: 'rotateX(-20deg) rotateZ(-3deg)' }}
        className="group relative z-20 w-32 h-48 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:scale-105 active:scale-95 focus-visible:ring-2 focus-visible:ring-neon-amber outline-none transform-gpu hover:cursor-none"
      >
        <div className="absolute inset-2 bg-obsidian/50 border border-grey-dark p-3 overflow-hidden select-none">
          {/* Simulated Marker Tip (Delight) */}
          <div className="absolute w-2 h-2 bg-neon-amber rounded-full opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 blur-[1px] pointer-events-none transition-opacity duration-300 z-50 mix-blend-screen"
               style={{ left: 'var(--x, 50%)', top: 'var(--y, 50%)', transform: 'translate(-50%, -50%)' }} />

          {/* Iteration Sketches (Boardroom Drawings) */}
          <div className="w-full h-full border-l border-b border-neon-amber/20 flex flex-col gap-2 opacity-40 group-hover:opacity-60 transition-opacity">
             <div className="space-y-1">
                <div className="h-0.5 w-3/4 bg-neon-amber/40" />
                <div className="h-0.5 w-1/2 bg-neon-amber/40" />
             </div>

             {/* Flowchart sketch */}
             <div className="flex items-center gap-2">
                <div className="w-6 h-6 border border-neon-amber/40 rounded-sm" />
                <div className="w-4 h-[1px] bg-neon-amber/40" />
                <div className="w-6 h-6 border border-neon-amber/40 rotate-45" />
             </div>

             {/* Graph sketch */}
             <div className="h-12 w-full border-l border-b border-neon-red/30 relative mt-2">
                <div className="absolute bottom-0 left-0 w-full h-full overflow-hidden">
                   <svg viewBox="0 0 100 100" className="w-full h-full stroke-neon-red/40 fill-none stroke-[2px]">
                      <path d="M0,80 Q25,20 50,70 T100,10" />
                   </svg>
                </div>
             </div>

             <div className="mt-auto flex justify-between items-end">
                <div className="h-8 w-8 rounded-full border border-neon-amber/30 flex items-center justify-center">
                   <div className="h-4 w-4 bg-neon-red/20 rounded-full animate-pulse" />
                </div>
                <div className="text-[6px] font-mono text-neon-amber/40 uppercase">rev_04.2</div>
             </div>
          </div>
        </div>
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
          Whiteboard
        </span>
      </button>
    </div>
  );
};
