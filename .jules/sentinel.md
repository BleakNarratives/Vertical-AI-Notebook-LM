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

## 2026-04-28 - [Persistent Lockdown Protocol & Input Depth Defense]
**Vulnerability:** System remained partially functional even after repeated high-severity security events, allowing for persistent attack attempts.
**Learning:** High-frequency malicious activity requires a full system cooldown to break attack momentum. By implementing a persistent "Lockdown" state linked to alert frequency, we can enforce a cooling-off period that survives page refreshes and disables all entry points.
**Prevention:** Implement a `localStorage`-backed lockdown mechanism that monitors high-severity alert history and disables interaction modules for a fixed duration (e.g., 5 minutes) upon reaching a threshold. Pair this with depth-based input validation checks for known attack patterns (Path Traversal, LFI, etc.).

## 2026-04-29 - [Storage Integrity & Defensive Interfaces]
**Vulnerability:** Direct un-signed storage access for security counters (rate limits, decoy breaches) allowing for client-side tampering.
**Learning:** Security-critical state must be protected by cryptographic signatures even on the client side. A "fail-secure" pattern for storage should return null or trigger an alert when divergence is detected, rather than falling back to un-signed values. Centralizing all storage interactions behind a signed interface (`secureGet`/`secureStore`) prevents logic fragmentation and reduces the attack surface.
**Prevention:** Always use a signed storage interface for security-critical counters. Implement a `secureRemove` utility to ensure clean state transitions across all storage layers (Local/Session).
