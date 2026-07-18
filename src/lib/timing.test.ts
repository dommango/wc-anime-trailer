import { describe, expect, it } from 'vitest';
import {
  DURATION_FRAMES, FPS, SCENES,
  clamp01, lerp, easeInOutCubic, easeOutCubic, progress, mulberry32, shake,
} from './timing';

describe('scene timeline', () => {
  it('scenes are contiguous and total exactly 30s', () => {
    const order = [SCENES.S1, SCENES.S2, SCENES.S3, SCENES.S4, SCENES.S5];
    expect(order.reduce((n, s) => n + s.duration, 0)).toBe(DURATION_FRAMES);
    expect(DURATION_FRAMES / FPS).toBe(30);
    let cursor = 0;
    for (const s of order) {
      expect(s.from).toBe(cursor);
      cursor += s.duration;
    }
  });
});

describe('interpolation helpers', () => {
  it('clamp01 bounds values', () => {
    expect(clamp01(-1)).toBe(0);
    expect(clamp01(0.4)).toBe(0.4);
    expect(clamp01(2)).toBe(1);
  });
  it('lerp interpolates', () => {
    expect(lerp(0, 10, 0.5)).toBe(5);
    expect(lerp(10, 20, 0)).toBe(10);
  });
  it('easings hit expected anchors', () => {
    expect(easeInOutCubic(0)).toBe(0);
    expect(easeInOutCubic(0.5)).toBeCloseTo(0.5, 6);
    expect(easeInOutCubic(1)).toBe(1);
    expect(easeOutCubic(0)).toBe(0);
    expect(easeOutCubic(1)).toBe(1);
  });
  it('progress clamps to [0,1] across a scene', () => {
    expect(progress(-5, 0, 150)).toBe(0);
    expect(progress(0, 0, 150)).toBe(0);
    expect(progress(200, 0, 150)).toBe(1);
    expect(progress(149, 0, 150)).toBe(1);
  });
});

describe('mulberry32', () => {
  it('is deterministic for the same seed', () => {
    const a = mulberry32(42); const b = mulberry32(42);
    for (let i = 0; i < 5; i++) expect(a()).toBe(b());
  });
  it('differs across seeds and stays in [0,1)', () => {
    const a = mulberry32(1); const b = mulberry32(2);
    const va = a(); const vb = b();
    expect(va).not.toBe(vb);
    expect(va).toBeGreaterThanOrEqual(0);
    expect(va).toBeLessThan(1);
  });
});

describe('shake', () => {
  it('is deterministic per frame and zero at zero intensity', () => {
    expect(shake(10, 0)).toEqual({ x: 0, y: 0 });
    expect(shake(10, 5)).toEqual(shake(10, 5));
    expect(Math.abs(shake(10, 5).x)).toBeLessThanOrEqual(5);
  });
});
