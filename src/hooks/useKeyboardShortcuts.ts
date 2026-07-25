'use client';

import { useEffect } from 'react';

/**
 * useKeyboardShortcuts - Global keyboard shortcuts hook for the boardroom.
 * Supports:
 * - C: Triggers CoffeeMug settings snapshot
 * - L: Logs into Laptop terminal
 * - W: Posts to Whiteboard strategy logger
 * - V: Synchronizes VideoViewer monitor feed
 * Shortcuts are bypassed when focusing on input, textarea, or contenteditable elements.
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Bypass when focusing on interactive input fields/elements
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          activeEl.hasAttribute('contenteditable') ||
          activeEl.closest('[contenteditable="true"]'))
      ) {
        return;
      }

      const key = e.key.toUpperCase();
      const allowedKeys = ['C', 'L', 'W', 'V'];
      if (!allowedKeys.includes(key)) return;

      const target = document.querySelector(`[data-shortcut="${key}"]`) as HTMLButtonElement | null;
      if (target) {
        e.preventDefault();
        target.click();
        target.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
