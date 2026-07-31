'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'red' | 'amber';
  className?: string;
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  color = 'red',
  className = ""
}) => {
  const colorClass = color === 'red' ? 'border-neon-red' : 'border-neon-amber';
  const shadowClass = color === 'red' ? 'shadow-[0_0_15px_rgba(255,0,0,0.2)]' : 'shadow-[0_0_15px_rgba(255,191,0,0.2)]';

  return (
    <div className={"absolute -inset-3 pointer-events-none opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-all duration-300 scale-95 group-hover:scale-105 group-focus-visible:scale-105 z-50 " + shadowClass + " " + className}>
      {/* Corner Brackets */}
      <div className={"absolute top-0 left-0 w-2 h-2 border-l-2 border-t-2 " + colorClass} />
      <div className={"absolute top-0 right-0 w-2 h-2 border-r-2 border-t-2 " + colorClass} />
      <div className={"absolute bottom-0 left-0 w-2 h-2 border-l-2 border-b-2 " + colorClass} />
      <div className={"absolute bottom-0 right-0 w-2 h-2 border-r-2 border-b-2 " + colorClass} />

      {/* Subtle thin border */}
      <div className={"absolute inset-0 border opacity-10 " + colorClass} />
    </div>
  );
};
