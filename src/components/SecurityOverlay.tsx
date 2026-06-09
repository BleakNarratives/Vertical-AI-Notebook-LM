'use client';

import React, { useEffect, useState } from 'react';

interface AlertDetail {
  event: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  timestamp: string;
}

export const SecurityOverlay: React.FC = () => {
  const [alert, setAlert] = useState<AlertDetail | null>(null);

  useEffect(() => {
    const handle = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail && ['HIGH', 'CRITICAL'].includes(detail.severity)) {
        setAlert(detail);
        setTimeout(() => setAlert(null), 5000);
      }
    };
    window.addEventListener('security-alert', handle);
    return () => window.removeEventListener('security-alert', handle);
  }, []);

  if (!alert) return null;

  return (
    <div data-sentinel="security-overlay" className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-neon-red/20 animate-pulse" />
      <div className="relative p-6 border-2 border-neon-red bg-obsidian shadow-[0_0_30px_rgba(255,0,0,0.4)] max-w-sm w-full font-mono animate-in zoom-in duration-300">
        <div className="flex items-center gap-3 mb-3 border-b border-neon-red/30 pb-2">
          <div className="w-8 h-8 bg-neon-red text-obsidian flex items-center justify-center font-bold">!</div>
          <h2 className="text-neon-red text-sm font-bold uppercase tracking-tighter">BREACH DETECTED</h2>
        </div>
        <div className="text-[10px] text-white/80 space-y-1">
          <p><span className="text-grey-medium">TYPE:</span> {alert.event}</p>
          <p><span className="text-grey-medium">LVL:</span> {alert.severity}</p>
          <p className="text-neon-red mt-3 animate-pulse">DEPLOYING COUNTERMEASURES...</p>
        </div>
      </div>
    </div>
  );
};
