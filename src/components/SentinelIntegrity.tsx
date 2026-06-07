'use client';

import { useEffect } from 'react';
import { useSentinel } from '@/hooks/useSentinel';

export const SentinelIntegrity = () => {
  const { monitorIntegrity } = useSentinel();

  useEffect(() => {
    const cleanup = monitorIntegrity();
    return () => {
      if (typeof cleanup === 'function') cleanup();
    };
  }, [monitorIntegrity]);

  return null;
};
