'use client';

import { useSentinel } from "@/hooks/useSentinel";
import { useEffect, useState } from "react";

/**
 * Honeytoken - A security decoy component.
 * Appears as a subtle, potentially sensitive data fragment to bait scanners or unauthorized interaction.
 * Triggers a CRITICAL security alert upon interaction.
 */
interface DecoyConfig {
  posIndex: number;
  payload: {
    label: string;
    secret: string;
  };
  timestamp: number;
}

export const Honeytoken = () => {
  const { triggerHoneytoken, getDecoyConfig } = useSentinel();
  const [config, setConfig] = useState<DecoyConfig | null>(getDecoyConfig);

  useEffect(() => {
    const handleRotation = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      setConfig(detail);
    };

    window.addEventListener('sentinel-decoys-rotated', handleRotation);
    return () => window.removeEventListener('sentinel-decoys-rotated', handleRotation);
  }, [getDecoyConfig]);

  if (!config) return null;

  const posClasses = [
    'bottom-12 left-12',
    'bottom-12 right-12',
    'top-20 left-12',
    'top-20 right-12',
    'bottom-32 left-32'
  ];

  return (
    <button
      type="button"
      onClick={() => triggerHoneytoken('click')}
      onFocus={() => triggerHoneytoken('focus')}
      style={{ transform: 'rotateX(-20deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}
      className={`group absolute ${posClasses[config.posIndex] || posClasses[0]} p-2 focus:outline-none transition-all duration-1000 transform-gpu`}
      aria-label="System credentials fragment"
    >
      <div className="flex flex-col gap-1 opacity-5 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-500">
        <span className="text-[8px] font-mono text-grey-medium uppercase tracking-tighter">
          {config.payload.label}
        </span>
        <div className="flex gap-2 items-center">
          <div className="w-1 h-1 bg-neon-amber animate-pulse" />
          <span className="text-[10px] font-mono text-neon-amber/50 group-hover:text-neon-amber transition-colors">
            {config.payload.secret}
          </span>
        </div>
      </div>

      {/* Invisible hitbox for scanners that don't trigger hover/focus but might click/scrape */}
      <span className="sr-only">Access production database credentials</span>
    </button>
  );
};
