import React, { useState, useEffect } from 'react';

interface FocusIndicatorProps {
  color?: 'neon-red' | 'neon-amber';
  shortcutKey?: string;
}

/**
 * FocusIndicator - A terminal-style corner bracket indicator that appears on focus.
 * Must be placed inside a container with the 'group' class.
 */
export const FocusIndicator: React.FC<FocusIndicatorProps> = ({
  color = 'neon-red',
  shortcutKey
}) => {
  const [showHints, setShowHints] = useState(false);
  const colorClass = color === 'neon-red' ? 'border-neon-red' : 'border-neon-amber';
  const badgeColorClass = color === 'neon-red' ? 'bg-neon-red/20 text-neon-red border-neon-red' : 'bg-neon-amber/20 text-neon-amber border-neon-amber';

  useEffect(() => {
    const handleToggleState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setShowHints(customEvent.detail.enabled);
      }
    };

    window.addEventListener('sentinel-toggle-hints-state', handleToggleState);
    return () => window.removeEventListener('sentinel-toggle-hints-state', handleToggleState);
  }, []);

  return (
    <div className={`absolute -inset-3 pointer-events-none transition-all duration-300 scale-105 group-focus-visible:scale-100 z-50 ${showHints ? 'opacity-100' : 'opacity-0 group-focus-visible:opacity-100'}`}>
      {/* Shortcut Keycap HUD Badge */}
      {showHints && shortcutKey && (
        <span aria-hidden="true" className={`absolute -top-3 -right-2 px-1.5 py-0.5 border text-[9px] font-mono font-bold rounded-xs shadow-md animate-in fade-in zoom-in duration-200 ${badgeColorClass}`}>
          [{shortcutKey}]
        </span>
      )}
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
