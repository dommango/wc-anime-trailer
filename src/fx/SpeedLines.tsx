import React, { useMemo } from 'react';
import { useCurrentFrame } from 'remotion';
import { mulberry32 } from '../lib/timing';

/** Radial action lines streaming outward from frame center. */
export const SpeedLines: React.FC<{ intensity: number; seed?: number; color?: string }> = ({
  intensity,
  seed = 9,
  color = '#ffffff',
}) => {
  const frame = useCurrentFrame();
  const lines = useMemo(() => {
    const r = mulberry32(seed);
    return Array.from({ length: 40 }, () => ({
      ang: r() * Math.PI * 2,
      inner: 240 + r() * 300,
      len: 160 + r() * 420,
      w: 1 + r() * 2.5,
      sp: 30 + r() * 90,
      op: 0.25 + r() * 0.5,
    }));
  }, [seed]);
  if (intensity <= 0.01) return null;
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {lines.map((l, i) => {
        const off = (frame * l.sp) % 600;
        const r1 = l.inner + off;
        const r2 = r1 + l.len;
        return (
          <line
            key={i}
            x1={960 + Math.cos(l.ang) * r1}
            y1={540 + Math.sin(l.ang) * r1}
            x2={960 + Math.cos(l.ang) * r2}
            y2={540 + Math.sin(l.ang) * r2}
            stroke={color}
            strokeWidth={l.w}
            opacity={l.op * intensity}
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
};
