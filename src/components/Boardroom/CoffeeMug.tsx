'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { FocusIndicator } from './FocusIndicator';

const MESSAGES = [
  'SYSTEM_SNAPSHOT_SAVED',
  'CACHE_PURGED',
  'STATE_LOADED',
  'LOGS_ARCHIVED',
  'MEMORY_SYNCHRONIZED',
  'SESSION_RECONSTRUCTED'
];

export const CoffeeMug: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleAction = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
    setStatus(randomMessage);
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: 'COFFEE_MUG', action: 'SNAPSHOT', payload: randomMessage, timestamp: new Date().toLocaleTimeString() }
    }));

    timeoutRef.current = setTimeout(() => {
      setStatus(null);
      timeoutRef.current = null;
    }, 2000);
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const isActive = status !== null;

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && (
          <div className="text-[10px] font-mono text-neon-amber animate-pulse uppercase tracking-tighter">
            {status}
          </div>
        )}
      </div>
      <button
        type="button"
        onClick={handleAction}
        aria-label="System Settings (Coffee Break)"
        style={{ transform: 'rotateX(-35deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className="group relative w-16 h-12 transition-all hover:scale-110 focus-visible:scale-110 active:translate-y-1 focus:outline-none transform-gpu"
      >
        <FocusIndicator color="amber" />
        {/* Steam animation */}
        <div className={`absolute -top-6 left-4 flex gap-1.5 transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100'}`}>
          <div className={`w-0.5 h-4 animate-[bounce_2s_infinite] [animation-delay:75ms] blur-[1px] transition-colors duration-500 ${isActive ? 'bg-neon-amber' : 'bg-grey-medium/40'}`} />
          <div className={`w-0.5 h-6 animate-[bounce_1.5s_infinite] blur-[1px] transition-colors duration-500 ${isActive ? 'bg-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.8)]' : 'bg-grey-medium/40'}`} />
          <div className={`w-0.5 h-3 animate-[bounce_2.5s_infinite] [animation-delay:150ms] blur-[1px] transition-colors duration-500 ${isActive ? 'bg-neon-amber' : 'bg-grey-medium/40'}`} />
        </div>

        {/* Mug Body */}
        <div className={`absolute inset-0 bg-grey-dark border-x border-b border-grey-medium rounded-b-sm transition-colors duration-500 ${isActive ? 'shadow-[0_0_15px_rgba(255,191,0,0.2)]' : ''}`}>
           <div className="absolute top-0 left-0 w-full h-2 bg-obsidian border-b border-grey-medium" />
           {/* Heat Glow */}
           <div className={`absolute inset-0 bg-neon-amber opacity-0 transition-opacity duration-500 ${isActive ? 'opacity-5' : ''}`} />
        </div>

        {/* Mug Handle */}
        <div className="absolute top-2 -right-3 w-4 h-6 border-2 border-grey-medium rounded-r-full" />

        {/* Label hidden until focus/hover */}
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-amber opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 whitespace-nowrap transition-opacity z-50">
          SAVE / LOAD / SETTINGS
        </span>
      </button>
    </div>
  );
};
