'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'red' | 'amber';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'amber' }) => {
  const colorClass = color === 'red' ? 'border-neon-red' : 'border-neon-amber';
  const glowClass = color === 'red' ? 'text-neon-red' : 'text-neon-amber';

  return (
    <div className="absolute -inset-3 pointer-events-none transition-all duration-300 opacity-0 group-focus-visible:opacity-100 group-focus-visible:scale-105 z-50">
      {/* Corner Brackets */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colorClass}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${colorClass}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${colorClass}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colorClass}`} />

      {/* Internal Border */}
      <div className={`absolute inset-0 border border-current opacity-10 ${glowClass}`} />
    </div>
  );
};
