'use client';

import React from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
  className?: string;
  group?: string;
}

/**
 * Standardized Terminal-style focus indicator for boardroom props.
 * Uses corner brackets that appear on hover/focus of the parent .group
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  color = 'neon-amber',
  className = '',
  group
}) => {
  const borderColor = color === 'neon-red' ? 'border-neon-red' : 'border-neon-amber';
  const glowColor = color === 'neon-red' ? 'shadow-[0_0_8px_rgba(255,0,0,0.5)]' : 'shadow-[0_0_8px_rgba(255,191,0,0.5)]';

  const visibilityClass = group
    ? `group-hover/${group}:opacity-100 group-focus-visible/${group}:opacity-100`
    : 'group-hover:opacity-100 group-focus-visible:opacity-100';

  return (
    <div className={`absolute -inset-3 pointer-events-none opacity-0 ${visibilityClass} transition-opacity duration-200 ${className}`}>
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l ${borderColor} ${glowColor}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r ${borderColor} ${glowColor}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l ${borderColor} ${glowColor}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r ${borderColor} ${glowColor}`} />
    </div>
  );
};
