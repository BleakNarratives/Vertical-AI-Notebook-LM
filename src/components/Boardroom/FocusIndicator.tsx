'use client';

import React from 'react';

interface FocusIndicatorProps {
  color: 'red' | 'amber';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color }) => {
  const colorClass = color === 'red' ? 'border-neon-red' : 'border-neon-amber';
  const glowClass = color === 'red' ? 'shadow-[0_0_10px_rgba(255,0,0,0.3)]' : 'shadow-[0_0_10px_rgba(255,191,0,0.3)]';

  return (
    <div className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 group-hover:opacity-40 transition-all duration-300 scale-110 group-focus-visible:scale-105 group-hover:scale-105 z-50">
      {/* Corner Brackets */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 ${colorClass} ${glowClass}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 ${colorClass} ${glowClass}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 ${colorClass} ${glowClass}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 ${colorClass} ${glowClass}`} />

      {/* Subtle Internal Border */}
      <div className={`absolute inset-1 border border-white/5`} />
    </div>
  );
};
