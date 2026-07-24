'use client';

import { useEffect } from 'react';

/**
 * useKeyboardShortcuts - Global keyboard event listener for primary boardroom interactive props.
 * Maps:
 * - 'C' -> CoffeeMug (System Settings)
 * - 'L' -> Laptop (Access Terminal)
 * - 'W' -> Whiteboard (Iteration Whiteboard)
 * - 'V' -> VideoViewer (Remote Feed / Video Monitor)
 * Shortcuts are bypassed when focusing inputs, textareas, or content-editable elements.
 */
export const useKeyboardShortcuts = () => {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Bypass if user is actively focusing an input field, textarea, or contenteditable element
      const active = document.activeElement;
      if (active && (
        active.tagName === 'INPUT' ||
        active.tagName === 'TEXTAREA' ||
        active.getAttribute('contenteditable') === 'true'
      )) {
        return;
      }

      // Bypass if modifier keys are pressed to avoid interfering with standard browser/system shortcuts
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }

      const key = e.key.toLowerCase();
      let targetAriaLabel: string | null = null;

      switch (key) {
        case 'c':
          targetAriaLabel = 'System Settings (Coffee Break)';
          break;
        case 'l':
          targetAriaLabel = 'Access Terminal (Workstation)';
          break;
        case 'w':
          targetAriaLabel = 'Iteration Whiteboard (Strategy)';
          break;
        case 'v':
          targetAriaLabel = 'Remote Feed / Video Monitor';
          break;
        default:
          break;
      }

      if (targetAriaLabel) {
        e.preventDefault();
        const button = document.querySelector(`button[aria-label="${targetAriaLabel}"]`) as HTMLButtonElement | null;
        if (button) {
          button.focus();
          button.click();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
};
