'use client';

import React from 'react';

interface ShortcutItem {
  key: string;
  label: string;
  targetId: string;
}

const SHORTCUTS: ShortcutItem[] = [
  { key: 'C', label: 'COFFEE BREAK', targetId: 'boardroom-coffeemug' },
  { key: 'L', label: 'LAPTOP WORKSTATION', targetId: 'boardroom-laptop' },
  { key: 'W', label: 'WHITEBOARD', targetId: 'boardroom-whiteboard' },
  { key: 'V', label: 'VIDEO MONITOR', targetId: 'boardroom-videoviewer' },
];

export const ShortcutLegend: React.FC = () => {
  const handleTrigger = (key: string, label: string, targetId: string) => {
    window.dispatchEvent(
      new CustomEvent('sentinel-boardroom-action', {
        detail: { source: `LEGEND_[${key}]`, action: 'TRIGGER_SHORTCUT', payload: label }
      })
    );
    const el = document.getElementById(targetId);
    if (el instanceof HTMLElement) {
      el.focus();
      el.click();
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 text-neon-amber/60 md:absolute md:left-1/2 md:-translate-x-1/2">
      {SHORTCUTS.map(({ key, label, targetId }) => (
        <button
          key={key}
          type="button"
          onClick={() => handleTrigger(key, label, targetId)}
          aria-label={`Trigger [${key}] ${label}`}
          title={`Focus and trigger ${label} [${key}]`}
          className="hover:text-neon-amber focus-visible:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber active:scale-95 transition-all cursor-pointer text-[10px] font-mono uppercase tracking-widest outline-none"
        >
          [{key}] {label}
        </button>
      ))}
    </div>
  );
};
