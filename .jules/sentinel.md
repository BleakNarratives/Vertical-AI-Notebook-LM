## 2026-04-25 - [Security Header Implementation & Sentinel Guard]
**Vulnerability:** Lack of defense-in-depth headers and unvalidated agent interaction triggers.
**Learning:** In an immersive environment like 'Code City', client-side triggers and recursive loops (Molt) can be exploited if not monitored. Next.js defaults lack aggressive security headers (CSP, etc.) which are critical for terminal-like UIs that might render dynamic content.
**Prevention:** Always implement robust security headers in `next.config.ts` and provide a dedicated security hook (`useSentinel`) to log and monitor application events.

## 2026-04-26 - [Persistent Rate Limiting & Autonomous Security Logic]
**Vulnerability:** Unrestricted client-side agent triggers allowing for potential DoS-like behavior or infinite recursive loops.
**Learning:** Purely in-memory rate limiting resets on refresh, which is insufficient for persistent agents. Using `localStorage` provides cross-session protection but requires strict error handling for JSON parsing to avoid crashing the security layer.
**Prevention:** Implement persistent rate limiting with `localStorage` and ensure the security layer can recover from corrupted storage data. Tie security events to autonomous system responses (like Molt) with a strict execution cap.

## 2026-04-27 - [Shadow Triggers & Behavioral Security Detection]
**Vulnerability:** Inconsistent rate limiting across agents and lack of automated response to "protocol siege" (spamming).
**Learning:** Pure rate limiting blocks actions but doesn't necessarily alert the system to intentional abuse. By implementing "Shadow Triggers"—local counters that track attempts *during* rate-limited states—we can distinguish between accidental spam and a "protocol siege".
**Prevention:** Always implement rate limiting on entry-point agents (like Higgins). Use behavioral counters to elevate alerts from MEDIUM (Rate Limit) to CRITICAL (Shadow Sequence) to autonomously trigger system hardening (Molt).
