'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const usePytch = () => {
  const [isConstructing, setIsConstructing] = useState(false);
  const { logSecurityEvent, checkRateLimit, trackShadowTrigger } = useSentinel();

  const wakePytch = useCallback(async () => {
    if (!checkRateLimit('wakePytch', 3, 60000)) {
      trackShadowTrigger('wakePytch', 3);
      return;
    }

    setIsConstructing(true);
    triggerAgent('pytch');
    logSecurityEvent('Persona Awakened: Pytch', 'LOW');

    // Simulate narrative construction
    console.log('Pytch: Weaving the bleak threads of reality...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Pytch: The narrative has been solidified. Reality is now compliant.');
    setIsConstructing(false);
  }, [logSecurityEvent, checkRateLimit, trackShadowTrigger]);

  return { wakePytch, isConstructing };
};
