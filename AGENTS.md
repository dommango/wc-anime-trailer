# wc-anime-trailer — Agent Guide

30-second anime-style FIFA World Cup Final trailer, rendered to a real MP4 via
Remotion. Design spec: `docs/superpowers/specs/2026-07-18-wc-anime-trailer-design.md`.

## Stack

Remotion 4 · React 18 · TypeScript strict · Vitest. No UI framework, no state
management — every component is frame-driven off `useCurrentFrame()`.

## Commands

- `npm run studio` — `remotion studio` (live preview, entry `src/index.ts`)
- `npm run score` — synthesize `public/score.wav` from `src/audio/gen-score.ts`
- `npm run render` — `remotion render Trailer out/trailer.mp4`
- `npm test` — vitest

## Hard rules

- Composition is fixed at **1920×1080, 30fps, 900 frames (30.0s)** —
  `src/lib/timing.ts` (`FPS`, `DURATION_FRAMES`, `SCENES`). Every scene
  hardcodes `viewBox="0 0 1920 1080"`; resizing the composition means editing
  every scene file, not just `Root.tsx`.
- `SCENES` (S1–S5) are contiguous frame ranges that must sum to
  `DURATION_FRAMES` — no gaps or overlaps.
- All randomness goes through the seeded `mulberry32` PRNG in `timing.ts` —
  never `Math.random()` — so renders stay frame-reproducible.
- `public/score.wav` is gitignored and build-generated (`npm run score`);
  it exists on disk now but not on a fresh checkout — never hand-edit or
  commit it.
- `out/trailer.mp4` IS committed (force-added past the `out/` gitignore) —
  it's the actual deliverable, not a disposable build artifact.
- Content policy (from the design spec): all visuals are original code-drawn
  animation — no AI-generated footage, no copyrighted assets, no reproducing
  the real 2007 photo, no photoreal likenesses of real people. Players are
  silhouettes identified only by kit/aura color, never faces.
