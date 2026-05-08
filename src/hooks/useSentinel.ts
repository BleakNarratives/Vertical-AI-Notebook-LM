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
    try {
      // Unicode-safe Base64 encoding
      const encoded = btoa(encodeURIComponent(input).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      ));
      const stored = localStorage.getItem(key);
      let logs: string[] = [];
      try {
        if (stored) logs = JSON.parse(stored);
      } catch { logs = []; }

      logs.push(encoded);
      if (logs.length > 20) logs.shift(); // Keep last 20

      localStorage.setItem(key, JSON.stringify(logs));
      window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: logs.length } }));
    } catch (err) {
      logSecurityEvent(`Storage/Encoding failure in Shadow Log: ${err}`, 'MEDIUM');
    }
  }, [logSecurityEvent]);

  const validateInput = useCallback((input: string): boolean => {
    if (!input || input.length > 500) {
      logSecurityEvent('Input rejected: invalid length or empty', 'MEDIUM');
      return false;
    }

    // Block path traversal and LFI patterns
    const maliciousPatterns = [/\.\.\//, /\.\.\\/, /\.\.%2f/i, /%2e%2e%2f/i, /\/etc\//, /\/proc\//];
    if (maliciousPatterns.some(pattern => pattern.test(input))) {
      logSecurityEvent(`LFI/Path Traversal attempt blocked: ${input.substring(0, 20)}`, 'CRITICAL');
      storeShadowLog(input);
      return false;
    }

    // Regex-based allowlist for common terminal commands in this app's context
    // Allowing basic alphanum, spaces, and terminal operators: . _ - ! ? ( ) [ ] * | / > <
    const allowlist = /^[a-zA-Z0-9\s._\-!?()\[\]*|\/><]+$/;
    if (!allowlist.test(input)) {
      logSecurityEvent(`Potentially malicious input pattern: ${input.substring(0, 10)}...`, 'HIGH');
      return false;
    }
    return true;
  }, [logSecurityEvent, storeShadowLog]);

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
        logSecurityEvent('Rate Limit persistence failed: storage restricted', 'HIGH');
      }
      return true;
    }

    logSecurityEvent(`Rate limit exceeded for action: ${key}`, 'MEDIUM');
    return false;
  }, [logSecurityEvent]);

  return { logSecurityEvent, sanitizeInput, validateInput, validateRequest, checkRateLimit, storeShadowLog };
};
