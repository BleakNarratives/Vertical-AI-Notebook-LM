'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const useHiggins = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const { logSecurityEvent } = useSentinel();

  const consultHiggins = useCallback(async () => {
    setIsProcessing(true);
    triggerAgent('higgins');

    logSecurityEvent('Gateway Protocol initiated via Higgins', 'MEDIUM');

    // Simulate gateway protocol verification
    console.log('Higgins: Verifying clearance levels...');
    await new Promise(resolve => setTimeout(resolve, 1500));

    console.log('Higgins: Welcome to the Code City. Please proceed to the Obelisk.');
    setIsProcessing(false);
  }, [logSecurityEvent]);

  return { consultHiggins, isProcessing };
};
