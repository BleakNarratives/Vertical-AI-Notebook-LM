'use client';

import { useSentinel } from "@/hooks/useSentinel";

/**
 * Honeytoken - A security decoy component.
 * Appears as a subtle, potentially sensitive data fragment to bait scanners or unauthorized interaction.
 * Triggers a CRITICAL security alert upon interaction.
 */
export const Honeytoken = () => {
  const { triggerHoneytoken } = useSentinel();

  return (
    <button
      type="button"
      onClick={() => triggerHoneytoken('click')}
      onFocus={() => triggerHoneytoken('focus')}
      className="group absolute bottom-12 left-12 p-2 focus:outline-none transition-all duration-1000"
      aria-label="System credentials fragment"
    >
      <div className="flex flex-col gap-1 opacity-5 group-hover:opacity-100 transition-opacity duration-500">
        <span className="text-[8px] font-mono text-grey-medium uppercase tracking-tighter">
          [ DECOY_ENV_04 ]
        </span>
        <div className="flex gap-2 items-center">
          <div className="w-1 h-1 bg-neon-amber animate-pulse" />
          <span className="text-[10px] font-mono text-neon-amber/50 group-hover:text-neon-amber transition-colors">
            DB_SECRET_KEY: 0x8F2...A4
          </span>
        </div>
      </div>

      {/* Invisible hitbox for scanners that don't trigger hover/focus but might click/scrape */}
      <span className="sr-only">Access production database credentials</span>
    </button>
  );
};
