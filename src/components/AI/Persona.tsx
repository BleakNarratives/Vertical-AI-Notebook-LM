'use client';

import React from 'react';

interface PersonaProps {
  name: string;
  role: string;
  status: 'idle' | 'active' | 'distorted';
}

export const Persona: React.FC<PersonaProps> = ({ name, role, status }) => {
  return (
    <div
      role="region"
      aria-label={`${name} (${role}) - Status: ${status}`}
      className="flex flex-col items-center gap-2 p-4 border border-grey-medium bg-obsidian group"
    >
      <div className={`
        w-24 h-32 bg-grey-dark relative overflow-hidden transition-all duration-500
        ${status === 'active' ? 'border-neon-red border-2' : 'border-grey-medium border'}
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
        <h3 className="text-[10px] font-mono text-neon-red uppercase tracking-[0.2em]">{name}</h3>
        <p className="text-[8px] font-mono text-grey-medium uppercase">{role}</p>
      </div>
    </div>
  );
};
