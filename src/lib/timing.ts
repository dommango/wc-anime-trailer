export const FPS = 30;
export const DURATION_FRAMES = 900;

/** Global frame ranges for the five scenes (contiguous, sums to 900). */
export const SCENES = {
  S1: { from: 0, duration: 150 },
  S2: { from: 150, duration: 150 },
  S3: { from: 300, duration: 240 },
  S4: { from: 540, duration: 210 },
  S5: { from: 750, duration: 150 },
} as const;

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);

/** Normalized progress of `frame` across [from, from+duration), clamped to [0,1]. */
export const progress = (frame: number, from: number, duration: number): number =>
  clamp01((frame - from) / (duration - 1));

/** Deterministic PRNG so every render frame is reproducible. */
export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

/** Deterministic per-frame camera shake offset within ±intensity. */
export const shake = (frame: number, intensity: number, seed = 1): { x: number; y: number } => {
  if (intensity <= 0) return { x: 0, y: 0 };
  const r = mulberry32(seed * 100003 + frame);
  return { x: (r() - 0.5) * 2 * intensity, y: (r() - 0.5) * 2 * intensity };
};
