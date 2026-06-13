'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'red' | 'amber';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'red' }) => {
  const borderColor = color === 'red' ? 'border-neon-red' : 'border-neon-amber';
  const shadowColor = color === 'red' ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 191, 0, 0.5)';

  return (
    <div className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity duration-200 z-50">
      {/* Top Left */}
      <div
        style={{ boxShadow: `0 0 8px ${shadowColor}` }}
        className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${borderColor}`}
      />
      {/* Top Right */}
      <div
        style={{ boxShadow: `0 0 8px ${shadowColor}` }}
        className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${borderColor}`}
      />
      {/* Bottom Left */}
      <div
        style={{ boxShadow: `0 0 8px ${shadowColor}` }}
        className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${borderColor}`}
      />
      {/* Bottom Right */}
      <div
        style={{ boxShadow: `0 0 8px ${shadowColor}` }}
        className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${borderColor}`}
      />
    </div>
  );
};
