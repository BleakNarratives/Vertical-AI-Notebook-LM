'use client';

import { useEffect, useCallback, useState } from 'react';
import { useMolt } from './useMolt';
import { useSentinel } from './useSentinel';

interface SecurityAlertEvent extends CustomEvent {
  detail: {
    event: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: string;
  };
}

/**
 * useMoltAutomation - Autonomous trigger system for Molt recursive improvement.
 * Listens for system activity and security events to trigger improvements "within reason".
 */
export const useMoltAutomation = () => {
  const { triggerMolt, level, isImproving } = useMolt();
  const { logSecurityEvent } = useSentinel();
  const [cyclesRun, setCyclesRun] = useState(0);
  const [isLockdown, setIsLockdown] = useState(false);
  const MAX_AUTONOMOUS_CYCLES = 5;

  // Check for lockdown on mount and during alerts
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkLockdown = () => {
      const stored = localStorage.getItem('sentinel_lockdown');
      if (stored) {
        const lockdownExpiry = parseInt(stored, 10);
        if (Date.now() < lockdownExpiry) {
          setIsLockdown(true);
          // Set a timeout to clear lockdown state
          const remaining = lockdownExpiry - Date.now();
          setTimeout(() => setIsLockdown(false), remaining);
        } else {
          localStorage.removeItem('sentinel_lockdown');
          setIsLockdown(false);
        }
      }
    };

    checkLockdown();
  }, []);

  const triggerLockdown = useCallback(() => {
    const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    localStorage.setItem('sentinel_lockdown', expiry.toString());
    setIsLockdown(true);
    logSecurityEvent('SYSTEM LOCKDOWN INITIATED: 5-minute cooldown active.', 'CRITICAL');
    setTimeout(() => setIsLockdown(false), 5 * 60 * 1000);
  }, [logSecurityEvent]);

  const attemptAutonomousImprovement = useCallback(async (reason: string) => {
    if (cyclesRun >= MAX_AUTONOMOUS_CYCLES) {
      console.log(`[🤖 MOLT] Maximum autonomous cycles (${MAX_AUTONOMOUS_CYCLES}) reached. Awaiting manual override.`);
      return;
    }

    if (isImproving) return;

    console.log(`[🤖 MOLT] Autonomous trigger activated: ${reason}`);
    logSecurityEvent(`Autonomous Molt cycle ${cyclesRun + 1} triggered: ${reason}`, 'MEDIUM');

    setCyclesRun(prev => prev + 1);
    await triggerMolt();
  }, [triggerMolt, isImproving, logSecurityEvent, cyclesRun]);

  useEffect(() => {
    const handleSecurityAlert = (e: Event) => {
      const securityEvent = e as SecurityAlertEvent;
      const { severity, event } = securityEvent.detail;

      if (severity === 'HIGH' || severity === 'CRITICAL') {
        // Track high-severity alerts for lockdown
        const alerts = JSON.parse(localStorage.getItem('sentinel_alert_history') || '[]');
        const now = Date.now();
        const recentAlerts = [...alerts.filter((a: number) => now - a < 300000), now];
        localStorage.setItem('sentinel_alert_history', JSON.stringify(recentAlerts));

        if (recentAlerts.length >= 3 && !isLockdown) {
          triggerLockdown();
        }

        attemptAutonomousImprovement(`Security hardening required: ${event}`);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('security-alert', handleSecurityAlert);
      return () => window.removeEventListener('security-alert', handleSecurityAlert);
    }
  }, [attemptAutonomousImprovement, isLockdown, triggerLockdown]);

  return { cyclesRun, isImproving, level, isLockdown };
};
