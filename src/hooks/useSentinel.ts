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
    try {
      const encoded = btoa(input);
      const logs = JSON.parse(localStorage.getItem('sentinel_shadow_logs') || '[]');
      const newLogs = [...logs, { t: Date.now(), d: encoded }].slice(-20); // Keep last 20
      localStorage.setItem('sentinel_shadow_logs', JSON.stringify(newLogs));

      // Dispatch event for forensic tracking
      window.dispatchEvent(new CustomEvent('sentinel-shadow-recorded', { detail: { count: newLogs.length } }));
    } catch (e) {
      console.error('[🛡️ SENTINEL] Shadow Log failure:', e);
    }
  }, []);

  const validateInput = useCallback((input: string): boolean => {
    if (!input || input.length > 500) {
      logSecurityEvent('Input rejected: invalid length or empty', 'MEDIUM');
      return false;
    }

    // Block path traversal and LFI patterns
    const maliciousPatterns = [/\.\.\//, /\.\.\\/, /\.\.%2f/i, /%2e%2e%2f/i, /\/etc\//, /\/proc\//];
    if (maliciousPatterns.some(pattern => pattern.test(input))) {
      storeShadowLog(input);
      logSecurityEvent(`LFI/Path Traversal attempt blocked: ${input.substring(0, 20)}`, 'CRITICAL');
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
    const stored = localStorage.getItem(storageKey);
    let data = { count: 0, startTime: now };

    try {
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && typeof parsed === 'object') {
          data = { ...data, ...parsed };
        }
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    if (now - data.startTime > windowMs) {
      localStorage.setItem(storageKey, JSON.stringify({ count: 1, startTime: now }));
      return true;
    }

    if (data.count < limit) {
      localStorage.setItem(storageKey, JSON.stringify({ count: data.count + 1, startTime: data.startTime }));
      return true;
    }

    logSecurityEvent(`Rate limit exceeded for action: ${key}`, 'MEDIUM');
    return false;
  }, [logSecurityEvent]);

  return { logSecurityEvent, sanitizeInput, validateInput, validateRequest, checkRateLimit, storeShadowLog };
};
