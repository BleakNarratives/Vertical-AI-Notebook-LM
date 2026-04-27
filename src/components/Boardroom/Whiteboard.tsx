'use client';

import React from 'react';

export const Whiteboard: React.FC = () => {
  return (
    <button
      aria-label="Iteration Whiteboard (Strategy)"
      className="group absolute top-12 -left-12 w-32 h-48 bg-grey-dark border border-grey-medium shadow-2xl transition-all hover:scale-105 focus-visible:ring-2 focus-visible:ring-neon-amber outline-none -rotate-3"
    >
      <div className="absolute inset-2 bg-obsidian/50 border border-grey-dark p-2 overflow-hidden">
        <div className="w-full h-full border-l border-b border-neon-amber/20 flex flex-col gap-2 opacity-40">
           <div className="h-0.5 w-3/4 bg-neon-amber/40" />
           <div className="h-0.5 w-1/2 bg-neon-amber/40" />
           <div className="h-0.5 w-5/6 bg-neon-amber/40" />
           <div className="mt-auto h-4 w-4 rounded-full border border-neon-red/40" />
        </div>
      </div>
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[8px] font-mono text-grey-medium opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity uppercase whitespace-nowrap">
        Whiteboard
      </span>
    </button>
  );
};
