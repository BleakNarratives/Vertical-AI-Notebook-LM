'use client';

import React, { useState, useEffect } from 'react';

export const ShortcutToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetState = typeof customEvent.detail?.enabled === 'boolean'
        ? customEvent.detail.enabled
        : !enabled;

      if (targetState !== enabled) {
        setEnabled(targetState);
        window.dispatchEvent(new CustomEvent('sentinel-toggle-hints-state', { detail: { enabled: targetState } }));
      }
    };

    const handleStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      const targetState = customEvent.detail?.enabled;
      if (typeof targetState === 'boolean' && targetState !== enabled) {
        setEnabled(targetState);
      }
    };

    window.addEventListener('sentinel-toggle-hints', handleToggle);
    window.addEventListener('sentinel-toggle-hints-state', handleStateChange);
    return () => {
      window.removeEventListener('sentinel-toggle-hints', handleToggle);
      window.removeEventListener('sentinel-toggle-hints-state', handleStateChange);
    };
  }, [enabled]);

  const handleClick = () => {
    window.dispatchEvent(new CustomEvent('sentinel-toggle-hints', { detail: { enabled: !enabled } }));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label="Toggle Keyboard Shortcut Hints [K]"
      aria-pressed={enabled}
      className={`px-2 py-0.5 border font-mono text-[10px] transition-all hover:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber outline-none cursor-pointer ${
        enabled
          ? 'bg-neon-amber/20 text-neon-amber border-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.3)]'
          : 'bg-transparent text-grey-medium border-grey-dark hover:border-grey-medium'
      }`}
    >
      [K] HINTS: {enabled ? 'ON' : 'OFF'}
    </button>
  );
};
