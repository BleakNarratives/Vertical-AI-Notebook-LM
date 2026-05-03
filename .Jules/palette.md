## 2025-05-15 - [Boardroom 3D Perspective & Standing Personas]
**Learning:** To create an immersive "boardroom" feel on a 3D tilted table, applying a counter-rotation (e.g., `rotateX(-20deg)`) to child elements makes them appear to "stand" upright on the surface. Additionally, for these elements to remain interactive within a `pointer-events-none` 3D container, they must explicitly set `pointer-events-auto`.
**Action:** Use `[transform:rotateX(-Ndeg)]` on child components to stand them up on a `rotateX(Ndeg)` parent, and ensure `pointer-events-auto` is set for all interactive boardroom props.
