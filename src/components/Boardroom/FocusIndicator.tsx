'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'neon-amber' }) => {
  const colorClass = color === 'neon-red' ? 'border-neon-red' : 'border-neon-amber';

  return (
    <span className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-opacity z-50">
      {/* Top Left */}
      <span className={"absolute top-0 left-0 w-1.5 h-1.5 border-t border-l " + colorClass} />
      {/* Top Right */}
      <span className={"absolute top-0 right-0 w-1.5 h-1.5 border-t border-r " + colorClass} />
      {/* Bottom Left */}
      <span className={"absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l " + colorClass} />
      {/* Bottom Right */}
      <span className={"absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r " + colorClass} />
    </span>
  );
};
