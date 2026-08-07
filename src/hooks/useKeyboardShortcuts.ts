'use client';

import { useEffect } from 'react';

/**
 * useKeyboardShortcuts - Standard global hook for Code City boardroom navigation.
 * Binds keys to trigger actions on interactive props:
 * - C: CoffeeMug Settings (boardroom-coffeemug)
 * - L: Laptop Terminal (boardroom-laptop)
 * - W: Whiteboard Strategy Logger (boardroom-whiteboard)
 * - V: VideoViewer Monitor Feed (boardroom-videoviewer)
 *
 * Keystrokes are ignored when focusing form inputs or contentEditable fields.
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ignore keys if modifier keys are pressed (e.g., Command, Control, Alt, Shift)
      // to avoid hijacking standard browser shortcuts like Copy/Paste/Close Tab.
      if (event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return;
      }

      // Ignore keys when typing inside input elements
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        const isContentEditable = activeEl.hasAttribute('contenteditable') || (activeEl as HTMLElement).contentEditable === 'true';
        if (tagName === 'input' || tagName === 'textarea' || isContentEditable) {
          return;
        }
      }

      const key = event.key.toUpperCase();

      if (key === 'K') {
        event.preventDefault();
        // Toggle HUD state and broadcast to listener hooks
        const currentHints = window.localStorage.getItem('sentinel_show_hints') === 'true';
        const nextState = !currentHints;
        window.localStorage.setItem('sentinel_show_hints', String(nextState));
        window.dispatchEvent(new CustomEvent('sentinel-toggle-hints', {
          detail: { showHints: nextState }
        }));
        return;
      }

      let targetId = '';

      switch (key) {
        case 'C':
          targetId = 'boardroom-coffeemug';
          break;
        case 'L':
          targetId = 'boardroom-laptop';
          break;
        case 'W':
          targetId = 'boardroom-whiteboard';
          break;
        case 'V':
          targetId = 'boardroom-videoviewer';
          break;
        default:
          return;
      }

      const element = document.getElementById(targetId);
      if (element instanceof HTMLElement) {
        event.preventDefault();
        element.focus();
        element.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
