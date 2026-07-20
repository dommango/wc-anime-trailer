import React, { useMemo } from 'react';
import { makeCracks } from '../lib/particles';

/** Cracks radiating from a footstep, drawn on via stroke-dash animation. */
export const GroundCracks: React.FC<{
  x: number;
  y: number;
  progress: number;
  seed?: number;
  color?: string;
}> = ({ x, y, progress: p, seed = 3, color = '#0a0c10' }) => {
  const cracks = useMemo(() => makeCracks(seed, x, y, 7, 190), [seed, x, y]);
  if (p <= 0) return null;
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {cracks.map((c, i) => (
        <path
          key={i}
          d={c.d}
          fill="none"
          stroke={color}
          strokeWidth={3.5}
          strokeLinecap="round"
          strokeDasharray={c.length}
          strokeDashoffset={c.length * (1 - p)}
          opacity={Math.min(1, p * 2)}
        />
      ))}
    </svg>
  );
};
