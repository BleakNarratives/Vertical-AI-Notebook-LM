'use client';

import React from 'react';
import { FocusIndicator } from '../Boardroom/FocusIndicator';

interface PersonaProps {
  name: string;
  role: string;
  status: 'idle' | 'active' | 'distorted';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  disabled?: boolean;
}

export const Persona: React.FC<PersonaProps> = ({ name, role, status, onClick, disabled }) => {
  const isBusy = status === 'active';
  const isControlDisabled = disabled || isBusy;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (onClick) onClick(e);
    window.dispatchEvent(new CustomEvent('sentinel-boardroom-action', {
      detail: { source: name, action: 'CONSULT' }
    }));
  };

  const titleText = disabled
    ? `Consultation for ${name} is unavailable during active system restrictions`
    : isBusy
    ? `Consultation with ${name} (${role}) in progress...`
    : `Consult ${name} (${role})`;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isControlDisabled}
      title={titleText}
      aria-busy={isBusy}
      aria-label={`${name} (${role}) - Status: ${status}`}
      style={{ transform: 'rotateX(-35deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
      className={`relative flex flex-col items-center gap-2 p-4 border border-grey-medium bg-obsidian group transform-gpu transition-all hover:enabled:scale-105 focus-visible:enabled:scale-105 hover:enabled:border-neon-red focus-visible:enabled:border-neon-red outline-none active:enabled:translate-y-1 ${
        disabled
          ? 'opacity-50 cursor-not-allowed'
          : isBusy
          ? 'opacity-80 cursor-wait shadow-[0_0_15px_rgba(255,0,0,0.3)]'
          : ''
      }`}
    >
      {/* Persistent Name Label */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-mono text-neon-red uppercase tracking-[0.2em] whitespace-nowrap drop-shadow-[0_0_5px_rgba(255,0,0,0.5)] z-10">
        {name}
      </div>

      <div className={`
        w-24 h-32 bg-grey-dark relative overflow-hidden transition-all duration-500
        ${isBusy ? 'border-neon-red border-2 animate-pulse shadow-[0_0_20px_rgba(255,0,0,0.4)]' : 'border-grey-medium border'}
        ${status === 'distorted' ? 'animate-pulse scale-95 opacity-50' : ''}
      `}>
        {/* Floor Glow */}
        {isBusy && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(255,0,0,0.4)_0%,transparent_70%)] animate-pulse" />
        )}

        {/* Active Processing Indicator */}
        {isBusy && (
          <div className="absolute top-2 right-2 z-20 flex items-center gap-1 bg-obsidian/80 px-1.5 py-0.5 border border-neon-red/60 text-[8px] font-mono text-neon-red tracking-tighter">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-red animate-ping" />
            <span>BUSY</span>
          </div>
        )}

        {/* Ragtag Business Suit Aesthetic (Abstract) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-8 left-4 w-16 h-20 border-l border-t border-grey-medium" />
          <div className="absolute top-10 left-6 w-12 h-16 border-r border-b border-grey-medium rotate-3" />
        </div>
        <div className="absolute top-1/4 left-1/3 w-0.5 h-6 bg-neon-amber/40 rotate-45" />
        <div className="absolute top-1/2 left-2/3 w-0.5 h-8 bg-neon-red/40 -rotate-12" />
      </div>
      <div className="text-center mt-2">
        <p className="text-xs font-mono text-white/40 uppercase transition-colors">{role}</p>
        <span className="block text-xs font-mono text-neon-red uppercase tracking-[0.2em] mt-1">{name}</span>
      </div>

      {/* Focus indicator */}
      {!isControlDisabled && <FocusIndicator color="neon-red" />}
    </button>
  );
};
