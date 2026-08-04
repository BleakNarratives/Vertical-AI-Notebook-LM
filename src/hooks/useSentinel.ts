'use client';

import React, { useCallback, useRef } from 'react';

// Module-level redundancy to detect storage tampering (Quantum Integrity Pin)
let memoryBlacklist: number | null = null;

/**
 * useSentinel - Security-focused hook for Code City.
 * Provides defensive utilities and security event logging.
 */
export const useSentinel = () => {
  const lastInteractionRef = useRef<Record<string, number>>({});
  const lastDeltaRef = useRef<Record<string, number>>({});
  const jitterViolationsRef = useRef<Record<string, number>>({});
  const velocityViolationsRef = useRef<Record<string, number>>({});
  const lastCoordinatesRef = useRef<{ x: number; y: number }[]>([]);

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
      // Voodoo rotation: circular shift for increased dispersion
      hash = (hash << 13) | (hash >>> 19);
      hash |= 0;
    }
    return Math.abs(hash ^ seed).toString(16);
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const secureJsonParse = useCallback((str: string): any => {
    try {
      return JSON.parse(str, (key, value) => {
        if (key === '__proto__' || key === 'constructor' || key === 'prototype') {
          logSecurityEvent(`Prototype pollution attempt detected and blocked: ${key}`, 'HIGH');
          return undefined; // Filter out prototype-polluting keys
        }
        return value;
      });
    } catch {
      return null;
    }
  }, [logSecurityEvent]);

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
        const parsed = secureJsonParse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed) || typeof parsed.v !== 'string' || typeof parsed.s !== 'string') {
          logSecurityEvent(`Storage structure tampered or corrupted for key: ${key}`, 'HIGH');
          try {
            storage.removeItem(key);
          } catch {}
          return null;
        }
        const { v, s } = parsed;
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
  }, [generateSignature, logSecurityEvent, secureJsonParse]);

  const secureRemove = useCallback((key: string) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    } catch {
      logSecurityEvent(`Storage removal failure for key: ${key}`, 'MEDIUM');
    }
  }, [logSecurityEvent]);

  const secureRemove = useCallback((key: string) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
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
      .replace(/\\/g, '&#92;')
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
        logs = secureJsonParse(stored);
        if (!Array.isArray(logs)) logs = [];
      }
    } catch { logs = []; }

    logs.push(encoded);
    if (logs.length > 20) logs.shift(); // Keep last 20

    secureStore(key, JSON.stringify(logs));
    window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: logs.length } }));
  }, [secureGet, secureStore, secureJsonParse]);

  const validateInput = useCallback((input: string): boolean => {
    // Ensure input is a valid string type to prevent runtime type exceptions
    if (typeof input !== 'string') {
      logSecurityEvent(`Input rejected: Expected string, received ${typeof input}`, 'HIGH');
      return false;
    }
    // DoS Mitigation: Enforce strict length limits
    if (input.length > 500) {
      logSecurityEvent(`Input length limit exceeded: ${input.length} chars`, 'MEDIUM');
      storeShadowLog("DOS_LENGTH_REJECTION: " + input.substring(0, 50) + "...");
      return false;
    }

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
      /\b__proto__\b/,      // Prototype pollution
      /\bconstructor\b/,    // Prototype pollution
      /\{\{[\s\S]*?\}\}/,         // Template injection
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
      /\bString\.fromCharCode\b/i, // Obfuscated XSS
      /\batob\s*\(/i,       // Base64 decoding (obfuscation)
      /\bbtoa\s*\(/i,       // Base64 encoding (exfiltration)
      /union\s+select/i,    // SQL injection
      /\$(where|regex|ne|gt|lt|in)/i, // NoSQL injection
      /__proto__/i,        // Prototype pollution
      /constructor\.prototype/i // Prototype pollution
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

    const getRandomIndex = (max: number) => {
      const array = new Uint32Array(1);
      window.crypto.getRandomValues(array);
      return array[0] % max;
    };

    const config = {
      posIndex: positions[getRandomIndex(positions.length)],
      payload: payloads[getRandomIndex(payloads.length)],
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
      return secureJsonParse(stored);
    } catch {
      return null;
    }
  }, [secureGet, secureJsonParse]);

  const triggerBlacklist = useCallback(() => {
    if (typeof window === 'undefined') return;
    const expiry = Date.now() + 86400000; // 24 hours
    memoryBlacklist = expiry;
    secureStore('sentinel_blacklist', expiry.toString());
    logSecurityEvent('SESSION BLACKLISTED: Repeated security breaches detected. Access revoked for 24h.', 'CRITICAL');
    window.dispatchEvent(new CustomEvent('sentinel-blacklist', { detail: { expiry } }));
  }, [logSecurityEvent, secureStore]);

  const checkBlacklist = useCallback((): boolean => {
    let stored = secureGet('sentinel_blacklist');
    if (memoryBlacklist && Date.now() < memoryBlacklist) {
      if (!stored) {
        logSecurityEvent('Storage tampering detected: Blacklist was removed. Restoring from Memory Pin.', 'CRITICAL');
        secureStore('sentinel_blacklist', memoryBlacklist.toString());
        stored = memoryBlacklist.toString();
      }
    }

    if (stored) {
      expiry = parseInt(stored, 10);
    } else if (memoryBlacklist) {
      // Memory Pinning: Recover the blacklist expiry if localStorage was cleared/tampered
      expiry = memoryBlacklist;
      logSecurityEvent('Memory Pinning: Restoring tampered/cleared blacklist from in-memory signature.', 'HIGH');
      secureStore('sentinel_blacklist', memoryBlacklist.toString());
    }

    if (expiry) {
      if (Date.now() < expiry) {
        if (!memoryBlacklist) memoryBlacklist = expiry;
        return true;
      } else {
        memoryBlacklist = null;
        secureRemove('sentinel_blacklist');
      }
    }
    return false;
  }, [secureGet, secureStore, secureRemove, logSecurityEvent]);

  const verifyStorageIntegrity = useCallback(() => {
    if (typeof window === 'undefined') return true;
    const criticalKeys = ['sentinel_blacklist', 'sentinel_lockdown', 'sentinel_alert_history'];
    let isIntegral = true;

    // Verify storage blacklist against memory blacklist pinning
    const storedBlacklist = secureGet('sentinel_blacklist');
    if (memoryBlacklist && !storedBlacklist) {
      logSecurityEvent('Storage tampering detected: Blacklist removed from storage.', 'CRITICAL');
      secureStore('sentinel_blacklist', memoryBlacklist.toString());
      isIntegral = false;
    } else if (storedBlacklist && memoryBlacklist && parseInt(storedBlacklist, 10) !== memoryBlacklist) {
      logSecurityEvent('Storage tampering detected: Blacklist value tampered.', 'CRITICAL');
      secureStore('sentinel_blacklist', memoryBlacklist.toString());
      isIntegral = false;
    } else if (storedBlacklist && !memoryBlacklist) {
      memoryBlacklist = parseInt(storedBlacklist, 10);
    }

    for (const key of criticalKeys) {
      const local = localStorage.getItem(key);
      const session = sessionStorage.getItem(key);
      if (local && session && local !== session) {
        logSecurityEvent(`Storage divergence detected for critical key: ${key}`, 'CRITICAL');
        isIntegral = false;
      }
    }
    return isIntegral;
  }, [logSecurityEvent, secureGet, secureStore]);

  const checkRateLimit = useCallback((key: string, limit: number, windowMs: number): boolean => {
    if (typeof window === 'undefined') return true;

    const now = Date.now();
    const storageKey = `sentinel_rl_${key}`;
    let data = { count: 0, startTime: now };

    try {
      const stored = secureGet(storageKey);
      if (stored) {
        const parsed = secureJsonParse(stored);
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
  }, [logSecurityEvent, secureGet, secureStore, secureJsonParse]);

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

  const verifyInteraction = useCallback((e?: React.UIEvent | Event): boolean => {
    if (typeof window === 'undefined' || !e) return true;

    const now = Date.now();
    if (typeof window !== 'undefined') {
      const lastInteraction = (window as unknown as { _sentinel_last_interaction: number })._sentinel_last_interaction || 0;
      const velocity = now - lastInteraction;
      (window as unknown as { _sentinel_last_interaction: number })._sentinel_last_interaction = now;

      if (lastInteraction !== 0 && velocity < 50) {
        logSecurityEvent('Sub-human interaction velocity detected: ' + velocity + 'ms', 'HIGH');
        window.dispatchEvent(new CustomEvent('sentinel-velocity-alert', {
          detail: { velocity, type: e.type, timestamp: new Date().toISOString() }
        }));
        return false;
      }
    }

    const nativeEvent = 'nativeEvent' in e ? e.nativeEvent : e;

    // 1. Trust Verification
    if (nativeEvent && nativeEvent.isTrusted === false) {
      logSecurityEvent(`Untrusted interaction detected from ${e.type} event`, 'HIGH');
      window.dispatchEvent(new CustomEvent('sentinel-untrusted-interaction', {
        detail: { type: e.type, timestamp: new Date().toISOString() }
      }));
      return false;
    }

    // 2. Temporal Analysis (Velocity & Jitter)
    if (e.type === 'click' || e.type === 'mousedown') {
      const lastTime = lastInteractionRef.current[e.type] || 0;
      lastInteractionRef.current[e.type] = now;

      if (lastTime !== 0) {
        const delta = now - lastTime;

        // Reset consecutive violations if there's a human-like pause (> 500ms)
        if (delta > 500) {
          velocityViolationsRef.current[e.type] = 0;
        }
        // Jitter Detection: Perfect temporal consistency is highly suspicious
        const lastDelta = lastDeltaRef.current[e.type] || 0;
        const jitter = Math.abs(delta - lastDelta);

        if (jitter === 0) {
          jitterViolationsRef.current[e.type] = (jitterViolationsRef.current[e.type] || 0) + 1;
          if (jitterViolationsRef.current[e.type] >= 3) {
            logSecurityEvent(`Sub-human temporal precision detected: Zero jitter in ${e.type} sequence`, 'HIGH');
            window.dispatchEvent(new CustomEvent('sentinel-jitter-alert', {
              detail: { delta, type: e.type, timestamp: now }
            }));
          }
        } else {
          jitterViolationsRef.current[e.type] = 0;
        }
        lastDeltaRef.current[e.type] = delta;

        // Velocity Profiling: Detection of sub-human interaction speeds (default < 50ms)
        // Adaptive threshold read from secureStore
        const thresholdStored = secureGet('sentinel_velocity_threshold');
        const threshold = parseInt(thresholdStored || '50', 10) || 50;

        if (delta >= 0 && delta < threshold) {
          velocityViolationsRef.current[e.type] = (velocityViolationsRef.current[e.type] || 0) + 1;
          logSecurityEvent(`Sub-human interaction velocity detected: ${delta}ms (threshold: ${threshold}ms)`, 'HIGH');
          window.dispatchEvent(new CustomEvent('sentinel-velocity-alert', {
            detail: { delta, type: e.type, timestamp: now, violations: velocityViolationsRef.current[e.type] }
          }));
        } else if (delta > 500) {
          velocityViolationsRef.current[e.type] = 0;
        }
      } else {
        // Human-like pause resets the violation counter
        velocityViolationsRef.current[e.type] = 0;
      }
    }

    // 3. Entropy Analysis (Spatial Variance)
    if (e.type === 'click' && nativeEvent instanceof MouseEvent) {
      const { clientX: x, clientY: y } = nativeEvent;
      const coords = lastCoordinatesRef.current;

      // Exact spatial repetition in sequence (3x) is a high-confidence bot signal
      coords.push({ x, y });
      if (coords.length > 5) coords.shift();

      const isRobotic = coords.length >= 3 && coords.slice(-3).every(c => c.x === x && c.y === y);

      if (isRobotic) {
        logSecurityEvent(`Low behavioral entropy detected: Spatial precision anomaly`, 'HIGH');
        window.dispatchEvent(new CustomEvent('sentinel-entropy-alert', {
          detail: { x, y, timestamp: Date.now() }
        }));
        return false;
      }
    }

    return true;
  }, [logSecurityEvent, secureGet]);

  return {
    logSecurityEvent,
    sanitizeInput,
    validateInput,
    validateRequest,
    secureJsonParse,
    checkRateLimit,
    storeShadowLog,
    triggerHoneytoken,
    rotateDecoys,
    getDecoyConfig,
    triggerBlacklist,
    checkBlacklist,
    verifyStorageIntegrity,
    secureStore,
    secureGet,
    secureRemove,
    monitorIntegrity,
    verifyInteraction
  };
};
