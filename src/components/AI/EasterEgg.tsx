'use client';

import React, { useState } from 'react';
import { useMoltAutomation } from '@/hooks/useMoltAutomation';
import { useSentinel } from '@/hooks/useSentinel';

export const EasterEgg: React.FC = () => {
  const [revealed, setRevealed] = useState(false);
  const [spent, setSpent] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);

  const { isLockdown, isBlacklisted, level, triggerMolt } = useMoltAutomation();
  const { logSecurityEvent, rotateDecoys } = useSentinel();

  const handleChoice = (choice: 'A' | 'B' | 'C') => {
    if (spent) return;
    setSpent(true);
    setSelectedChoice(choice);

    if (choice === 'A') {
      logSecurityEvent('EASTER_EGG: Force multiplier overclocked Higgins Gateway.', 'HIGH');
      window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
        detail: { source: 'MRS_HIGGINS', action: 'OVERCLOCK', timestamp: new Date().toISOString() }
      }));
    } else if (choice === 'B') {
      logSecurityEvent('EASTER_EGG: Force multiplier rotated defensive signatures.', 'HIGH');
      rotateDecoys();
    } else if (choice === 'C') {
      logSecurityEvent('EASTER_EGG: Force multiplier bypassed Molt engine thresholds.', 'CRITICAL');
      triggerMolt();
    }
  };

  return (
    <div className="fixed bottom-4 left-4 z-[99] flex flex-col items-start">
      <button
        aria-expanded={revealed}
        aria-label="Reveal hidden Obelisk terminal"
        className="w-4 h-4 cursor-help bg-neon-amber/10 border border-neon-amber/20 hover:bg-neon-amber/30 focus-visible:ring-1 focus-visible:ring-neon-amber transition-all duration-300 rounded flex items-center justify-center text-[8px] font-mono text-neon-amber/60 hover:text-neon-amber"
        onClick={() => setRevealed(!revealed)}
      >
        Ω
      </button>

      {revealed && (
        <div className="mt-2 p-4 bg-obsidian/95 border border-neon-amber text-[10px] font-mono text-neon-amber shadow-[0_0_20px_rgba(255,191,0,0.2)] max-w-[280px] animate-in fade-in slide-in-from-bottom-2 select-none">
          <div className="flex items-center justify-between border-b border-neon-amber/30 pb-1 mb-2">
            <span className="font-bold tracking-widest text-neon-red">⚠️ STRATEGIC FORCE MULTIPLIER</span>
            <span className="text-[8px] opacity-40">v1.0.9-ONE-SHOT</span>
          </div>

          <p className="mb-2 opacity-80 leading-relaxed">
            {isBlacklisted
              ? "STATUS: [⛔ SESSION REVOKED]. System is entirely non-interactive."
              : isLockdown
              ? "STATUS: [🚨 LOCKDOWN ACTIVE]. Countermeasures active. Cooldown override required."
              : `STATUS: [⚡ NOMINAL]. Molt Level: ${level}. Quantum stability index optimal.`}
          </p>

          {spent ? (
            <div className="text-center py-2 border border-neon-red/40 bg-neon-red/10 text-neon-red text-[9px] uppercase tracking-widest animate-pulse">
              [ FUSION CORE DEPLETED - SELECTION REGISTERED ]
              <div className="mt-1 text-[8px] text-grey-medium opacity-60">
                Action: {selectedChoice === 'A' ? 'Gateway Overclock' : selectedChoice === 'B' ? 'Signature Rotation' : 'Molt Override'}
              </div>
            </div>
          ) : (
            <div className="space-y-1 mt-3">
              <button
                type="button"
                onClick={() => handleChoice('A')}
                className="w-full text-left p-1 border border-neon-amber/25 hover:bg-neon-amber/10 hover:border-neon-amber focus:outline-none transition-all block cursor-pointer"
              >
                [A] OVERCLOCK GATEWAY PROT
              </button>
              <button
                type="button"
                onClick={() => handleChoice('B')}
                className="w-full text-left p-1 border border-neon-amber/25 hover:bg-neon-amber/10 hover:border-neon-amber focus:outline-none transition-all block cursor-pointer"
              >
                [B] ROTATE DECOY RECON
              </button>
              <button
                type="button"
                onClick={() => handleChoice('C')}
                className="w-full text-left p-1 border border-neon-amber/25 hover:bg-neon-amber/10 hover:border-neon-amber focus:outline-none transition-all block cursor-pointer"
              >
                [C] TRANSCENDENT MOLT ENGINE
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
