'use client';

import React, { useState, useEffect } from 'react';

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
  const [activeKey, setActiveKey] = useState<string | null>(null);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const source = customEvent.detail?.source || '';
      let keyToHighlight: string | null = null;
      if (source.includes('COFFEE')) keyToHighlight = 'C';
      else if (source.includes('WORKSTATION') || source.includes('LAPTOP')) keyToHighlight = 'L';
      else if (source.includes('WHITEBOARD')) keyToHighlight = 'W';
      else if (source.includes('MONITOR')) keyToHighlight = 'V';
      else if (source.startsWith('LEGEND_[')) keyToHighlight = source.slice(8, 9);

      if (keyToHighlight) {
        if (timeoutId) clearTimeout(timeoutId);
        setActiveKey(keyToHighlight);
        timeoutId = setTimeout(() => setActiveKey(null), 800);
      }
    };

    window.addEventListener('sentinel-boardroom-action', handleAction);
    return () => {
      window.removeEventListener('sentinel-boardroom-action', handleAction);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

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
          aria-keyshortcuts={key}
          aria-label={`Trigger [${key}] ${label}`}
          title={`Focus and trigger ${label} [${key}]`}
          className={`hover:text-neon-amber focus-visible:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber active:scale-95 transition-all cursor-pointer text-[10px] font-mono uppercase tracking-widest outline-none ${
            activeKey === key ? 'text-neon-amber font-bold drop-shadow-[0_0_8px_rgba(255,191,0,0.8)] animate-pulse' : ''
          }`}
        >
          [{key}] {label}
        </button>
      ))}
    </div>
  );
};
