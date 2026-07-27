'use client';

import { useEffect } from 'react';

/**
 * useKeyboardShortcuts - Global keyboard shortcut listener for interactive boardroom props.
 * Listens for C, L, W, V keystrokes to trigger corresponding actions with focus.
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore shortcut when typing in inputs/textareas/editable elements
      const activeEl = document.activeElement;
      if (activeEl) {
        const tagName = activeEl.tagName.toLowerCase();
        if (
          tagName === 'input' ||
          tagName === 'textarea' ||
          activeEl.getAttribute('contenteditable') === 'true'
        ) {
          return;
        }
      }

      // Ignore if meta, ctrl, or alt key is active
      if (e.metaKey || e.ctrlKey || e.altKey) {
        return;
      }

      let elementId = '';
      switch (e.key.toLowerCase()) {
        case 'c':
          elementId = 'boardroom-coffeemug';
          break;
        case 'l':
          elementId = 'boardroom-laptop';
          break;
        case 'w':
          elementId = 'boardroom-whiteboard';
          break;
        case 'v':
          elementId = 'boardroom-videoviewer';
          break;
        default:
          return;
      }

      const target = document.getElementById(elementId);
      if (target) {
        e.preventDefault();
        target.focus();
        target.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
