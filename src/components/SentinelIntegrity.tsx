'use client';

import { useEffect } from 'react';
import { useSentinel } from '@/hooks/useSentinel';

/**
 * SentinelIntegrity - Client component to initialize DOM integrity monitoring.
 * This component should be mounted globally (e.g., in RootLayout).
 */
export const SentinelIntegrity = () => {
  const { monitorIntegrity } = useSentinel();

  useEffect(() => {
    const cleanup = monitorIntegrity();
    return cleanup;
  }, [monitorIntegrity]);

  return null; // This component has no UI
};
