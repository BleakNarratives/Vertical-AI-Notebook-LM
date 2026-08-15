'use client';

import React from 'react';

interface ModuleButtonProps {
  label: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  isLoading?: boolean;
  disabledReason?: string;
}

export const ModuleButton: React.FC<ModuleButtonProps> = ({
  label,
  onClick,
  variant = 'primary',
  disabled = false,
  isLoading = false,
  disabledReason
}) => {
  const isActuallyDisabled = disabled || isLoading;
  const titleText = isLoading
    ? 'Operation in progress...'
    : disabled
    ? (disabledReason || 'Action unavailable due to system restrictions')
    : undefined;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isActuallyDisabled}
      title={titleText}
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
      <span className="relative z-10 inline-flex items-center justify-center">
        {isLoading && (
          <svg className="animate-spin -ml-1 mr-2 h-3 w-3 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden="true">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {label}
      </span>
      <div className="absolute inset-0 opacity-0 group-hover:enabled:opacity-10 group-focus-visible:enabled:opacity-10 bg-white transition-opacity duration-300" />

      {/* Glitch effect corners */}
      <div className={"absolute top-0 left-0 w-1 h-1 opacity-0 group-hover:enabled:opacity-100 group-focus-visible:enabled:opacity-100 transition-all duration-300 " + (variant === 'primary' ? 'bg-neon-red' : 'bg-neon-amber')} />
      <div className={"absolute bottom-0 right-0 w-1 h-1 opacity-0 group-hover:enabled:opacity-100 group-focus-visible:enabled:opacity-100 transition-all duration-300 " + (variant === 'primary' ? 'bg-neon-red' : 'bg-neon-amber')} />
    </button>
  );
};
