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

  // Check for lockdown state on mount and updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkLockdown = () => {
      const stored = localStorage.getItem('sentinel_lockdown');
      if (stored) {
        const expiry = parseInt(stored, 10);
        if (Date.now() < expiry) {
          setIsLockdown(true);
          return;
        } else {
          localStorage.removeItem('sentinel_lockdown');
        }
      }
      setIsLockdown(false);
    };

    checkLockdown();
    const interval = setInterval(checkLockdown, 10000);
    return () => clearInterval(interval);
  }, []);

  const trackSecurityEvent = useCallback((severity: string) => {
    if (typeof window === 'undefined') return;

    const key = 'sentinel_high_alerts';
    const now = Date.now();
    const stored = localStorage.getItem(key);
    let alerts: number[] = [];

    try {
      if (stored) alerts = JSON.parse(stored);
    } catch { alerts = []; }

    // Filter alerts from the last 5 minutes
    alerts = alerts.filter(ts => now - ts < 300000);

    if (severity === 'HIGH' || severity === 'CRITICAL') {
      alerts.push(now);
    }

    localStorage.setItem(key, JSON.stringify(alerts));

    if (alerts.length >= 3) {
      const lockdownExpiry = now + 300000; // 5 minute lockdown
      localStorage.setItem('sentinel_lockdown', lockdownExpiry.toString());
      setIsLockdown(true);
      logSecurityEvent('SYSTEM LOCKDOWN INITIATED: Multiple high-severity breaches detected.', 'CRITICAL');
    }
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

      // Prevent recursive loop from lockdown notification
      if (event.includes('SYSTEM LOCKDOWN INITIATED')) return;

      if (severity === 'HIGH' || severity === 'CRITICAL') {
        trackSecurityEvent(severity);
        attemptAutonomousImprovement(`Security hardening required due to ${severity} alert.`);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('security-alert', handleSecurityAlert);
      return () => window.removeEventListener('security-alert', handleSecurityAlert);
    }
  }, [attemptAutonomousImprovement, trackSecurityEvent]);

  return { cyclesRun, isImproving, level, isLockdown, triggerMolt };
};
