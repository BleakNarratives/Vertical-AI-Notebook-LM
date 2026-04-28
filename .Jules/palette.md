## 2025-05-15 - [Boardroom Accessibility & Theme]
**Learning:** Adding perspective and 3D transforms can enhance immersion but requires careful handling of pointer events and focus indicators. Converting small interactive decorative elements (like Easter eggs) to semantic buttons improves keyboard discoverability significantly.
**Action:** Always prefer `<button>` over `<div>` for interactive elements, even for "hidden" ones. Use `focus-visible` to ensure focus states are only shown to keyboard users while maintaining visual polish for mouse users.

## 2026-04-28 - [Accessible State Feedback]
**Learning:** For immersive environments like 'Code City', interactive elements must clearly communicate their state to both visual and screen reader users without breaking the aesthetic. Using Tailwind's `enabled:` modifier is a clean way to ensure hover/focus effects don't trigger on disabled elements.
**Action:** Always pair `isLoading` states with `aria-busy` and `disabled` attributes, and ensure status updates use `aria-live` regions.
