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
  const [activeKey, setActiveKey] = React.useState<string | null>(null);
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const handleAction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const source = typeof customEvent.detail?.source === 'string' ? customEvent.detail.source : '';
      let keyToHighlight: string | null = null;

      if (source.includes('COFFEE_MUG') || source.includes('[C]')) keyToHighlight = 'C';
      else if (source.includes('LAPTOP') || source.includes('[L]')) keyToHighlight = 'L';
      else if (source.includes('WHITEBOARD') || source.includes('[W]')) keyToHighlight = 'W';
      else if (source.includes('MONITOR') || source.includes('[V]')) keyToHighlight = 'V';

      if (keyToHighlight) {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setActiveKey(keyToHighlight);
        timeoutRef.current = setTimeout(() => {
          setActiveKey(null);
          timeoutRef.current = null;
        }, 800);
      }
    };

    window.addEventListener('sentinel-boardroom-action', handleAction);
    return () => {
      window.removeEventListener('sentinel-boardroom-action', handleAction);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
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
            className={`hover:text-neon-amber focus-visible:text-neon-amber focus-visible:ring-1 focus-visible:ring-neon-amber active:scale-95 transition-all cursor-pointer text-[10px] font-mono uppercase tracking-widest outline-none ${
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
