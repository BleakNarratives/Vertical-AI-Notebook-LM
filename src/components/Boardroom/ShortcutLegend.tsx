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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | null = null;
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const source = customEvent.detail?.source;
      if (typeof source !== 'string') return;

      let matchedKey: string | null = null;
      if (source.includes('COFFEE_MUG') || source.includes('[C]')) matchedKey = 'C';
      else if (source.includes('WORKSTATION') || source.includes('LAPTOP') || source.includes('[L]')) matchedKey = 'L';
      else if (source.includes('WHITEBOARD') || source.includes('[W]')) matchedKey = 'W';
      else if (source.includes('MONITOR') || source.includes('VIDEO') || source.includes('[V]')) matchedKey = 'V';

      if (matchedKey) {
        setActiveKey(matchedKey);
        if (timer) clearTimeout(timer);
        timer = setTimeout(() => setActiveKey(null), 600);
      }
    };

    window.addEventListener('sentinel-boardroom-action', handleAction);
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener('sentinel-boardroom-action', handleAction);
    };
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-4 text-neon-amber/60 md:absolute md:left-1/2 md:-translate-x-1/2">
      {SHORTCUTS.map(({ key, label, targetId }) => {
        const isActive = activeKey === key;
        return (
          <button
            key={key}
            type="button"
            onClick={() => handleTrigger(key, label, targetId)}
            aria-keyshortcuts={key}
            aria-label={`Trigger [${key}] ${label}`}
            title={`Focus and trigger ${label} [${key}]`}
            className={`transition-all cursor-pointer text-[10px] font-mono uppercase tracking-widest outline-none hover:text-neon-amber focus-visible:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber active:scale-95 ${
              isActive ? 'text-neon-amber font-bold scale-105 drop-shadow-[0_0_8px_rgba(255,191,0,0.8)]' : ''
            }`}
          >
            [{key}] {label}
          </button>
        );
      })}
    </div>
  );
};
