'use client';

import { useCallback, useEffect, useRef } from 'react';

/**
 * useSentinel - Security-focused hook for Code City.
 * Provides defensive utilities and security event logging.
 */
export const useSentinel = () => {
  const logSecurityEvent = useCallback((event: string, severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    const timestamp = new Date().toISOString();
    console.warn(`[🛡️ SENTINEL][${severity}][${timestamp}] ${event}`);

    // In a real app, this would send to a secure logging endpoint
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('security-alert', {
        detail: { event, severity, timestamp }
      }));
    }
  }, []);

  const sanitizeInput = useCallback((input: string): string => {
    if (!input) return '';
    // Advanced defense against XSS and injection
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;')
      .replace(/\//g, '&#x2F;')
      .replace(/`/g, '&#x60;')
      .replace(/=/g, '&#x3D;');
  }, []);

  const generateIntegrityHash = useCallback((data: string) => {
    // Simple non-cryptographic hash for integrity simulation
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash.toString(36);
  }, []);

  const storeShadowLog = useCallback((input: string) => {
    if (typeof window === 'undefined') return;
    const key = 'sentinel_shadow_logs';
    const sigKey = 'sentinel_shadow_sig';

    // Unicode-safe Base64 encoding
    const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));

    const stored = localStorage.getItem(key);
    let logs: string[] = [];
    try {
      if (stored) {
        logs = JSON.parse(stored);
        if (!Array.isArray(logs)) logs = [];
      }
    } catch { logs = []; }

    logs.push(encoded);
    if (logs.length > 20) logs.shift(); // Keep last 20

    const dataString = JSON.stringify(logs);
    localStorage.setItem(key, dataString);
    localStorage.setItem(sigKey, generateIntegrityHash(dataString));

    window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: logs.length } }));
  }, [generateIntegrityHash]);

  const validateInput = useCallback((input: string): boolean => {
    // Basic allowlist check
    const allowlist = /^[a-zA-Z0-9\s._\-!?()\[\]*|\/><]+$/;
    if (!allowlist.test(input)) {
      logSecurityEvent(`Input rejected: Invalid characters`, 'HIGH');
      return false;
    }

    // Depth check: Block path traversal and LFI patterns
    const maliciousPatterns = [
      /\.\.\//,         // Path traversal
      /etc\/passwd/,    // LFI target
      /cmd\.exe/,       // RCE attempt
      /<script/i,       // XSS attempt
      /javascript:/i,   // Protocol injection
      /union\s+select/i // SQL injection
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(input)) {
        logSecurityEvent(`CRITICAL: Malicious pattern detected: ${input.substring(0, 15)}...`, 'CRITICAL');
        return false;
      }
    }

    return true;
  }, [logSecurityEvent]);

  const validateRequest = useCallback((token: string) => {
    if (!token || token.length < 32) {
      logSecurityEvent('Invalid or weak session token detected', 'MEDIUM');
      return false;
    }
    return true;
  }, [logSecurityEvent]);

  /**
   * checkRateLimit - Simple client-side rate limiting to prevent trigger spamming.
   */
  const triggerHoneytoken = useCallback((type: string) => {
    logSecurityEvent(`CRITICAL: Interaction with decoy data (${type}) detected.`, 'CRITICAL');
    window.dispatchEvent(new CustomEvent('sentinel-decoy-breach', { detail: { type } }));
  }, [logSecurityEvent]);

  const rotateDecoys = useCallback(() => {
    if (typeof window === 'undefined') return;

    const positions = [0, 1, 2, 3, 4]; // Map to fixed classes

    const payloads = [
      { label: '[ DECOY_ENV_04 ]', secret: 'DB_SECRET_KEY: 0x8F2...A4' },
      { label: '[ JWT_ROOT_KEY ]', secret: 'SIGNING_SECRET: v0od0o...99' },
      { label: '[ AWS_METADATA ]', secret: 'IAM_ROLE: city-admin-prod' },
      { label: '[ SENTRY_DSN ]', secret: 'https://7d3...@o450.ingest' },
      { label: '[ K8S_CONFIG ]', secret: 'CONTEXT: production-cluster-01' }
    ];

    const config = {
      posIndex: positions[Math.floor(Math.random() * positions.length)],
      payload: payloads[Math.floor(Math.random() * payloads.length)],
      timestamp: Date.now()
    };

    localStorage.setItem('sentinel_decoy_config', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sentinel-decoys-rotated', { detail: config }));
    return config;
  }, []);

  const getDecoyConfig = useCallback(() => {
    if (typeof window === 'undefined') return null;
    const stored = localStorage.getItem('sentinel_decoy_config');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, []);

  const triggerBlacklist = useCallback(() => {
    if (typeof window === 'undefined') return;
    const expiry = Date.now() + 86400000; // 24 hours
    localStorage.setItem('sentinel_blacklist', expiry.toString());
    logSecurityEvent('SESSION BLACKLISTED: Repeated security breaches detected. Access revoked for 24h.', 'CRITICAL');
    window.dispatchEvent(new CustomEvent('sentinel-blacklist', { detail: { expiry } }));
  }, [logSecurityEvent]);

  const checkBlacklist = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    const stored = localStorage.getItem('sentinel_blacklist');
    if (stored) {
      const expiry = parseInt(stored, 10);
      if (Date.now() < expiry) {
        return true;
      } else {
        localStorage.removeItem('sentinel_blacklist');
      }
    }
    return false;
  }, []);

  // Integrity Pulse logic
  const lastStateRef = useRef<{
    blacklist: string | null;
    lockdown: string | null;
  }>({ blacklist: null, lockdown: null });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const performIntegrityPulse = () => {
      const currentBlacklist = localStorage.getItem('sentinel_blacklist');
      const currentLockdown = localStorage.getItem('sentinel_lockdown');
      const shadowLogs = localStorage.getItem('sentinel_shadow_logs');
      const shadowSig = localStorage.getItem('sentinel_shadow_sig');

      // 1. Verify Shadow Log Integrity
      if (shadowLogs && shadowSig) {
        const expectedSig = generateIntegrityHash(shadowLogs);
        if (shadowSig !== expectedSig) {
          logSecurityEvent('CRITICAL: Shadow Log tampering detected. Integrity breach.', 'CRITICAL');
          // Clear offending logs to break potential reload loops
          localStorage.removeItem('sentinel_shadow_logs');
          localStorage.removeItem('sentinel_shadow_sig');
          // Only reload if we are not already in a cleared state to avoid loops
          if (shadowLogs !== null) window.location.reload();
        }
      }

      // 2. Detect unexpected deletions of security-critical keys
      if (lastStateRef.current.blacklist && !currentBlacklist) {
        const expiry = parseInt(lastStateRef.current.blacklist, 10);
        if (Date.now() < expiry) {
          logSecurityEvent('CRITICAL: Security State Tampering detected (Blacklist removed). Re-engaging and locking system.', 'CRITICAL');
          localStorage.setItem('sentinel_blacklist', lastStateRef.current.blacklist);
          window.location.reload();
        }
      }

      if (lastStateRef.current.lockdown && !currentLockdown) {
        const expiry = parseInt(lastStateRef.current.lockdown, 10);
        if (Date.now() < expiry) {
          logSecurityEvent('CRITICAL: Security State Tampering detected (Lockdown removed). Re-engaging.', 'CRITICAL');
          localStorage.setItem('sentinel_lockdown', lastStateRef.current.lockdown);
          window.location.reload();
        }
      }

      lastStateRef.current = { blacklist: currentBlacklist, lockdown: currentLockdown };
    };

    const interval = setInterval(performIntegrityPulse, 10000); // Pulse every 10s
    return () => clearInterval(interval);
  }, [generateIntegrityHash, logSecurityEvent]);

  const checkRateLimit = useCallback((key: string, limit: number, windowMs: number): boolean => {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storageKey = `sentinel_rl_${key}`;
    let data = { count: 0, startTime: now };

    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          data = { ...data, ...parsed };
        }
      }
    } catch {
      try { localStorage.removeItem(storageKey); } catch { /* ignore */ }
    }

    if (now - data.startTime > windowMs) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ count: 1, startTime: now }));
      } catch {
        logSecurityEvent('Rate Limit persistence failed: storage restricted', 'MEDIUM');
      }
      return true;
    }

    if (data.count < limit) {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ count: data.count + 1, startTime: data.startTime }));
      } catch {
        logSecurityEvent('Rate Limit persistence failed: storage restricted', 'MEDIUM');
      }
      return true;
    }

    logSecurityEvent(`Rate limit exceeded for action: ${key}`, 'MEDIUM');
    return false;
  }, [logSecurityEvent]);

  return {
    logSecurityEvent,
    sanitizeInput,
    validateInput,
    validateRequest,
    checkRateLimit,
    storeShadowLog,
    triggerHoneytoken,
    rotateDecoys,
    getDecoyConfig,
    triggerBlacklist,
    checkBlacklist
  };
};
