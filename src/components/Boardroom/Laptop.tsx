'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { FocusIndicator } from './FocusIndicator';

interface BoardroomEvent extends CustomEvent {
  detail: {
    source: string;
    action: string;
    payload?: string;
    timestamp: string;
  };
}

export const Laptop: React.FC = () => {
  const [status, setStatus] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleRemoteAction = useCallback((e: Event) => {
    const event = e as BoardroomEvent;
    const { source, action, payload, timestamp } = event.detail;
    const logMessage = `[${timestamp}] ${source}: ${action}${payload ? ` (${payload})` : ''}`;

    setLogs(prev => [logMessage, ...prev].slice(0, 4));
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
  }, []);

  useEffect(() => {
    window.addEventListener('sentinel-boardroom-action', handleRemoteAction);
    return () => window.removeEventListener('sentinel-boardroom-action', handleRemoteAction);
  }, [handleRemoteAction]);

  const handleAccess = useCallback(() => {
    if (status) return;
    setStatus('Synchronizing...');
    setIsFlashing(true);
    setTimeout(() => { setStatus('Authenticating...'); setIsFlashing(false); }, 800);
    setTimeout(() => { setStatus('Terminal Synchronized'); setIsFlashing(true); }, 1600);
    setTimeout(() => { setStatus(null); setIsFlashing(false); }, 3000);
  }, [status]);

  useEffect(() => {
    const handleGlobalKey = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') return;
      if (e.key === 'l' || e.key === 'L') {
        e.preventDefault();
        handleAccess();
      }
    };
    window.addEventListener('keydown', handleGlobalKey);

    return () => {
      window.removeEventListener('keydown', handleGlobalKey);
    };
  }, [handleAccess]);

  return (
    <div data-sentinel="laptop-terminal" className="flex flex-col items-center gap-2">
      <div className="h-4 flex items-center justify-center" aria-live="polite">
        {status && <div className="text-[10px] font-mono text-neon-red animate-pulse uppercase">{status}</div>}
      </div>
      <button
        type="button"
        onClick={handleAccess}
        aria-label="Access Terminal (Workstation) [Shortcut: L]"
        style={{ transform: 'rotateX(-35deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
        className="group relative w-48 h-32 transition-all hover:scale-105 focus-visible:scale-105 active:translate-y-1 focus:outline-none transform-gpu"
      >
        <FocusIndicator color="neon-red" />
        {/* Laptop Screen (Open) */}
        <div className="absolute top-0 left-4 right-4 h-24 bg-obsidian border border-grey-medium rounded-t-sm overflow-hidden flex flex-col pointer-events-none">
          <div className="h-1.5 bg-grey-dark border-b border-grey-medium flex items-center px-1 gap-0.5">
            <div className="w-1 h-1 rounded-full bg-neon-red/40" /><div className="w-1 h-1 rounded-full bg-neon-amber/40" />
          </div>
          <div
            aria-live="polite"
            className={`flex-1 p-2 font-mono text-[10px] text-left text-grey-medium leading-tight transition-all duration-300 ${isFlashing ? 'brightness-150' : ''}`}
          >
            <div className="text-neon-red opacity-80">{">"} {status || 'SYSTEM_READY'}</div>
            {logs.length > 0 ? (
              <div className="mt-1 space-y-0.5">
                {logs.map((log, i) => (
                  <div key={`${log}-${i}`} className={i === 0 ? "text-neon-amber/80" : "opacity-40"}>{log}</div>
                ))}
              </div>
            ) : (
              <>
                <div className="mt-1 opacity-40">Loading Obelisk OS v0.1.0</div>
                <div className="mt-1 opacity-40">System Link: ACTIVE</div>
              </>
            )}
            <div className="mt-2 animate-pulse">_</div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-10 bg-grey-dark border-x border-b border-grey-medium rounded-b-sm [transform:rotateX(45deg)] origin-top">
          <div className="absolute inset-2 grid grid-cols-6 gap-0.5 opacity-20">{Array.from({ length: 12 }).map((_, i) => (<div key={i} className="bg-grey-medium h-1" />))}</div>
        </div>

        {/* Label hidden until focus/hover */}
        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-red opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 whitespace-nowrap transition-opacity uppercase tracking-tighter">
          Terminal / IDEal / 4ward [L]
        </span>
      </button>
    </div>
  );
};
