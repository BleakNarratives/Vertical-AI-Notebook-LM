'use client';

import React, { useCallback, useRef } from 'react';

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
      return sessionVal || localVal;
    }

    return localVal;
  }, [generateSignature, logSecurityEvent]);

  const secureRemove = useCallback((key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      logSecurityEvent(`Storage removal failure for key: ${key}`, 'MEDIUM');
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

  const recursiveDecode = useCallback((input: string): string => {
    const decode = (str: string, d: number): string => {
      if (d > 3) return str; // Prevent infinite recursion/DoS
      try {
        const decoded = decodeURIComponent(str);
        if (decoded === str) return decoded;
        return decode(decoded, d + 1);
      } catch {
        return str;
      }
    };
    return decode(input, 0);
  }, []);

  const storeShadowLog = useCallback((input: string) => {
    if (typeof window === 'undefined') return;
    const key = 'sentinel_shadow_logs';
    // Unicode-safe Base64 encoding to prevent crashes on non-ASCII/emoji inputs
    const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
    const stored = secureGet(key);
    let logs: string[] = [];
    try {
      if (stored) {
        logs = JSON.parse(stored);
        if (!Array.isArray(logs)) logs = [];
      }
    } catch { logs = []; }

    logs.push(encoded);
    if (logs.length > 20) logs.shift(); // Keep last 20

    secureStore(key, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: logs.length } }));
  }, [secureGet, secureStore]);

  const validateInput = useCallback((input: string): boolean => {
    // Input Normalization: Recursive decode to prevent multi-stage obfuscation
    const normalized = recursiveDecode(input);

    if (normalized !== input) {
      logSecurityEvent(`Input normalization detected bypass attempt`, 'MEDIUM');
    }

    // Basic allowlist check (using normalized input)
    const allowlist = /^[a-zA-Z0-9\s._\-!?()[\]*|\/><=:$]+$/;
    if (!allowlist.test(normalized)) {
      logSecurityEvent(`Input rejected: Invalid characters`, 'HIGH');
      storeShadowLog("INVALID_CHAR_REJECTION: " + (normalized.length > 15 ? normalized.substring(0, 15) + "..." : normalized));
      return false;
    }

    // Depth check: Block path traversal, LFI, XSS, and NoSQL injection
    const maliciousPatterns = [
      /\.\.\//,             // Path traversal
      /etc\/passwd/,        // LFI target
      /cmd\.exe/,           // RCE attempt
      /<script/i,           // XSS attempt
      /javascript:/i,       // Protocol injection
      /\bvbscript:/i,       // VBScript injection
      /onerror\s*=/i,       // XSS Event handler
      /onload\s*=/i,        // XSS Event handler
      /\beval\s*\(/i,       // Dangerous evaluation
      /\balert\s*\(/i,      // XSS proof-of-concept
      /\bexpression\s*\(/i, // IE legacy XSS
      /data:/i,             // Data URI scheme
      /union\s+select/i,    // SQL injection
      /\$(where|regex|ne)/i // NoSQL injection
    ];

    for (const pattern of maliciousPatterns) {
      if (pattern.test(normalized)) {
        logSecurityEvent(`CRITICAL: Malicious pattern detected: ${normalized.substring(0, 15)}...`, 'CRITICAL');
        storeShadowLog("MALICIOUS_PATTERN_REJECTION: " + (normalized.length > 15 ? normalized.substring(0, 15) + "..." : normalized));
        return false;
      }
    }

    return true;
  }, [logSecurityEvent, recursiveDecode, storeShadowLog]);

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

    // Secure randomness using window.crypto
    const buffer = new Uint32Array(2);
    window.crypto.getRandomValues(buffer);

    const config = {
      posIndex: positions[buffer[0] % positions.length],
      payload: payloads[buffer[1] % payloads.length],
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
      const stored = secureGet(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          data = { ...data, ...parsed };
        }
      }
    } catch {
      // ignore
    }

    if (now - data.startTime > windowMs) {
      secureStore(storageKey, JSON.stringify({ count: 1, startTime: now }));
      return true;
    }

    if (data.count < limit) {
      secureStore(storageKey, JSON.stringify({ count: data.count + 1, startTime: data.startTime }));
      return true;
    }

    logSecurityEvent(`Rate limit exceeded for action: ${key}`, 'MEDIUM');
    return false;
  }, [logSecurityEvent, secureGet, secureStore]);

  const monitorIntegrity = useCallback(() => {
    if (typeof window === 'undefined' || typeof MutationObserver === 'undefined') return () => {};

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.removedNodes.forEach((node) => {
            if (node instanceof HTMLElement && (node.hasAttribute('data-sentinel') || node.querySelector('[data-sentinel]'))) {
              if (!document.contains(node)) {
                logSecurityEvent(`CRITICAL: Protected UI element removed: ${node.getAttribute('data-sentinel') || 'composite'}`, 'CRITICAL');
                window.dispatchEvent(new CustomEvent('sentinel-integrity-violation', { detail: { type: 'removal', element: node.getAttribute('data-sentinel') } }));
              }
            }
          });
        } else if (mutation.type === 'attributes') {
          const target = mutation.target as HTMLElement;
          if (target.hasAttribute('data-sentinel')) {
            const style = window.getComputedStyle(target);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) < 0.1) {
              logSecurityEvent(`CRITICAL: Protected UI element hidden: ${target.getAttribute('data-sentinel')}`, 'CRITICAL');
              window.dispatchEvent(new CustomEvent('sentinel-integrity-violation', { detail: { type: 'visibility', element: target.getAttribute('data-sentinel') } }));
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden']
    });

    return () => observer.disconnect();
  }, [logSecurityEvent]);

  const lastInteractionRef = useRef<number>(0);

  const verifyInteraction = useCallback((e?: React.UIEvent | Event): boolean => {
    if (!e) return true;

    const nativeEvent = 'nativeEvent' in e ? e.nativeEvent : e;

    if (nativeEvent && nativeEvent.isTrusted === false) {
      logSecurityEvent(`Untrusted interaction detected from ${e.type} event`, 'HIGH');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('sentinel-untrusted-interaction', {
          detail: { type: e.type, timestamp: new Date().toISOString() }
        }));
      }
      return false;
    }

    // Behavioral Velocity Profiling: Detect sub-human automation speeds
    if (e.type === 'click' || e.type === 'mousedown') {
      const now = Date.now();
      const delta = now - lastInteractionRef.current;
      lastInteractionRef.current = now;

      if (delta < 50) { // 50ms threshold for sub-human velocity
        logSecurityEvent(`Velocity violation: ${delta}ms between interactions`, 'HIGH');
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('sentinel-velocity-alert', {
            detail: { delta, type: e.type, timestamp: new Date().toISOString() }
          }));
        }
        return false;
      }
    }

    return true;
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
    secureRemove,
    monitorIntegrity,
    verifyInteraction
  };
};
