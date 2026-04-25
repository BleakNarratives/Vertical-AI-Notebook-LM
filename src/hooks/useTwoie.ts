'use client';

import { useState, useCallback } from 'react';
import { triggerAgent } from '@/lib/agents';

export const useTwoie = () => {
  const [isExecuting, setIsExecuting] = useState(false);

  const executeTask = useCallback(async (task: string) => {
    setIsExecuting(true);
    triggerAgent('twoie');

    console.log(`Twoie: Executing task: ${task}`);
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Twoie: Task finalized. No witnesses.');
    setIsExecuting(false);
  }, []);

  return { executeTask, isExecuting };
};
