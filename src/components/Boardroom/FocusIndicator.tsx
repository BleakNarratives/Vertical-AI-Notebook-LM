'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'red' | 'amber';
}

export const FocusIndicator: React.FC<FocusIndicatorProps> = ({ color = 'red' }) => {
  const borderColor = color === 'red' ? 'border-neon-red' : 'border-neon-amber';

  return (
    <div className="absolute -inset-3 pointer-events-none z-50 opacity-0 group-focus-within:opacity-100 group-hover:opacity-20 transition-all duration-300 scale-110 group-focus-within:scale-105">
      {/* Corner Brackets */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t border-l ${borderColor}`} />
      <div className={`absolute top-0 right-0 w-2 h-2 border-t border-r ${borderColor}`} />
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b border-l ${borderColor}`} />
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b border-r ${borderColor}`} />

      {/* Internal Border */}
      <div className={`absolute inset-0 border opacity-10 ${borderColor}`} />
    </div>
  );
};
