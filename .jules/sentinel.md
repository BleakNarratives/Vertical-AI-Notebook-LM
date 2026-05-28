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

## 2026-04-29 - [Signed Storage Integrity & Centralized State Cleanup]
**Vulnerability:** Security-critical state (rate limits, breach counters) was being accessed via direct `localStorage` calls, allowing for easy client-side tampering and signature bypass.
**Learning:** Even with a secure storage utility available, inconsistent usage across hooks creates weak points. Centralizing all security state management behind a cryptographically-signed interface (`secureGet`/`secureStore`) is required for true defense-in-depth. Dual-storage cleanup (`localStorage` and `sessionStorage`) must also be synchronized via a single utility to prevent stale data.
**Prevention:** Strictly enforce the use of `secureGet`, `secureStore`, and `secureRemove` for all `sentinel_*` keys. Audit call sites to ensure no direct `localStorage` access remains for security metadata.
