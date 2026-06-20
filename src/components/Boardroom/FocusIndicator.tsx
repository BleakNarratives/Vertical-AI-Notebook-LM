'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'red' | 'amber';
}

/**
 * FocusIndicator - Unified terminal-style focus state for boardroom props.
 * Uses absolute-positioned corner brackets that trigger on group focus.
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'amber' }) => {
  const colorClass = color === 'red' ? 'border-neon-red' : 'border-neon-amber';

  return (
    <div className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity duration-200 z-50">
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${colorClass}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${colorClass}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l ${colorClass}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r ${colorClass}`} />
    </div>
  );
};
