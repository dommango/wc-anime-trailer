import React from 'react';
import { easeOutCubic } from '../lib/timing';

/** Expanding double ring on ball touches and clashes. */
export const Shockwave: React.FC<{
  x: number;
  y: number;
  progress: number;
  color?: string;
  maxR?: number;
}> = ({ x, y, progress: p, color = '#ffffff', maxR = 420 }) => {
  if (p <= 0 || p >= 1) return null;
  const e = easeOutCubic(p);
  return (
    <svg
      viewBox="0 0 1920 1080"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
    >
      {[0, 0.12].map((lag, i) => {
        const pe = Math.max(0, e - lag);
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r={maxR * pe}
            fill="none"
            stroke={color}
            strokeWidth={6 * (1 - pe) + 1}
            opacity={(1 - pe) * 0.8}
          />
        );
      })}
    </svg>
  );
};
