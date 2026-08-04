'use client';

import { useEffect, useCallback, useState, useRef } from 'react';
import { useMolt } from './useMolt';
import { useSentinel } from './useSentinel';

interface SecurityAlertEvent extends CustomEvent {
  detail: {
    event: string;
    severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    timestamp: string;
    _isBroadcast?: boolean;
  };
}

/**
 * useMoltAutomation - Autonomous trigger system for Molt recursive improvement.
 * Listens for system activity and security events to trigger improvements "within reason".
 */
export const useMoltAutomation = () => {
  const { triggerMolt, level, isImproving } = useMolt();
  const { logSecurityEvent, rotateDecoys, checkBlacklist, triggerBlacklist, secureStore, secureGet, secureRemove, secureJsonParse } = useSentinel();
  const [cyclesRun, setCyclesRun] = useState(0);
  const [isLockdown, setIsLockdown] = useState(false);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);
  const MAX_AUTONOMOUS_CYCLES = 5;

  // Initialize BroadcastChannel for cross-tab security synchronization
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const channel = new BroadcastChannel('sentinel-state-link');
    broadcastChannelRef.current = channel;

    const handleBroadcastMessage = (event: MessageEvent) => {
      const { type, payload } = event.data || {};
      if (type === 'lockdown') {
        const lockdownExpiry = parseInt(payload, 10);
        const remaining = lockdownExpiry - Date.now();
        if (remaining > 0) {
          setIsLockdown(true);
          setTimeout(() => setIsLockdown(false), remaining);
        }
      } else if (type === 'blacklist') {
        setIsBlacklisted(true);
      } else if (type === 'alert') {
        window.dispatchEvent(new CustomEvent('security-alert', {
          detail: { ...payload, _isBroadcast: true }
        }));
      }
    };

    channel.addEventListener('message', handleBroadcastMessage);

    return () => {
      channel.removeEventListener('message', handleBroadcastMessage);
      channel.close();
    };
  }, []);

  // Initialize BroadcastChannel for cross-tab security synchronization
  // Initialize BroadcastChannel for cross-tab security synchronization
  useEffect(() => {
    if (typeof window === 'undefined' || typeof BroadcastChannel === 'undefined') return;
    const channel = new BroadcastChannel('sentinel-state-link');
    broadcastChannelRef.current = channel;

    const handleBroadcast = (event: MessageEvent) => {
      if (!event.data || typeof event.data !== 'object') return;
      const { type, detail } = event.data;

      switch (type) {
        case 'security-alert':
          if (detail && (detail.severity === 'HIGH' || detail.severity === 'CRITICAL')) {
            console.log(`[🛡️ SENTINEL][BROADCAST] Received remote security alert: \${detail.event}`);
            window.dispatchEvent(new CustomEvent('security-alert', {
              detail: { ...detail, _isBroadcast: true }
            }));
          }
          break;
        case 'lockdown':
          setIsLockdown(true);
          break;
        case 'blacklist':
          setIsBlacklisted(true);
          break;
      }
    };

    channel.addEventListener('message', handleBroadcast);
    return () => {
      channel.removeEventListener('message', handleBroadcast);
      channel.close();
    };
  }, []);

  // Check for security states on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkSecurityStates = () => {
      // Check Lockdown
      const storedLockdown = secureGet('sentinel_lockdown');
      if (storedLockdown) {
        const lockdownExpiry = parseInt(storedLockdown, 10);
        if (Date.now() < lockdownExpiry) {
          setIsLockdown(true);
          const remaining = lockdownExpiry - Date.now();
          setTimeout(() => setIsLockdown(false), remaining);
        } else {
          secureRemove('sentinel_lockdown');
        }
      }

      // Check Blacklist
      setIsBlacklisted(checkBlacklist());
    };

    checkSecurityStates();
  }, [checkBlacklist, secureGet, secureRemove]);

  // BroadcastChannel initialization and cleanup
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!broadcastChannelRef.current) {
      broadcastChannelRef.current = new BroadcastChannel('sentinel-state-link');
    }

    const handleMessage = (event: MessageEvent) => {
      const { type, payload } = event.data;
      if (type === 'LOCKDOWN_SYNC') {
        const expiry = parseInt(payload, 10);
        if (Date.now() < expiry) {
          setIsLockdown(true);
          setTimeout(() => setIsLockdown(false), expiry - Date.now());
        }
      } else if (type === 'BLACKLIST_SYNC') {
        setIsBlacklisted(true);
      }
    };

    broadcastChannelRef.current.addEventListener('message', handleMessage);

    return () => {
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.removeEventListener('message', handleMessage);
        broadcastChannelRef.current.close();
        broadcastChannelRef.current = null;
      }
    };
  }, []);

  const triggerLockdown = useCallback(() => {
    if (isLockdown) return;
    const expiry = Date.now() + (5 * 60 * 1000); // 5 minutes
    secureStore('sentinel_lockdown', expiry.toString());
    setIsLockdown(true);

    // Broadcast lockdown to other tabs
    broadcastChannelRef.current?.postMessage({ type: 'lockdown' });

    // Log as MEDIUM to avoid triggering a new high-severity alert loop
    logSecurityEvent('SYSTEM LOCKDOWN INITIATED: 5-minute cooldown active.', 'MEDIUM');
    if (broadcastChannelRef.current) {
      broadcastChannelRef.current.postMessage({ type: 'lockdown', payload: expiry.toString() });
    }
    setTimeout(() => setIsLockdown(false), 5 * 60 * 1000);
  }, [isLockdown, logSecurityEvent, secureStore]);

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
      const { severity, event, _isBroadcast } = securityEvent.detail;

      if (severity === 'HIGH' || severity === 'CRITICAL') {
        // Broadcast high-severity alert to other tabs if not already a broadcast
        if (!_isBroadcast) {
          broadcastChannelRef.current?.postMessage({ type: 'security-alert', detail: securityEvent.detail });
        } else {
          return;
        }

        // Track high-severity alerts for lockdown
        let alerts: number[] = [];
        try {
          const stored = secureGet('sentinel_alert_history');
          if (stored) {
            alerts = secureJsonParse(stored);
            if (!Array.isArray(alerts)) alerts = [];
          }
        } catch { alerts = []; }

        const now = Date.now();
        const recentAlerts = [...alerts.filter((a: number) => now - a < 300000), now];
        secureStore('sentinel_alert_history', JSON.stringify(recentAlerts));

        if (recentAlerts.length >= 3 && !isLockdown) {
          triggerLockdown();
        }

        attemptAutonomousImprovement(`Security hardening required: ${event}`);
      }
    };

    const handleShadowRecorded = (e: Event) => {
      const customEvent = e as CustomEvent;
      const count = customEvent.detail?.count || 0;

      if (count >= 5) {
        logSecurityEvent('SHADOW SEQUENCE DETECTED: Forensic logs expanding rapidly. Initializing reconstruction cycle.', 'CRITICAL');
        attemptAutonomousImprovement('Shadow Sequence forensic reconstruction.');
      }
    };

    const handleDecoyBreach = () => {
      rotateDecoys();

      // Track decoy breaches for blacklisting
      const key = 'sentinel_decoy_breaches';
      const stored = secureGet(key);
      let breaches = 0;
      if (stored) {
        const parsed = parseInt(stored, 10);
        breaches = Number.isNaN(parsed) ? 0 : parsed;
      }

      breaches += 1;
      secureStore(key, breaches.toString());

      if (breaches >= 5) {
        triggerBlacklist();
        setIsBlacklisted(true);
        secureStore(key, '0');
        broadcastChannelRef.current?.postMessage({ type: 'blacklist' });
        secureStore(key, '0');
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({ type: 'BLACKLIST_SYNC' });
        }
      }

      attemptAutonomousImprovement('Decoy breach detected. Rotating defensive signatures.');
    };

    const handleBlacklist = () => {
      setIsBlacklisted(true);
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.postMessage({ type: 'BLACKLIST_SYNC' });
      }
    };

    const handleIntegrityViolation = () => {
      // Soft response to integrity violation to avoid reload loops while maintaining security
      attemptAutonomousImprovement('Integrity violation detected. Reconstructing environment.');
      // After a short delay, if still violated, could reload, but for now we let Molt handle it
    };

    const handleUntrustedInteraction = (e: Event) => {
      const customEvent = e as CustomEvent;
      const type = customEvent.detail?.type || 'unknown';
      logSecurityEvent(`AUTONOMOUS_DEFENSE: Untrusted ${type} interaction detected.`, 'HIGH');
      attemptAutonomousImprovement(`Untrusted interaction: ${type}`);
    };

    const handleVelocityAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { delta, violations } = customEvent.detail || {};
      logSecurityEvent(`AUTONOMOUS_DEFENSE: Velocity violation (${delta}ms). Initiating temporal stabilization.`, 'HIGH');

      if (violations >= 5) {
        const currentThreshold = parseInt(secureGet('sentinel_velocity_threshold') || '50', 10) || 50;
        const newThreshold = Math.min(currentThreshold + 25, 250);
        secureStore('sentinel_velocity_threshold', newThreshold.toString());
        logSecurityEvent(`BEHAVIORAL_ADAPTATION: Increasing velocity threshold to ${newThreshold}ms`, 'MEDIUM');
      }

      attemptAutonomousImprovement(`Velocity anomaly: ${delta}ms`);
    };

    const handleEntropyAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { x, y } = customEvent.detail || {};
      logSecurityEvent(`AUTONOMOUS_DEFENSE: Low entropy interaction at (${x}, ${y}).`, 'HIGH');
      attemptAutonomousImprovement('Low behavioral entropy detected.');
    };

    const handleJitterAlert = (e: Event) => {
      const customEvent = e as CustomEvent;
      const { type, delta } = customEvent.detail || {};
      logSecurityEvent(`AUTONOMOUS_DEFENSE: Zero jitter detected in ${type} sequence (${delta}ms).`, 'HIGH');
      attemptAutonomousImprovement(`Temporal precision anomaly: ${type}`);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('security-alert', handleSecurityAlert);
      window.addEventListener('sentinel-shadow-recorded', handleShadowRecorded);
      window.addEventListener('sentinel-decoy-breach', handleDecoyBreach);
      window.addEventListener('sentinel-blacklist', handleBlacklist);
      window.addEventListener('sentinel-integrity-violation', handleIntegrityViolation);
      window.addEventListener('sentinel-untrusted-interaction', handleUntrustedInteraction);
      window.addEventListener('sentinel-velocity-alert', handleVelocityAlert);
      window.addEventListener('sentinel-entropy-alert', handleEntropyAlert);
      window.addEventListener('sentinel-jitter-alert', handleJitterAlert);
      return () => {
        window.removeEventListener('security-alert', handleSecurityAlert);
        window.removeEventListener('sentinel-shadow-recorded', handleShadowRecorded);
        window.removeEventListener('sentinel-decoy-breach', handleDecoyBreach);
        window.removeEventListener('sentinel-blacklist', handleBlacklist);
        window.removeEventListener('sentinel-integrity-violation', handleIntegrityViolation);
        window.removeEventListener('sentinel-untrusted-interaction', handleUntrustedInteraction);
        window.removeEventListener('sentinel-velocity-alert', handleVelocityAlert);
        window.removeEventListener('sentinel-entropy-alert', handleEntropyAlert);
        window.removeEventListener('sentinel-jitter-alert', handleJitterAlert);
      };
    }
  }, [attemptAutonomousImprovement, isLockdown, triggerLockdown, logSecurityEvent, rotateDecoys, triggerBlacklist, secureGet, secureStore, secureJsonParse]);

  // Integrity Heartbeat: Verify storage consistency and decay adaptive thresholds every 30s
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const interval = setInterval(() => {
      secureGet('sentinel_blacklist');
      secureGet('sentinel_lockdown');

      // Adaptive Threshold Decay: Slowly return to nominal 50ms if no violations
      const currentThreshold = parseInt(secureGet('sentinel_velocity_threshold') || '50', 10);
      if (currentThreshold > 50) {
        const newThreshold = Math.max(currentThreshold - 5, 50);
        secureStore('sentinel_velocity_threshold', newThreshold.toString());
        if (newThreshold === 50) {
          logSecurityEvent('BEHAVIORAL_RECOVERY: Velocity threshold returned to nominal levels.', 'LOW');
        }
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [secureGet, secureStore, logSecurityEvent]);

  return { cyclesRun, isImproving, level, isLockdown, isBlacklisted, triggerMolt };
};
