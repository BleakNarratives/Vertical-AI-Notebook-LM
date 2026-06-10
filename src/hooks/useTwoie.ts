'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';
import { useSentinel } from './useSentinel';

export const useTwoie = () => {
  const [isExecuting, setIsExecuting] = useState(false);
  const { logSecurityEvent, checkRateLimit, sanitizeInput, validateInput, verifyInteraction } = useSentinel();

  const executeTask = useCallback(async (task: string, e?: React.UIEvent | Event) => {
    if (e && !verifyInteraction(e)) return;
    if (!checkRateLimit('executeTask', 5, 30000)) return;
    if (!validateInput(task)) return;

    const safeTask = sanitizeInput(task);
    setIsExecuting(true);
    triggerAgent('twoie');
    logSecurityEvent(`Execution Initiated: Twoie [Task: ${safeTask.substring(0, 20)}...]`, 'MEDIUM');

    console.log(`Twoie: Executing task: ${safeTask}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Twoie: Task finalized. No witnesses.');
    setIsExecuting(false);
  }, [logSecurityEvent, checkRateLimit, sanitizeInput, validateInput, verifyInteraction]);

  return { executeTask, isExecuting };
};
