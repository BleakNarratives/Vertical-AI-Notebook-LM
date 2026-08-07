## 2026-08-01 - [Modal Focus Capture and Restoration]
**Learning:** Immersive overlay portals must manage keyboard focus meticulously to maintain clear accessibility bounds. Shifting focus to the primary interactive close trigger upon mounting ensures users are instantly oriented within the newly rendered modal, while restoring focus to the prior element on unmount preserves seamless keyboard navigation flow.
**Action:** When rendering modal portals, use refs to capture `document.activeElement` on mount, programmatically focus the primary modal control, and restore the captured active element's focus on unmount.

## 2026-07-31 - [Keyboard Shortcut Modifier Key Safety]
**Learning:** Adding global keyboard shortcuts (`C`, `L`, `W`, `V`) directly to window event listeners must not intercept or prevent standard browser or operating system actions (like Copy/Paste, Close Tab, or Focusing search bar). Checking for `event.ctrlKey || event.metaKey || event.altKey || event.shiftKey` is essential to prevent hijacking.
**Action:** Always verify modifier key states before executing and preventing defaults on global keystroke shortcuts.

## 2026-08-01 - [Keyboard Shortcut HUD for Discoverability]
**Learning:** In a highly stylized, immersive 3D-perspective environment, hidden keyboard shortcuts (such as `C`, `L`, `W`, `V`) are easily forgotten. A toggleable HUD (using `K` or a footer toggle) that overlays animated floating keycaps directly on the 3D-rotated props provides immediate discoverability without permanently cluttering the aesthetic.
**Action:** Provide a toggleable visual keyboard-shortcut overlay (HUD) for any complex or immersive interfaces that rely on custom keyboard hotkeys.

## 2026-06-11 - [Internal Vertical Spacing for Atmospheric UI]
**Learning:** In the 'Obelisk-Center' boardroom, interactive props often utilize absolute-positioned labels at `-top-8` or `-bottom-8`. Standardizing the internal container gap to `gap-16` ensures these labels have clear architectural "breathing room" and do not collide with dynamic status text or focus indicators.
**Action:** Use `gap-16` as the default vertical spacing for boardroom components that feature +/- 8 unit absolute labels.

## 2026-06-10 - [Standardized Boardroom Focus Indicators]
**Learning:** Generic `group-*` utility classes in Tailwind v4 require the immediate interactive parent to have the standard `group` class. Named groups (e.g., `group/laptop`) block these generic selectors for their children. Additionally, absolute-positioned decorative elements like the `FocusIndicator` (`-inset-3`) will be clipped if the parent uses `overflow-hidden`.

## 2026-04-28 - [Accessible State Feedback]
**Learning:** For immersive environments like 'Code City', interactive elements must clearly communicate their state to both visual and screen reader users without breaking the aesthetic. Using Tailwind's `enabled:` modifier is a clean way to ensure hover/focus effects don't trigger on disabled elements.
**Action:** Always pair `isLoading` states with `aria-busy` and `disabled` attributes, and ensure status updates use `aria-live` regions.

## 2025-05-16 - [Standing Perspective Pattern]
**Learning:** Applying a perspective transform (like `rotateX(20deg)`) to a container tilts all children. To make interactive props appear "upright" on a 3D surface without breaking Tailwind 4's independent transform utilities (like `hover:scale`), use the `style` attribute to apply a counter-rotation (e.g., `rotateX(-20deg)`).
**Action:** Use `style={{ transform: 'rotateX(-20deg)' }}` for perspective-countering transforms to avoid clobbering Tailwind's utility-based transforms.

## 2025-05-22 - [Unified Focus Feedback]
**Learning:** In a complex 3D boardroom environment, disparate focus styles create visual clutter and confuse keyboard users. A unified `FocusIndicator` using corner brackets (targeting `-inset-3`) provides a consistent "high-tech" feel while avoiding clipping issues when parent containers are properly configured (removing `overflow-hidden` where absolute labels/indicators are used).
**Action:** Use the `FocusIndicator` component for all interactive boardroom props and ensure parent buttons do not use `overflow-hidden`.

## 2025-05-17 - [Immersive Grid & Accessibility]
**Learning:** Reinforcing 3D perspective with a digital grid requires a fade-out mask (`mask-image`) to prevent visual noise at the "horizon" and maintain focus on interactive elements. Additionally, immersive UI labels should not sacrifice legibility; `text-xs` (12px) should be the minimum target even for "atmospheric" text.
**Action:** Always apply linear-gradient masks to background grids and prefer `text-xs` over smaller custom sizes for accessibility.

## 2025-05-18 - [Standardizing Interactive Boundary Space]
**Learning:** Interactive boardroom components must not use `overflow-hidden` on their root elements if they utilize absolute-positioned focus indicators (like corner brackets at `-inset-3`) or atmospheric labels. These elements require the "bleeding" space outside the component's strict bounding box to remain visible.
**Action:** Remove `overflow-hidden` from interactive prop containers and instead apply it to internal content wrappers to preserve atmospheric UI elements.

## 2025-05-19 - [Vertical Spacing for Atmospheric Labels]
**Learning:** Introducing persistent absolute-positioned labels (e.g., at `-top-8` or `-bottom-8`) significantly increases the effective height of components. Standard layout gaps (like `gap-8`) are insufficient and lead to label collisions. Standardizing on `gap-16` and `mb-20` provides the necessary clearance for some immersive identifiers.
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

## 2025-05-21 - [Unified Focus Mechanics for 3D Props]
**Learning:** In complex 3D boardroom layouts where interactive props (like Paper stacks) have multiple sub-elements or absolute labels, using `group-focus-visible` can cause visual flickering or state loss if focus moves between internal parts. `group-focus-within` provides a more stable experience, ensuring focus indicators and labels remain active during nested interactions.
**Action:** Use `group-focus-within` for visual indicators on complex multi-element props to ensure stability during deep navigation.

## 2025-05-22 - [Synchronized Environmental Feedback]
**Learning:** In an immersive UI with multiple disconnected interactive props, users can lose the sense of "system connectivity." Bridging these elements with a central feedback hub (like the Laptop terminal) using custom events provides a powerful micro-UX win that reinforces the narrative without complex state management.
**Action:** Use a "Central Hub" pattern for environmental feedback; dispatch timestamped events from peripheral props to update a global log or terminal for a cohesive "connected" feel.

## 2025-05-14 - [Immersive Document Portals]
**Learning:** In layouts utilizing heavy 3D CSS transforms (e.g., `perspective`, `rotateX`), standard relative-positioned overlays are often clipped or distorted by the parent's stacking context and perspective depth.
**Action:** Use React Portals (`createPortal`) to render atmospheric overlays (modals, previews) to the document body, bypassing the 3D transform constraints while maintaining the immersive aesthetic.

## 2026-08-02 - [Lazy State Initialization for Storage-dependent State]
**Learning:** Initializing React state directly with storage values (such as `localStorage` reads) within a `useEffect` can cause a synchronous `setState` warning/error from modern strict linters (`react-hooks/set-state-in-effect`) and trigger cascading double-renders.
**Action:** Use lazy state initialization (`useState(() => window.localStorage.getItem('key'))`) to fetch storage values synchronously on client mount without invoking an extra state update side-effect.
