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

## 2025-05-19 - [Preserving Utility Transforms in Inline Styles]
**Learning:** Applying fixed 3D rotations via the `style` attribute (required for counter-rotation in perspective layouts) clobbers Tailwind's utility-based transforms (like `hover:scale` or `active:translate-y`). This breaks tactile feedback. Manually integrating Tailwind's transform variables into the inline `style` string restores the expected behavior.
**Action:** Use `style={{ transform: 'rotateX(-20deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1))' }}` to ensure utility-driven animations remain functional alongside fixed rotations.

## 2025-05-20 - [Efficient Atmospheric Feedback]
**Learning:** Driving large-scale visual effects (like a radial "Atmospheric Glow") via React state on every mouse move causes significant performance overhead. Offloading coordinate tracking to CSS variables via direct DOM manipulation in a `mousemove` listener allows the GPU to handle the rendering smoothly without triggering expensive component re-renders.
**Action:** Use `ref.current.style.setProperty('--mx', '${e.clientX}px')` to drive atmospheric shaders/gradients for a fluid, high-performance immersive feel.
