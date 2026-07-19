import { mulberry32 } from './timing';

export interface Particle {
  x: number; y: number; r: number; speed: number; phase: number; alpha: number;
}

/** Seeded blob particles spread over a w×h field. */
export const makeParticles = (
  seed: number, count: number, w: number, h: number, rMin = 20, rMax = 120,
): Particle[] => {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => ({
    x: rand() * w,
    y: rand() * h,
    r: rMin + rand() * (rMax - rMin),
    speed: 0.2 + rand() * 0.8,
    phase: rand() * Math.PI * 2,
    alpha: 0.05 + rand() * 0.2,
  }));
};

export interface Shard {
  points: [number, number][];
  cx: number; cy: number;
  vx: number; vy: number;
  rot: number; vrot: number;
  glow: string;
}

/** Polygon shards of a w×h rectangle, velocities fanning out from center. */
export const makeShards = (seed: number, count: number, w: number, h: number, glow: string): Shard[] => {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    const cx = rand() * w;
    const cy = rand() * h;
    const n = 3 + Math.floor(rand() * 2);
    const points: [number, number][] = Array.from({ length: n }, () => [
      cx + (rand() - 0.5) * w * 0.18,
      cy + (rand() - 0.5) * h * 0.18,
    ]);
    const ang = Math.atan2(cy - h / 2, cx - w / 2) + (rand() - 0.5) * 0.8;
    const sp = 120 + rand() * 420;
    return {
      points, cx, cy,
      vx: Math.cos(ang) * sp,
      vy: Math.sin(ang) * sp - 60,
      rot: rand() * 360,
      vrot: (rand() - 0.5) * 540,
      glow,
    };
  });
};

/** Jagged lightning bolt from (x1,y1) to (x2,y2); deterministic per seed. */
export const makeBolt = (
  seed: number, x1: number, y1: number, x2: number, y2: number, segs = 8,
): [number, number][] => {
  const rand = mulberry32(seed);
  const pts: [number, number][] = [[x1, y1]];
  for (let i = 1; i < segs; i++) {
    const t = i / segs;
    pts.push([
      x1 + (x2 - x1) * t + (rand() - 0.5) * 46,
      y1 + (y2 - y1) * t + (rand() - 0.5) * 46,
    ]);
  }
  pts.push([x2, y2]);
  return pts;
};

export interface Crack { d: string; length: number; }

/** SVG crack paths fanning downward from (x,y). `length` drives dash animation. */
export const makeCracks = (seed: number, x: number, y: number, count = 6, len = 160): Crack[] => {
  const rand = mulberry32(seed);
  return Array.from({ length: count }, () => {
    let px = x;
    let py = y;
    let d = `M ${px} ${py}`;
    let ang = (rand() - 0.5) * Math.PI + Math.PI / 2;
    const segs = 3 + Math.floor(rand() * 3);
    for (let s = 0; s < segs; s++) {
      ang += (rand() - 0.5) * 0.9;
      const step = (len / segs) * (0.6 + rand() * 0.8);
      px += Math.cos(ang) * step;
      py += Math.sin(ang) * step * 0.5;
      d += ` L ${px.toFixed(1)} ${py.toFixed(1)}`;
    }
    return { d, length: len };
  });
};
