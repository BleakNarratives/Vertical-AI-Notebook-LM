'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const useHiggins = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [shadowCounter, setShadowCounter] = useState(0);
  const { logSecurityEvent, checkRateLimit } = useSentinel();

  const consultHiggins = useCallback(async () => {
    // Enforce rate limiting: 3 calls per 60 seconds
    if (!checkRateLimit('consultHiggins', 3, 60000)) {
      const newCount = shadowCounter + 1;
      if (newCount >= 3) { // 3rd attempt while rate-limited
        logSecurityEvent('SHADOW SEQUENCE DETECTED: Higgins Gateway under siege. Initializing defensive recursion.', 'CRITICAL');
        setShadowCounter(0); // Reset counter after triggering
      } else {
        setShadowCounter(newCount);
      }
      return;
    }

    setShadowCounter(0);
    setIsProcessing(true);
    triggerAgent('higgins');

    logSecurityEvent('Gateway Protocol initiated via Higgins', 'LOW');

    // Simulate gateway protocol verification
    console.log('Higgins: Verifying clearance levels...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Higgins: Welcome to the Code City. Please proceed to the Obelisk.');
    setIsProcessing(false);
  }, [logSecurityEvent, checkRateLimit, shadowCounter]);

  return { consultHiggins, isProcessing };
};
