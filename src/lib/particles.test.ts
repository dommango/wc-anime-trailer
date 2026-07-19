import { describe, expect, it } from 'vitest';
import { lerpColor } from './palette';
import { makeBolt, makeCracks, makeParticles, makeShards } from './particles';

describe('lerpColor', () => {
  it('interpolates hex colors', () => {
    expect(lerpColor('#000000', '#ffffff', 0.5)).toBe('#808080');
    expect(lerpColor('#000000', '#ffffff', 0)).toBe('#000000');
    expect(lerpColor('#ff0000', '#00ff00', 1)).toBe('#00ff00');
  });
});

describe('makeParticles', () => {
  it('is deterministic and in-bounds', () => {
    const a = makeParticles(7, 10, 100, 50, 5, 20);
    const b = makeParticles(7, 10, 100, 50, 5, 20);
    expect(a).toEqual(b);
    expect(a).toHaveLength(10);
    for (const p of a) {
      expect(p.x).toBeGreaterThanOrEqual(0);
      expect(p.x).toBeLessThanOrEqual(100);
      expect(p.r).toBeGreaterThanOrEqual(5);
      expect(p.r).toBeLessThanOrEqual(20);
    }
  });
});

describe('makeShards', () => {
  it('makes deterministic 3-4 point polygons with outward velocity', () => {
    const s = makeShards(11, 38, 900, 620, '#ffd9a0');
    expect(s).toHaveLength(38);
    expect(s).toEqual(makeShards(11, 38, 900, 620, '#ffd9a0'));
    for (const sh of s) {
      expect(sh.points.length).toBeGreaterThanOrEqual(3);
      expect(sh.points.length).toBeLessThanOrEqual(4);
      expect(sh.glow).toBe('#ffd9a0');
    }
  });
});

describe('makeBolt', () => {
  it('anchors endpoints and is deterministic', () => {
    const pts = makeBolt(5, 0, 0, 100, 50, 8);
    expect(pts[0]).toEqual([0, 0]);
    expect(pts[pts.length - 1]).toEqual([100, 50]);
    expect(pts).toHaveLength(9);
    expect(pts).toEqual(makeBolt(5, 0, 0, 100, 50, 8));
  });
});

describe('makeCracks', () => {
  it('starts each path at the origin point', () => {
    const cracks = makeCracks(3, 500, 800, 7, 190);
    expect(cracks).toHaveLength(7);
    for (const c of cracks) {
      expect(c.d.startsWith('M 500 800')).toBe(true);
      expect(c.length).toBe(190);
    }
  });
});
