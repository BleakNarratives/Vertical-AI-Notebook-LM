'use client';

import { useCallback } from 'react';

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

  const generateSignature = useCallback((key: string, value: string): string => {
    const seed = 0x53454E54;
    let hash = seed;
    const combined = `${key}:${value}`;
    for (let i = 0; i < combined.length; i++) {
      hash = ((hash << 5) - hash) + combined.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash ^ seed).toString(16);
  }, []);

  const secureStore = useCallback((key: string, value: string) => {
    if (typeof window === 'undefined') return;
    const signature = generateSignature(key, value);
    const payload = JSON.stringify({ v: value, s: signature });
    try {
      localStorage.setItem(key, payload);
      sessionStorage.setItem(key, payload);
    } catch {
      logSecurityEvent(`Storage failure for key: ${key}`, 'MEDIUM');
    }
  }, [generateSignature, logSecurityEvent]);

  const secureGet = useCallback((key: string): string | null => {
    if (typeof window === 'undefined') return null;

    const getAndVerify = (storage: Storage): string | null => {
      const raw = storage.getItem(key);
      if (!raw) return null;
      try {
        const { v, s } = JSON.parse(raw);
        if (generateSignature(key, v) === s) return v;
        logSecurityEvent(`Storage signature mismatch for key: ${key}`, 'CRITICAL');
        return null;
      } catch {
        return null;
      }
    };

    const localVal = getAndVerify(localStorage);
    const sessionVal = getAndVerify(sessionStorage);

    if (localVal && !sessionVal) {
      // Sync to session storage if local is present but session is not (e.g. new tab)
      const signature = generateSignature(key, localVal);
      const payload = JSON.stringify({ v: localVal, s: signature });
      sessionStorage.setItem(key, payload);
      return localVal;
    }

    if (localVal !== sessionVal) {
      logSecurityEvent(`Storage divergence detected for key: ${key}`, 'CRITICAL');
      return null; // Fail secure on divergence
    }

    return localVal;
  }, [generateSignature, logSecurityEvent]);

  const secureRemove = useCallback((key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      logSecurityEvent(`Storage removal failed for key: ${key}`, 'MEDIUM');
    }
  }, [logSecurityEvent]);

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

  const storeShadowLog = useCallback((input: string) => {
    if (typeof window === 'undefined') return;
    const key = 'sentinel_shadow_logs';
    // Unicode-safe Base64 encoding to prevent crashes on non-ASCII/emoji inputs
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

    localStorage.setItem(key, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: logs.length } }));
  }, []);

  const validateInput = useCallback((input: string): boolean => {
    // Length limit check (DoS prevention)
    if (!input) return false;
    if (input.length > 512) {
      logSecurityEvent(`Input rejected: Length exceeds 512 characters`, 'HIGH');
      return false;
    }

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

    secureStore('sentinel_decoy_config', JSON.stringify(config));
    window.dispatchEvent(new CustomEvent('sentinel-decoys-rotated', { detail: config }));
    return config;
  }, [secureStore]);

  const getDecoyConfig = useCallback(() => {
    const stored = secureGet('sentinel_decoy_config');
    if (!stored) return null;
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }, [secureGet]);

  const triggerBlacklist = useCallback(() => {
    if (typeof window === 'undefined') return;
    const expiry = Date.now() + 86400000; // 24 hours
    secureStore('sentinel_blacklist', expiry.toString());
    logSecurityEvent('SESSION BLACKLISTED: Repeated security breaches detected. Access revoked for 24h.', 'CRITICAL');
    window.dispatchEvent(new CustomEvent('sentinel-blacklist', { detail: { expiry } }));
  }, [logSecurityEvent, secureStore]);

  const checkBlacklist = useCallback((): boolean => {
    const stored = secureGet('sentinel_blacklist');
    if (stored) {
      const expiry = parseInt(stored, 10);
      if (Date.now() < expiry) {
        return true;
      } else {
        secureRemove('sentinel_blacklist');
      }
    }
    return false;
  }, [secureGet, secureRemove]);

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
    checkBlacklist,
    secureStore,
    secureGet,
    secureRemove
  };
};
