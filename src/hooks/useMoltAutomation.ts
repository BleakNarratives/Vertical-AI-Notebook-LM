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
  const { logSecurityEvent, rotateDecoys, checkBlacklist, triggerBlacklist } = useSentinel();
  const [cyclesRun, setCyclesRun] = useState(0);
  const [isLockdown, setIsLockdown] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const MAX_AUTONOMOUS_CYCLES = 10;

  // Check for lockdown and blacklist state on mount and updates
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkStatus = () => {
      const blacklisted = checkBlacklist();
      setIsBlacklisted(blacklisted);

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

    checkStatus();
    const interval = setInterval(checkStatus, 10000);
    return () => clearInterval(interval);
  }, [checkBlacklist]);

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

    if (alerts.length >= 3 && !isLockdown && !isBlacklisted) {
      const lockdownExpiry = now + 300000; // 5 minute lockdown
      localStorage.setItem('sentinel_lockdown', lockdownExpiry.toString());
      setIsLockdown(true);
      logSecurityEvent('SYSTEM LOCKDOWN INITIATED: Multiple high-severity breaches detected.', 'CRITICAL');
    }
  }, [logSecurityEvent, isLockdown, isBlacklisted]);

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

    const handleShadowRecorded = (e: Event) => {
      const customEvent = e as CustomEvent;
      const count = customEvent.detail?.count || 0;
      if (count >= 5) {
        attemptAutonomousImprovement(`Shadow Sequence detected (${count} logs). Initiating autonomous reconstruction.`);
      }
    };

    const handleDecoyBreach = () => {
      rotateDecoys();

      // Track decoy breaches for blacklisting
      const key = 'sentinel_decoy_breaches';
      const stored = localStorage.getItem(key);
      let breaches = 0;
      try {
        if (stored) breaches = parseInt(stored, 10);
      } catch { breaches = 0; }

      breaches += 1;
      localStorage.setItem(key, breaches.toString());

      if (breaches >= 5) {
        triggerBlacklist();
        setIsBlacklisted(true);
      }

      attemptAutonomousImprovement('Decoy breach detected. Rotating defensive signatures.');
    };

    const handleBlacklist = () => {
      setIsBlacklisted(true);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('security-alert', handleSecurityAlert);
      window.addEventListener('sentinel-shadow-recorded', handleShadowRecorded);
      window.addEventListener('sentinel-decoy-breach', handleDecoyBreach);
      window.addEventListener('sentinel-blacklist', handleBlacklist);
      return () => {
        window.removeEventListener('security-alert', handleSecurityAlert);
        window.removeEventListener('sentinel-shadow-recorded', handleShadowRecorded);
        window.removeEventListener('sentinel-decoy-breach', handleDecoyBreach);
        window.removeEventListener('sentinel-blacklist', handleBlacklist);
      };
    }
  }, [attemptAutonomousImprovement, trackSecurityEvent, rotateDecoys, triggerBlacklist]);

  // Idle Entropy Trigger - Maintain resonance during inactivity
  useEffect(() => {
    if (typeof window === 'undefined' || isLockdown || isBlacklisted) return;

    let idleTimer: NodeJS.Timeout;
    const IDLE_THRESHOLD = 180000; // 3 minutes

    const resetTimer = () => {
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        attemptAutonomousImprovement('Idle Entropy Resonance detected.');
      }, IDLE_THRESHOLD);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    resetTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [attemptAutonomousImprovement, isLockdown, isBlacklisted]);

  return { cyclesRun, isImproving, level, isLockdown, isBlacklisted, triggerMolt };
};
