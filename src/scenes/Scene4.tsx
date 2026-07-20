import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Afterimages } from '../fx/Afterimages';
import { Aura } from '../fx/Aura';
import { Ball } from '../fx/Ball';
import { CameraRig } from '../fx/CameraRig';
import { GroundCracks } from '../fx/GroundCracks';
import { PlayerFigure } from '../fx/PlayerFigure';
import { Shockwave } from '../fx/Shockwave';
import { SkyGradient } from '../fx/SkyGradient';
import { SmokeField } from '../fx/SmokeField';
import { SpeedLines } from '../fx/SpeedLines';
import { easeInOutCubic, lerp, progress, shake } from '../lib/timing';

const BEATS = [0, 26, 52, 78, 104, 130, 156, 182];

/** 18–25s: the duel. Clashes split the smoke; the sky clears orange → blue. No narration. */
export const Scene4: React.FC = () => {
  const frame = useCurrentFrame();
  const pAll = progress(frame, 0, 210);
  const clear = easeInOutCubic(pAll);
  const pFig = easeInOutCubic(pAll);
  const xL = lerp(470, 840, pFig);
  const xR = lerp(1450, 1080, pFig);
  const yFig = 500;
  const midX = (xL + xR) / 2;

  const shakeAmp = BEATS.reduce(
    (a, b) => Math.max(a, frame >= b ? Math.max(0, 14 - (frame - b) * 1.4) : 0),
    0,
  );
  const sh = shake(frame, shakeAmp);
  const flashOp = BEATS.some((b) => frame >= b && frame < b + 2) ? 0.85 : 0;
  const trailL = [1, 2, 3, 4].map((k) =>
    lerp(470, 840, easeInOutCubic(progress(frame - k * 3, 0, 210))),
  );

  return (
    <AbsoluteFill style={{ backgroundColor: '#04060c' }}>
      <CameraRig scale={1.06 + 0.1 * pAll} rotate={2.4 * Math.sin(frame / 34)} x={sh.x} y={sh.y}>
        <SkyGradient clearing={clear} sunStrength={clear} />
        <SmokeField clearing={clear} count={40} seed={12} rise={420} />

        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <ellipse cx="960" cy="800" rx="880" ry="180" fill="#142d1b" opacity="0.9" />
        </svg>

        <Aura variant="galaxy" cx={xL + 130} cy={yFig + 170} intensity={1} seed={5} />
        <Aura variant="solar" cx={xR + 130} cy={yFig + 170} intensity={1} seed={8} />

        <Afterimages xs={trailL} y={yFig + 320} pose="dribble" kit="argentina" rim="#7fd0ff" />
        <div style={{ position: 'absolute', left: xL, top: yFig }}>
          <PlayerFigure pose="dribble" kit="argentina" rim="#7fd0ff" size={300} />
        </div>
        <div style={{ position: 'absolute', left: xR, top: yFig }}>
          <PlayerFigure pose="sprint" kit="spain" rim="#ffd23f" size={300} flip />
        </div>

        <Ball x={lerp(xL + 200, midX, 0.5 + 0.5 * Math.sin(frame / 9))} y={yFig + 330} scale={1} />

        {BEATS.map((b) => (
          <Shockwave
            key={b}
            x={midX}
            y={620}
            progress={progress(frame, b, 20)}
            color={b % 52 === 0 ? '#bfe6ff' : '#ffd9a0'}
            maxR={430}
          />
        ))}
        {BEATS.filter((_, i) => i % 2 === 1).map((b) => (
          <GroundCracks key={b} x={xR + 120} y={yFig + 330} progress={progress(frame, b, 16)} seed={b} color="#3a1206" />
        ))}
        <SpeedLines intensity={0.25 + shakeAmp / 18} seed={9} />
      </CameraRig>

      {/* clash flash */}
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flashOp }} />
    </AbsoluteFill>
  );
};
