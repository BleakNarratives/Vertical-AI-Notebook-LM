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
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-busy={status === 'active'}
      aria-label={`${name} (${role}) - Status: ${status}`}
      style={{ transform: 'rotateX(-20deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
      className={`relative flex flex-col items-center gap-2 p-4 border border-grey-medium bg-obsidian group transform-gpu transition-all hover:enabled:scale-105 focus-visible:enabled:scale-105 hover:enabled:border-neon-red focus-visible:enabled:border-neon-red outline-none disabled:opacity-50 disabled:cursor-not-allowed active:enabled:translate-y-1 ${status === 'active' ? 'shadow-[0_0_15px_rgba(255,0,0,0.3)]' : ''}`}
    >
      <div className={`
        w-24 h-32 bg-grey-dark relative overflow-hidden transition-all duration-500
        ${status === 'active' ? 'border-neon-red border-2 animate-pulse' : 'border-grey-medium border'}
        ${status === 'distorted' ? 'animate-pulse scale-95 opacity-50' : ''}
      `}>
        {/* Ragtag Business Suit Aesthetic (Abstract) */}
        <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
          <div className="absolute top-8 left-4 w-16 h-20 border-l border-t border-grey-medium" />
          <div className="absolute top-10 left-6 w-12 h-16 border-r border-b border-grey-medium rotate-3" />
        </div>

        {/* Pin Cushion Effect (Easter Egg/Visual) */}
        <div className="absolute top-1/4 left-1/3 w-0.5 h-6 bg-neon-amber/40 rotate-45" />
        <div className="absolute top-1/2 left-2/3 w-0.5 h-8 bg-neon-red/40 -rotate-12" />
        <div className="absolute top-2/3 left-1/4 w-0.5 h-5 bg-white/20 rotate-[120deg]" />
      </div>

      <div className="text-center">
        <h3 className="text-xs font-mono text-neon-red uppercase tracking-[0.2em]">{name}</h3>
        <p className="text-xs font-mono text-white/40 group-hover:text-white/80 group-focus-visible:text-white/80 uppercase transition-colors">{role}</p>
      </div>

      <FocusIndicator color="neon-red" />
    </button>
  );
};
