'use client';

import React, { useEffect, useState } from 'react';

export const ShortcutToggle: React.FC = () => {
  const [showHints, setShowHints] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.localStorage.getItem('sentinel_show_hints') === 'true';
    }
    return false;
  });

  useEffect(() => {
    const handleToggle = (e: Event) => {
      const customEvent = e as CustomEvent;
      setShowHints(customEvent.detail?.showHints ?? false);
    };
    window.addEventListener('sentinel-toggle-hints', handleToggle);
    window.addEventListener('sentinel-toggle-hints-state', handleToggle);
    return () => {
      window.removeEventListener('sentinel-toggle-hints', handleToggle);
      window.removeEventListener('sentinel-toggle-hints-state', handleToggle);
    };
  }, []);

  const toggle = () => {
    const nextState = !showHints;
    setShowHints(nextState);
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('sentinel_show_hints', String(nextState));
    }
    window.dispatchEvent(new CustomEvent('sentinel-toggle-hints', {
      detail: { showHints: nextState }
    }));
  };

  return (
    <button
      onClick={toggle}
      className="text-neon-amber/60 hover:text-neon-amber transition-colors cursor-pointer outline-none focus-visible:ring-1 focus-visible:ring-neon-amber/50 px-2 py-0.5"
      aria-label="Toggle Keyboard Shortcut Hints [K]"
    >
      [K] {showHints ? 'HIDE KEYBOARD SUGGESTIONS' : 'SHOW KEYBOARD SUGGESTIONS'}
    </button>
  );
};
