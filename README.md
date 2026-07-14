# Tropical Islands — 3D Water & Islands (Three.js + WebGPU)

Companion code for the **3D Water & Islands** course: building a stylized,
cartoonish tropical island scene with high-quality water in **Three.js**, rendered
on **WebGPU** with hand-written **WGSL** shaders.

Each episode of the course lives on its own branch, holding the project as it
stands at the **end** of that episode. Check out a branch, install, and run.

## This branch — `episode-7-ocean-waves`

**Episode 7 — The Ocean Surface.** Builds on Episode 6: the coloured island is now set
into a **sea**. `src/ocean.ts` builds a big water plane whose surface is animated by a
few gentle **sine waves written by hand in WGSL** (the first hand-written shader in the
course) — attached to the material's `positionNode` (which moves each vertex every
frame) and `normalNode` (found by finite differences, so the sun glints off the swells),
driven by a `time` uniform. The sea sits at the waterline so the island pokes through.
The water is still flat and opaque — colour, transparency, and refraction come next.

## Requirements

- **Node.js 18+**
- A browser with **WebGPU** enabled (recent Chrome, Edge, or Safari; recent Firefox
  needs it toggled on).

## Run it

```bash
npm install
npm run dev
```

Open the printed URL (usually `http://localhost:5173`) in a real browser — not an
editor's built-in preview pane, which often lacks WebGPU. You should see the coloured
atoll sitting in a gently rolling blue sea; **hold the right mouse button and use
W/A/S/D** to fly over it (Shift to go faster), with a `WebGPU · 60 fps`-style readout in
the top-left.

## Build

```bash
npm run build     # type-checks with tsc, then bundles with Vite
npm run preview   # serve the production build locally
```
