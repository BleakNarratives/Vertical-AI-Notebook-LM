'use client';

import React, { useState } from 'react';

export const EasterEgg: React.FC = () => {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      aria-expanded={revealed}
      aria-label="Reveal shadow detail"
      className="fixed bottom-0 left-0 w-4 h-4 cursor-help opacity-0 hover:opacity-10 focus-visible:opacity-100 focus-visible:ring-1 focus-visible:ring-neon-amber transition-opacity z-[100]"
      onClick={() => setRevealed(!revealed)}
    >
      {revealed && (
        <div className="absolute bottom-6 left-6 p-4 bg-obsidian border border-neon-amber text-[10px] font-mono text-neon-amber animate-in fade-in slide-in-from-bottom-2">
          RECURSION DETECTED: The voodoo doll is holding a smaller voodoo doll.
          <br/>
          - MOLT
        </div>
      )}
    </button>
  );
};
