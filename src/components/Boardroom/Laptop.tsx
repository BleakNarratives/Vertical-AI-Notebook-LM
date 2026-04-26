'use client';

import React from 'react';

export const Laptop: React.FC = () => {
  return (
    <button
      aria-label="Access Terminal (Workstation)"
      className="group relative w-48 h-32 transition-transform hover:scale-105 focus:outline-none"
    >
      {/* Laptop Screen (Open) */}
      <div className="absolute top-0 left-4 right-4 h-24 bg-obsidian border border-grey-medium rounded-t-sm overflow-hidden flex flex-col">
        <div className="h-1.5 bg-grey-dark border-b border-grey-medium flex items-center px-1 gap-0.5">
          <div className="w-1 h-1 rounded-full bg-neon-red/40" />
          <div className="w-1 h-1 rounded-full bg-neon-amber/40" />
        </div>
        <div className="flex-1 p-2 font-mono text-[6px] text-left text-grey-medium leading-tight">
          <div className="text-neon-red opacity-80">{">"} AUTH_INIT...</div>
          <div className="mt-1 opacity-40">Loading Obelisk OS v0.1.0</div>
          <div className="mt-1 opacity-40">System Link: ACTIVE</div>
          <div className="mt-2 animate-pulse">_</div>
        </div>
        {/* Screen Glare */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
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
      <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-mono text-neon-red opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap transition-opacity uppercase tracking-tighter">
        Terminal / IDEal / 4ward
      </span>

      {/* Focus indicator */}
      <div className="absolute -inset-2 border border-neon-red/50 opacity-0 group-focus-visible:opacity-100 transition-opacity pointer-events-none" />
    </button>
  );
};
