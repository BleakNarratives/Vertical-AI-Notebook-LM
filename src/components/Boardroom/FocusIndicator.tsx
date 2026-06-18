'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
}

/**
 * FocusIndicator - A terminal-style focus indicator with corner brackets.
 * Resides in the -inset-3 boundary to accommodate interactive scaling.
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'neon-amber' }) => {
  const colorClass = color === 'neon-red' ? 'border-neon-red' : 'border-neon-amber';
  const glowClass = color === 'neon-red' ? 'shadow-[0_0_10px_rgba(255,0,0,0.4)]' : 'shadow-[0_0_10px_rgba(255,191,0,0.4)]';

  return (
    <div className={`absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity duration-300 z-50`}>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${colorClass} ${glowClass}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${colorClass} ${glowClass}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l ${colorClass} ${glowClass}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r ${colorClass} ${glowClass}`} />
    </div>
  );
};
