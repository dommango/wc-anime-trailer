import React, { useMemo } from 'react';
import { SEPIA } from '../lib/palette';
import { makeShards } from '../lib/particles';
import { easeOutCubic } from '../lib/timing';

/** The photograph exploding into glowing shards. Overlays a 900×620 photo box. */
export const ShatterShards: React.FC<{
  progress: number;
  seed?: number;
  glow?: string;
}> = ({ progress: p, seed = 11, glow = '#ffd9a0' }) => {
  const shards = useMemo(() => makeShards(seed, 38, 900, 620, glow), [seed, glow]);
  const e = easeOutCubic(p);
  if (e <= 0) return null;
  return (
    <svg
      viewBox="0 0 900 620"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible' }}
    >
      {shards.map((s, i) => {
        const dx = s.vx * e * 1.6;
        const dy = s.vy * e * 1.6 + 300 * e * e;
        return (
          <polygon
            key={i}
            points={s.points.map(([x, y]) => `${x},${y}`).join(' ')}
            fill={SEPIA.mid}
            stroke={s.glow}
            strokeWidth={2}
            opacity={1 - e}
            transform={`translate(${dx} ${dy}) rotate(${s.rot + s.vrot * e} ${s.cx} ${s.cy})`}
            style={{ filter: `drop-shadow(0 0 ${10 * (1 - e)}px ${s.glow})` }}
          />
        );
      })}
    </svg>
  );
};
