import React, { useMemo } from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Aura } from '../fx/Aura';
import { Ball } from '../fx/Ball';
import { GroundCracks } from '../fx/GroundCracks';
import { PlayerFigure } from '../fx/PlayerFigure';
import { SepiaPhoto } from '../fx/SepiaPhoto';
import { ShatterShards } from '../fx/ShatterShards';
import { Shockwave } from '../fx/Shockwave';
import { mulberry32, progress } from '../lib/timing';

/** 10–18s: photo explodes; two legends face off on a battlefield floating above Earth. No narration. */
export const Scene3: React.FC = () => {
  const frame = useCurrentFrame();
  const shatter = progress(frame, 0, 40);
  const reveal = progress(frame, 20, 30);
  const auraIn = progress(frame, 32, 40);
  const stars = useMemo(() => {
    const r = mulberry32(31);
    return Array.from({ length: 70 }, () => ({
      x: r() * 1920,
      y: r() * 500,
      rad: 0.6 + r() * 1.6,
      op: 0.3 + r() * 0.7,
    }));
  }, []);

  return (
    <AbsoluteFill style={{ backgroundColor: '#04060c' }}>
      {/* stars + Earth horizon */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} opacity={reveal}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.rad} fill="#cfe6ff" opacity={s.op} />
        ))}
        <circle cx="960" cy="2450" r="1560" fill="#0b2a5b" />
        <circle cx="960" cy="2450" r="1560" fill="none" stroke="#7ec8ff" strokeWidth="10" opacity="0.5" />
      </svg>

      {/* floating pitch */}
      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} opacity={reveal}>
        <ellipse cx="960" cy="780" rx="880" ry="190" fill="#16351f" />
        <ellipse cx="960" cy="780" rx="880" ry="190" fill="none" stroke="#dff3e3" strokeWidth="3" opacity="0.35" />
        <ellipse cx="960" cy="780" rx="170" ry="38" fill="none" stroke="#dff3e3" strokeWidth="2.5" opacity="0.35" />
        <line x1="960" y1="600" x2="960" y2="960" stroke="#dff3e3" strokeWidth="2.5" opacity="0.35" />
      </svg>

      {/* the two figures */}
      <div style={{ position: 'absolute', left: 350, top: 470, opacity: reveal }}>
        <PlayerFigure pose="stand" kit="argentina" rim="#7fd0ff" size={300} />
      </div>
      <div style={{ position: 'absolute', left: 1270, top: 470, opacity: reveal }}>
        <PlayerFigure pose="stand" kit="spain" rim="#ffd23f" size={300} flip />
      </div>
      <Aura variant="galaxy" cx={500} cy={640} intensity={auraIn} seed={5} />
      <Aura variant="solar" cx={1420} cy={640} intensity={auraIn} seed={8} />

      {/* levitating ball + pulsing shockwaves */}
      <Ball x={960} y={640 - 14 * Math.sin(frame / 11) * reveal - 40 * (1 - reveal)} scale={1.15} />
      {[90, 135, 180].map((b) => (
        <Shockwave key={b} x={960} y={640} progress={progress(frame, b, 30)} color="#bfe6ff" maxR={360} />
      ))}

      {/* footsteps fracture the ground */}
      <GroundCracks x={500} y={800} progress={progress(frame, 60, 22)} seed={3} />
      <GroundCracks x={1420} y={800} progress={progress(frame, 78, 22)} seed={4} />

      {/* the photograph, then its explosion into shards */}
      <div style={{ position: 'absolute', left: 510, top: 225, width: 900, transform: `scale(${1 + shatter * 0.06})` }}>
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 1 - progress(frame, 0, 10) }}>
            <SepiaPhoto alive={1} wind={0} width={900} />
          </div>
          <div style={{ position: 'absolute', inset: 0 }}>
            <ShatterShards progress={shatter} />
          </div>
        </div>
      </div>

      {/* white flash at the explosion */}
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: frame < 8 ? 1 - frame / 8 : 0 }} />
    </AbsoluteFill>
  );
};
