'use client';

import React, { useState, useEffect } from 'react';

export const EasterEgg: React.FC = () => {
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!revealed) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setRevealed(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [revealed]);

  return (
    <button
      type="button"
      aria-expanded={revealed}
      aria-label="Reveal shadow detail"
      title="Inspect obsidian shadow secret"
      className="fixed bottom-0 left-0 w-4 h-4 cursor-help opacity-0 hover:opacity-10 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-neon-amber transition-opacity"
      onClick={() => setRevealed(!revealed)}
    >
      {revealed && (
        <span
          role="status"
          aria-live="polite"
          className="absolute bottom-6 left-6 p-4 bg-obsidian border border-neon-amber text-[10px] font-mono text-neon-amber text-left whitespace-normal min-w-[220px] shadow-[0_0_15px_rgba(255,191,0,0.2)] animate-in fade-in slide-in-from-bottom-2 pointer-events-none block"
        >
          RECURSION DETECTED: The voodoo doll is holding a smaller voodoo doll.
          <br />
          - MOLT
        </span>
      )}
    </button>
  );
};
