'use client';

import React, { useState, useEffect } from 'react';

export const ShortcutToggle: React.FC = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('sentinel-toggle-hints-state', { detail: { enabled } }));
  }, [enabled]);

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setEnabled(customEvent.detail.enabled);
      } else {
        setEnabled(prev => !prev);
      }
    };

    window.addEventListener('sentinel-toggle-hints', handleToggle);
    return () => window.removeEventListener('sentinel-toggle-hints', handleToggle);
  }, []);

  const handleClick = () => {
    setEnabled(prev => !prev);
  };

  return (
    <>
      <span className="sr-only" aria-live="polite">
        {`Keyboard shortcut hints ${enabled ? 'enabled' : 'disabled'}`}
      </span>
      <button
        type="button"
        role="switch"
        onClick={handleClick}
        aria-keyshortcuts="K"
        aria-label="Toggle Keyboard Shortcut Hints [K]"
        title={enabled ? "Disable shortcut visual indicators on interactive boardroom elements [K]" : "Enable shortcut visual indicators on interactive boardroom elements [K]"}
        aria-checked={enabled}
        className={`px-2 py-0.5 border font-mono text-[10px] transition-all active:scale-95 hover:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber outline-none cursor-pointer ${
          enabled
            ? 'bg-neon-amber/20 text-neon-amber border-neon-amber shadow-[0_0_8px_rgba(255,191,0,0.3)]'
            : 'bg-transparent text-grey-medium border-grey-dark hover:border-grey-medium'
        }`}
      >
        [K] HINTS: {enabled ? 'ON' : 'OFF'}
      </button>
    </>
  );
};
