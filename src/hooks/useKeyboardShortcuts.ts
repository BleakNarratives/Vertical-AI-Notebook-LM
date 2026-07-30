'use client';

import { useEffect } from 'react';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Avoid triggering when user is focusing form fields or editable areas
      const activeElement = document.activeElement;
      if (activeElement) {
        const tagName = activeElement.tagName.toLowerCase();
        const isContentEditable = activeElement.hasAttribute('contenteditable') ||
                                  activeElement.getAttribute('contenteditable') === 'true';

        if (tagName === 'input' || tagName === 'textarea' || isContentEditable) {
          return;
        }
      }

      // Check if any modifier key is pressed (to avoid hijacking browser shortcuts like Cmd+L or Cmd+C)
      if (event.ctrlKey || event.metaKey || event.altKey) {
        return;
      }

      const key = event.key.toLowerCase();
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

      const targetElement = document.getElementById(targetId);
      if (targetElement instanceof HTMLElement) {
        event.preventDefault();
        // Set focus programmatically to sync visual focus rings
        targetElement.focus();
        // Click programmatically to execute associated actions
        targetElement.click();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
