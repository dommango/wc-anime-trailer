import React, { useEffect, useMemo, useRef } from 'react';
import { AbsoluteFill, continueRender, delayRender, useCurrentFrame } from 'remotion';
import { GALAXY_AURA, SOLAR_AURA } from '../lib/palette';
import { makeBolt, makeParticles } from '../lib/particles';
import { mulberry32 } from '../lib/timing';

/** Energy aura. 'galaxy' = orbiting icy motes; 'solar' = gold core + crackling bolts. */
export const Aura: React.FC<{
  variant: 'galaxy' | 'solar';
  cx: number;
  cy: number;
  radius?: number;
  intensity: number;
  seed?: number;
}> = ({ variant, cx, cy, radius = 190, intensity, seed = 5 }) => {
  const frame = useCurrentFrame();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handle = useMemo(() => delayRender(), []);
  const motes = useMemo(() => makeParticles(seed, 90, 1, 1, 0.2, 1), [seed]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) {
      continueRender(handle);
      return;
    }
    ctx.clearRect(0, 0, 1920, 1080);
    ctx.globalCompositeOperation = 'lighter';
    if (intensity <= 0.01) {
      continueRender(handle);
      return;
    }

    if (variant === 'galaxy') {
      for (let i = 0; i < 90; i++) {
        const m = motes[i];
        const ang = m.phase + frame * 0.02 * m.speed + i;
        const rr = radius * (0.35 + m.r * 0.65);
        const x = cx + Math.cos(ang) * rr;
        const y = cy + Math.sin(ang) * rr * 0.62;
        const tw = 0.5 + 0.5 * Math.sin(frame * 0.15 + m.phase * 7);
        ctx.fillStyle = i % 3 === 0 ? GALAXY_AURA.secondary : GALAXY_AURA.primary;
        ctx.globalAlpha = intensity * tw * 0.85;
        ctx.beginPath();
        ctx.arc(x, y, 1.2 + m.speed * 2.6, 0, Math.PI * 2);
        ctx.fill();
      }
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0, `rgba(127,208,255,${0.35 * intensity})`);
      g.addColorStop(1, 'rgba(127,208,255,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
    } else {
      const flick = 0.75 + 0.25 * Math.sin(frame * 0.9);
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g.addColorStop(0, `rgba(255,210,63,${0.5 * intensity * flick})`);
      g.addColorStop(0.55, `rgba(255,90,42,${0.22 * intensity})`);
      g.addColorStop(1, 'rgba(193,18,31,0)');
      ctx.globalAlpha = 1;
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      const boltSeed = seed * 100 + Math.floor(frame / 3);
      const r = mulberry32(boltSeed);
      for (let b = 0; b < 6; b++) {
        const ang = r() * Math.PI * 2;
        const x2 = cx + Math.cos(ang) * radius * (1.0 + r() * 0.35);
        const y2 = cy + Math.sin(ang) * radius * (1.0 + r() * 0.35);
        const pts = makeBolt(boltSeed + b, cx, cy, x2, y2, 8);
        ctx.strokeStyle = b % 2 ? SOLAR_AURA.primary : '#fff2c8';
        ctx.lineWidth = 1.5 + r() * 2.2;
        ctx.globalAlpha = intensity * (0.5 + r() * 0.5);
        ctx.beginPath();
        pts.forEach(([x, y], i) => (i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
        ctx.stroke();
      }
    }
    continueRender(handle);
  }, [frame, variant, cx, cy, radius, intensity, motes, seed, handle]);

  return (
    <AbsoluteFill>
      <canvas ref={canvasRef} width={1920} height={1080} style={{ width: '100%', height: '100%' }} />
    </AbsoluteFill>
  );
};
