import React from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
}

/**
 * FocusIndicator - A terminal-style corner bracket indicator that appears on focus.
 * Must be placed inside a container with the 'group' class.
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  color = 'neon-red'
}) => {
  const colorClass = color === 'neon-red' ? 'border-neon-red' : 'border-neon-amber';

  return (
    <div className="absolute -inset-3 pointer-events-none opacity-0 group-focus-visible:opacity-100 transition-all duration-300 scale-105 group-focus-visible:scale-100 z-50">
      {/* Top Left */}
      <div className={`absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 ${colorClass}`} />
      {/* Top Right */}
      <div className={`absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 ${colorClass}`} />
      {/* Bottom Left */}
      <div className={`absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 ${colorClass}`} />
      {/* Bottom Right */}
      <div className={`absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 ${colorClass}`} />
    </div>
  );
};
