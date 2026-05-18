'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const useHiggins = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { logSecurityEvent, checkRateLimit, trackShadowTrigger } = useSentinel();

  const consultHiggins = useCallback(async () => {
    // Enforce rate limiting: 3 calls per 60 seconds
    if (!checkRateLimit('consultHiggins', 3, 60000)) {
      trackShadowTrigger('consultHiggins', 3);
      return;
    }

    setIsProcessing(true);
    triggerAgent('higgins');

    logSecurityEvent('Gateway Protocol initiated via Higgins', 'LOW');

    // Simulate gateway protocol verification
    console.log('Higgins: Verifying clearance levels...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Higgins: Welcome to the Code City. Please proceed to the Obelisk.');
    setIsProcessing(false);
  }, [logSecurityEvent, checkRateLimit, trackShadowTrigger]);

  return { consultHiggins, isProcessing };
};
