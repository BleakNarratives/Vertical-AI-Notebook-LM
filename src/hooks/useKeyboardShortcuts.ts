'use client';

import { useEffect } from 'react';

/**
 * useKeyboardShortcuts - Global hook to listen for primary interactive prop shortcuts.
 * C: CoffeeMug Settings Snapshot
 * L: Laptop Terminal Sync
 * W: Whiteboard Strategy Log
 * V: VideoViewer Monitor Sync
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore complex key combinations to prevent overriding standard browser shortcuts
      if (e.metaKey || e.ctrlKey || e.altKey) return;

      // Ignore keyboard shortcuts when a user is actively typing in editable elements
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          activeEl.hasAttribute('contenteditable') ||
          activeEl.getAttribute('contenteditable') === 'true'
        ) {
          return;
        }
      }

      const key = e.key.toLowerCase();
      let targetId = '';

      switch (key) {
        case 'c':
          targetId = 'boardroom-coffeemug';
          break;
        case 'l':
          targetId = 'boardroom-laptop';
          break;
        case 'w':
          targetId = 'boardroom-whiteboard';
          break;
        case 'v':
          targetId = 'boardroom-videoviewer';
          break;
        default:
          return;
      }

      const button = document.getElementById(targetId);
      if (button) {
        e.preventDefault();
        // Programmatically focus to synchronize visual focus indicator
        button.focus();
        // Trigger action click
        button.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
