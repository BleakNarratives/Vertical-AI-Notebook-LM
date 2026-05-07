'use client';

import React, { useState } from 'react';

export const CoffeeMug: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);

  const handleAction = () => {
    setStatus('System Snapshot Saved');
    setTimeout(() => setStatus(null), 2000);
  };

  return (
    <div className="flex flex-col items-center gap-2">
      {status && (
        <div aria-live="polite" className="text-xs font-mono text-neon-amber animate-pulse uppercase">
          {status}
        </div>
      )}
      <button
        type="button"
        onClick={handleAction}
        aria-label="System Settings (Coffee Break)"
        style={{ transform: 'rotateX(-20deg)' }}
        className="group relative w-16 h-12 transition-transform hover:scale-110 active:scale-95 focus:outline-none transform-gpu"
      >
        {/* Steam animation */}
        <div className="absolute -top-6 left-4 flex gap-1.5 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-500">
          <div className="w-0.5 h-4 bg-grey-medium/40 animate-[bounce_2s_infinite] [animation-delay:75ms] blur-[1px]" />
          <div className="w-0.5 h-6 bg-grey-medium/40 animate-[bounce_1.5s_infinite] blur-[1px]" />
          <div className="w-0.5 h-3 bg-grey-medium/40 animate-[bounce_2.5s_infinite] [animation-delay:150ms] blur-[1px]" />
        </div>

        {/* Mug Body */}
        <div className="absolute inset-0 bg-grey-dark border-x border-b border-grey-medium rounded-b-sm">
           <div className="absolute top-0 left-0 w-full h-2 bg-obsidian border-b border-grey-medium" />
        </div>

        {/* Mug Handle */}
        <div className="absolute top-2 -right-3 w-4 h-6 border-2 border-grey-medium rounded-r-full" />

        {/* Label hidden until focus/hover */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap transition-opacity">
          SAVE / LOAD / SETTINGS
        </span>

        {/* Focus indicator */}
        <div className="absolute -inset-2 border border-neon-red opacity-0 group-focus-visible:opacity-100 transition-opacity pointer-events-none" />
      </button>
    </div>
  );
};
