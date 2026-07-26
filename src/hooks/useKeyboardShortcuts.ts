'use client';

import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is focusing an input, textarea, or element with contentEditable
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable)
      ) {
        return;
      }

      // Check key triggers (support both lowercase and uppercase keys)
      const key = e.key.toLowerCase();
      let buttonId = '';

      if (key === 'c') {
        buttonId = 'boardroom-coffeemug';
      } else if (key === 'l') {
        buttonId = 'boardroom-laptop';
      } else if (key === 'w') {
        buttonId = 'boardroom-whiteboard';
      } else if (key === 'v') {
        buttonId = 'boardroom-videoviewer';
      }

      if (buttonId) {
        const btn = document.getElementById(buttonId) as HTMLButtonElement | null;
        if (btn) {
          e.preventDefault();
          btn.focus();
          btn.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
