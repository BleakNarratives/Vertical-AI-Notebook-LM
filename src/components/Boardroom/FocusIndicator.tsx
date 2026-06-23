'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
  group: 'laptop' | 'mug' | 'whiteboard' | 'monitor' | 'persona' | 'paper';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'neon-amber', group }) => {
  const colorClasses = {
    'neon-red': 'border-neon-red shadow-[0_0_8px_rgba(255,0,0,0.5)]',
    'neon-amber': 'border-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.5)]'
  };

  // Explicitly mapping to ensure Tailwind picks up these classes
  const focusClasses = {
    laptop: 'group-focus-visible/laptop:opacity-100',
    mug: 'group-focus-visible/mug:opacity-100',
    whiteboard: 'group-focus-visible/whiteboard:opacity-100',
    monitor: 'group-focus-visible/monitor:opacity-100',
    persona: 'group-focus-visible/persona:opacity-100',
    paper: 'group-focus-visible/paper:opacity-100',
  };

  return (
    <div className={`absolute -inset-3 pointer-events-none opacity-0 transition-opacity duration-200 ${focusClasses[group]}`}>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 ${colorClasses[color]}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 ${colorClasses[color]}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 ${colorClasses[color]}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 ${colorClasses[color]}`} />
    </div>
  );
};
