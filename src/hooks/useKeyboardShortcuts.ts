'use client';

import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if modifier keys (Ctrl, Cmd, Alt) are pressed to prevent hijacking browser actions (e.g. Ctrl+C, Cmd+V)
      if (e.ctrlKey || e.metaKey || e.altKey) {
        return;
      }

      // Ignore if user is typing in standard inputs, textareas, or contentEditable elements
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

      const key = e.key.toUpperCase();
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

      const button = document.getElementById(targetId);
      if (button) {
        e.preventDefault();
        // Trigger programmatic focus and click
        (button as HTMLElement).focus();
        (button as HTMLElement).click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
