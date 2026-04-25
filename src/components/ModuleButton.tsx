'use client';

import React from 'react';

interface ModuleButtonProps {
  label: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const ModuleButton: React.FC<ModuleButtonProps> = ({
  label,
  onClick,
  variant = 'primary'
}) => {
  return (
    <button
      onClick={onClick}
      className={`
        group relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian
        ${variant === 'primary'
          ? 'bg-grey-dark text-neon-red border border-grey-medium hover:bg-neon-red hover:text-obsidian hover:shadow-[0_0_15px_rgba(255,0,0,0.5)] focus-visible:ring-neon-red'
          : 'bg-obsidian text-grey-medium border border-grey-dark hover:border-neon-amber hover:text-neon-amber focus-visible:ring-neon-amber'}
      `}
    >
      <span className="relative z-10">{label}</span>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-10 bg-white transition-opacity duration-300" />

      {/* Glitch effect corners */}
      <div className="absolute top-0 left-0 w-1 h-1 bg-neon-red opacity-0 group-hover:opacity-100" />
      <div className="absolute bottom-0 right-0 w-1 h-1 bg-neon-red opacity-0 group-hover:opacity-100" />
    </button>
  );
};
