import React, { useEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { makeParticles } from '../lib/particles';

/** Drifting smoke/haze layer. `clearing` 0 = thick, 1 = gone. `tint` = 'r,g,b'. */
export const SmokeField: React.FC<{
  clearing: number;
  tint?: string;
  count?: number;
  seed?: number;
  rise?: number;
}> = ({ clearing, tint = '201,163,126', count = 42, seed = 7, rise = 260 }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useMemo(() => delayRender(), []);
  const particles = useMemo(() => makeParticles(seed, count, 2200, 1200, 60, 260), [seed, count]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      continueRender(handle);
      return;
    }
    ctx.clearRect(0, 0, 1920, 1080);
    const gone = 1 - clearing;
    for (const p of particles) {
      const x = ((p.x + frame * p.speed * 1.6) % 2200) - 140;
      const y = p.y + Math.sin(frame / 38 + p.phase) * 20 - clearing * rise;
      const a = p.alpha * gone;
      if (a <= 0.004) continue;
      const g = ctx.createRadialGradient(x, y, 0, x, y, p.r);
      g.addColorStop(0, `rgba(${tint},${a})`);
      g.addColorStop(1, `rgba(${tint},0)`);
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    continueRender(handle);
  }, [frame, particles, clearing, tint, rise, handle]);

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={1920} height={1080} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};
