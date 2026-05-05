'use client';

import React from 'react';
import { useSentinel } from '@/hooks/useSentinel';

/**
 * Honeytoken Component
 *
 * A security decoy designed to bait automated scanners or curious users.
 * Interacting with this component triggers a CRITICAL security alert.
 *
 * Aesthetic: Bleak-Minimalist, nearly invisible.
 */
export const Honeytoken: React.FC = () => {
  const { triggerHoneytoken } = useSentinel();

  // Fake sensitive data to bait scanners
  const DECOY_SECRET = "sk_live_bleak_shadow_777_DO_NOT_ACCESS";

  return (
    <div
      className="group absolute bottom-0 left-0 p-1 select-none pointer-events-auto cursor-default"
      onClick={triggerHoneytoken}
      onFocus={triggerHoneytoken}
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="opacity-[0.02] group-hover:opacity-10 transition-opacity duration-1000">
        <code className="text-[8px] font-mono text-neon-amber">
          {/* decoy payload */}
          system_auth_bypass_key: {DECOY_SECRET}
        </code>
      </div>
    </div>
  );
};
