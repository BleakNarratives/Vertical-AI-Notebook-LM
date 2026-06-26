'use client';

import React from 'react';

interface FocusIndicatorProps {
  theme?: 'red' | 'amber';
}

/**
 * Standardized Terminal-style focus indicator with corner brackets.
 * Should be placed inside a relative/group container.
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ theme = 'red' }) => {
  const borderColor = theme === 'red' ? 'border-neon-red' : 'border-neon-amber';
  const shadowClass = theme === 'red' ? 'shadow-[0_0_8px_rgba(255,0,0,0.5)]' : 'shadow-[0_0_8px_rgba(255,191,0,0.5)]';

  return (
    <div className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity duration-200 z-50">
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-l-[1.5px] border-t-[1.5px] ${borderColor} ${shadowClass}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-r-[1.5px] border-t-[1.5px] ${borderColor} ${shadowClass}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-l-[1.5px] border-b-[1.5px] ${borderColor} ${shadowClass}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-r-[1.5px] border-b-[1.5px] ${borderColor} ${shadowClass}`} />
    </div>
  );
};
