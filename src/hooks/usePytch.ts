'use client';

import React, { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const usePytch = () => {
  const [isConstructing, setIsConstructing] = useState(false);
  const { logSecurityEvent, checkRateLimit, verifyInteraction } = useSentinel();

  const wakePytch = useCallback(async (e?: React.UIEvent) => {
    if (!verifyInteraction(e)) return;
    if (!checkRateLimit('wakePytch', 3, 60000)) return;

    setIsConstructing(true);
    triggerAgent('pytch');
    logSecurityEvent('Persona Awakened: Pytch', 'LOW');

    // Simulate narrative construction
    console.log('Pytch: Weaving the bleak threads of reality...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Pytch: The narrative has been solidified. Reality is now compliant.');
    setIsConstructing(false);
  }, [logSecurityEvent, checkRateLimit, verifyInteraction]);

  return { wakePytch, isConstructing };
};
