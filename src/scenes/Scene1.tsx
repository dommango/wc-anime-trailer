import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CameraRig } from '../fx/CameraRig';
import { KineticText } from '../fx/KineticText';
import { SkyGradient } from '../fx/SkyGradient';
import { SmokeField } from '../fx/SmokeField';
import { easeInOutCubic, lerp, progress } from '../lib/timing';

/** 0–5s: stadium under wildfire sky. "Tomorrow… beneath a sky consumed by smoke… history waits." */
export const Scene1: React.FC = () => {
  const frame = useCurrentFrame();
  const push = lerp(1, 1.12, easeInOutCubic(progress(frame, 0, 150)));
  const crowdFlicker = 0.72 + 0.08 * Math.sin(frame / 5);
  return (
    <AbsoluteFill style={{ backgroundColor: '#160c06' }}>
      <CameraRig scale={push}>
        <SkyGradient clearing={0.05} sunStrength={0.15} />
        <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <path d="M 240 1080 L 330 700 Q 960 560 1590 700 L 1680 1080 Z" fill="#0d0f14" opacity="0.95" />
          <path d="M 330 700 Q 960 560 1590 700 L 1546 762 Q 960 646 374 762 Z" fill="#1a1f2b" />
          <path d="M 374 762 Q 960 646 1546 762 L 1546 1080 L 374 1080 Z" fill="#10141c" opacity={crowdFlicker} />
          <rect x="296" y="600" width="10" height="130" fill="#0d0f14" />
          <rect x="1614" y="600" width="10" height="130" fill="#0d0f14" />
          <circle cx="301" cy="592" r="26" fill="#fff7e0" opacity="0.18" />
          <circle cx="1619" cy="592" r="26" fill="#fff7e0" opacity="0.18" />
          <circle cx="301" cy="592" r="9" fill="#fff7e0" opacity="0.9" />
          <circle cx="1619" cy="592" r="9" fill="#fff7e0" opacity="0.9" />
        </svg>
        <SmokeField clearing={0} count={46} seed={7} />
      </CameraRig>
      <KineticText
        lines={[
          { text: '"Tomorrow… beneath a sky consumed by smoke…"', at: 22, hold: 58 },
          { text: '"history waits."', at: 92, hold: 40 },
        ]}
      />
    </AbsoluteFill>
  );
};
