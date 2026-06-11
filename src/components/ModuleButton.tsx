'use client';

import React from 'react';

interface ModuleButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent | React.KeyboardEvent) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
}

export const ModuleButton: React.FC<ModuleButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  isLoading = false
}) => {
  const isActuallyDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={(e) => onClick?.(e)}
      disabled={isActuallyDisabled}
      aria-busy={isLoading}
      className={`
        group relative px-4 py-2 text-xs font-mono uppercase tracking-widest transition-all duration-300
        active:scale-[0.98] active:duration-75
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian
        active:enabled:scale-[0.98]
        ${isActuallyDisabled ? 'opacity-50 grayscale cursor-not-allowed' : ''}
        ${variant === 'primary'
          ? 'bg-grey-dark text-neon-red border border-grey-medium hover:enabled:bg-neon-red hover:enabled:text-obsidian hover:enabled:shadow-[0_0_15px_rgba(255,0,0,0.5)] focus-visible:enabled:bg-neon-red focus-visible:enabled:text-obsidian focus-visible:ring-neon-red'
          : 'bg-obsidian text-grey-medium border border-grey-dark hover:enabled:border-neon-amber hover:enabled:text-neon-amber focus-visible:enabled:border-neon-amber focus-visible:enabled:text-neon-amber focus-visible:ring-neon-amber'}
      `}
    >
      <span className="relative z-10">{label}</span>
      <div className="absolute inset-0 opacity-0 group-hover:enabled:opacity-10 group-focus-visible:enabled:opacity-10 bg-white transition-opacity duration-300" />

      {/* Glitch effect corners */}
      <div className={"absolute top-0 left-0 w-1 h-1 opacity-0 group-hover:enabled:opacity-100 group-focus-visible:enabled:opacity-100 transition-all duration-300 " + (variant === 'primary' ? 'bg-neon-red' : 'bg-neon-amber')} />
      <div className={"absolute bottom-0 right-0 w-1 h-1 opacity-0 group-hover:enabled:opacity-100 group-focus-visible:enabled:opacity-100 transition-all duration-300 " + (variant === 'primary' ? 'bg-neon-red' : 'bg-neon-amber')} />
    </button>
  );
};
