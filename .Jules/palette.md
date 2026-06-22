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

## 2025-05-18 - [Standardizing Interactive Boundary Space]
**Learning:** Interactive boardroom components must not use `overflow-hidden` on their root elements if they utilize absolute-positioned focus indicators (like corner brackets at `-inset-3`) or atmospheric labels. These elements require the "bleeding" space outside the component's strict bounding box to remain visible.
**Action:** Remove `overflow-hidden` from interactive prop containers and instead apply it to internal content wrappers to preserve atmospheric UI elements.

## 2025-05-19 - [Vertical Spacing for Atmospheric Labels]
**Learning:** Introducing persistent absolute-positioned labels (e.g., at `-top-8` or `-bottom-8`) significantly increases the effective height of components. Standard layout gaps (like `gap-8`) are insufficient and lead to label collisions. Standardizing on `gap-16` and `mb-20` provides the necessary clearance for these immersive identifiers.
**Action:** Use `gap-16` or higher for stacks containing absolute atmospheric labels to prevent vertical overlap and maintain legibility.

## 2025-05-20 - [Unifying Immersive Interaction States]
**Learning:** In immersive 3D UIs, users expect consistent tactile feedback regardless of input method. Relying solely on `hover` for delightful animations (scaling, glitch effects, label visibility) excludes keyboard users and creates a disjointed experience. Unifying `hover` and `focus-visible` ensures the "magic" of the environment is accessible to everyone.
**Action:** Always pair `hover:` with `focus-visible:` for all delightful transitions, scaling, and state-revealing effects. Wrap ephemeral status messages in fixed-height containers to prevent layout shifts during interaction cycles.

## 2025-05-19 - [Standardizing 3D Utility Transforms]
**Learning:** In Tailwind 4, using inline `style={{ transform: '...' }}` for 3D counter-rotations clobbers the `transform` property, which can prevent utility classes like `active:translate-y-1` or `hover:scale-110` from functioning if they rely on the `transform` property or if the inline style doesn't account for Tailwind's transform variables. Explicitly including `translateY(var(--tw-translate-y, 0))` and `scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' in the inline style preserves the "tactile" feel of Tailwind utilities.
**Action:** When using inline transforms for 3D perspective, always include Tailwind's transform variables: `style={{ transform: 'rotateX(-20deg) translateY(var(--tw-translate-y, 0)) scale(var(--tw-scale-x, 1), var(--tw-scale-y, 1))' }}`.

## 2025-05-20 - [Tactile Fanning Stacks]
**Learning:** In a 3D boardroom UI, "stacked" items can feel static and flat. Implementing a "fan-out" interaction using `group-hover` and `group-focus-within` on a container allows overlapping elements to reveal themselves dynamically. This provides a satisfying tactile response that mimics physical interaction with a pile of papers.
**Action:** Use container-level `group` states with relative/absolute positioning and negative margins to create "exploding" or "fanning" layouts for overlapping 3D props.
