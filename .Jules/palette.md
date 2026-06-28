## 2026-06-10 - [Standardized Boardroom Focus Indicators]
**Learning:** Generic `group-*` utility classes in Tailwind v4 require the immediate interactive parent to have the standard `group` class. Named groups (e.g., `group/laptop`) block these generic selectors for their children. Additionally, absolute-positioned decorative elements like the `FocusIndicator` (`-inset-3`) will be clipped if the parent uses `overflow-hidden`.

**Action:** Ensure interactive components use both a named group for scoping hover/focus and a `relative` class for positioning. Avoid `overflow-hidden` on parent buttons if they utilize atmospheric indicators.
