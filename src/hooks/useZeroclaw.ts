'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';

export const useZeroclaw = () => {
  const [isSwarming, setIsSwarming] = useState(false);

  const triggerSwarm = useCallback(async () => {
    setIsSwarming(true);
    triggerAgent('zeroclaw');

    console.log('Zeroclaw: Collective consciousness initiated. Swarming...');
    await new Promise(resolve => setTimeout(resolve, 2500));

    console.log('Zeroclaw: Intelligence distributed. The swarm knows all.');
    setIsSwarming(false);
  }, []);

  return { triggerSwarm, isSwarming };
};
