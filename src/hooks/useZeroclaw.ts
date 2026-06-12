'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const useZeroclaw = () => {
  const [isSwarming, setIsSwarming] = useState(false);
  const { logSecurityEvent, checkRateLimit, verifyInteraction } = useSentinel();

  const triggerSwarm = useCallback(async (event: React.MouseEvent | React.KeyboardEvent) => {
    if (!verifyInteraction(event)) return;
    if (!checkRateLimit('triggerSwarm', 2, 120000)) return;

    setIsSwarming(true);
    triggerAgent('zeroclaw');
    logSecurityEvent('Swarm Activated: Zeroclaw', 'HIGH');

    console.log('Zeroclaw: Collective consciousness initiated. Swarming...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('Zeroclaw: Intelligence distributed. The swarm knows all.');
    setIsSwarming(false);
  }, [logSecurityEvent, checkRateLimit, verifyInteraction]);

  return { triggerSwarm, isSwarming };
};
