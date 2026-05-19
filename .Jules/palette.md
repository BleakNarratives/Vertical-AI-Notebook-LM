## 2025-05-15 - [Boardroom Accessibility & Theme]
**Learning:** Adding perspective and 3D transforms can enhance immersion but requires careful handling of pointer events and focus indicators. Converting small interactive decorative elements (like Easter eggs) to semantic buttons improves keyboard discoverability significantly.
**Action:** Always prefer `<button>` over `<div>` for interactive elements, even for "hidden" ones. Use `focus-visible` to ensure focus states are only shown to keyboard users while maintaining visual polish for mouse users.

## 2026-04-28 - [Accessible State Feedback]
**Learning:** For immersive environments like 'Code City', interactive elements must clearly communicate their state to both visual and screen reader users without breaking the aesthetic. Using Tailwind's `enabled:` modifier is a clean way to ensure hover/focus effects don't trigger on disabled elements.
**Action:** Always pair `isLoading` states with `aria-busy` and `disabled` attributes, and ensure status updates use `aria-live` regions.

## 2025-05-16 - [Standing Perspective Pattern]
**Learning:** Applying a perspective transform (like `rotateX(20deg)`) to a container tilts all children. To make interactive props appear "upright" on a 3D surface without breaking Tailwind 4's independent transform utilities (like `hover:scale`), use the `style` attribute to apply a counter-rotation (e.g., `rotateX(-20deg)`).
**Action:** Use `style={{ transform: 'rotateX(-20deg)' }}` for perspective-countering transforms to avoid clobbering Tailwind's utility-based transforms.

## 2025-05-17 - [Immersive Grid & Accessibility]
**Learning:** Reinforcing 3D perspective with a digital grid requires a fade-out mask (`mask-image`) to prevent visual noise at the "horizon" and maintain focus on interactive elements. Additionally, immersive UI labels should not sacrifice legibility; `text-xs` (12px) should be the minimum target even for "atmospheric" text.
**Action:** Always apply linear-gradient masks to background grids and prefer `text-xs` over smaller custom sizes for accessibility.

## 2025-05-18 - [Unifying Immersive Interaction States]
**Learning:** In immersive 3D UIs, users expect consistent tactile feedback regardless of input method. Relying solely on `hover` for delightful animations (scaling, glitch effects, label visibility) excludes keyboard users and creates a disjointed experience. Unifying `hover` and `focus-visible` ensures the "magic" of the environment is accessible to everyone.
**Action:** Always pair `hover:` with `focus-visible:` for all delightful transitions, scaling, and state-revealing effects. Wrap ephemeral status messages in fixed-height containers to prevent layout shifts during interaction cycles.

## 2025-05-19 - [Focus-Driven 3D Depth & Smooth Reset]
**Learning:** Focus-driven 3D depth (e.g., a "Lean-In" effect via `translateZ`) significantly improves immersion for keyboard users, making the environment feel responsive to their attention. However, standard `focusout` resets can cause "flickering" when tabbing between siblings. Checking `e.relatedTarget` to see if focus remains within the 3D container ensures a smooth, persistent "active session" feel.
**Action:** Use `e.relatedTarget` and `container.contains()` in `focusout` handlers to verify focus has truly exited the 3D context before resetting perspective variables.
