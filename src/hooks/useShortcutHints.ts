'use client';

import { useState, useEffect } from 'react';

export const useShortcutHints = () => {
  const [hintsEnabled, setHintsEnabled] = useState(false);

  useEffect(() => {
    const handleState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (typeof customEvent.detail?.enabled === 'boolean') {
        setHintsEnabled(customEvent.detail.enabled);
      }
    };

    window.addEventListener('sentinel-toggle-hints-state', handleState);
    window.dispatchEvent(new CustomEvent('sentinel-request-hints-state'));

    return () => {
      window.removeEventListener('sentinel-toggle-hints-state', handleState);
    };
  }, []);

  return hintsEnabled;
};
