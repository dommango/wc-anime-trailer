import React from 'react';
import { AbsoluteFill } from 'remotion';
import { lerpColor, SKY } from '../lib/palette';
import { lerp } from '../lib/timing';

/** Sky crossfading smoky-orange → clear blue as `clearing` goes 0→1. */
export const SkyGradient: React.FC<{ clearing: number; sunStrength: number }> = ({
  clearing,
  sunStrength,
}) => {
  const top = lerpColor(SKY.smokyTop, SKY.clearTop, clearing);
  const mid = lerpColor(SKY.smokyMid, SKY.clearMid, clearing);
  const bot = lerpColor(SKY.smokyBottom, SKY.clearBottom, clearing);
  return (
    <AbsoluteFill style={{ background: `linear-gradient(180deg, ${top} 0%, ${mid} 55%, ${bot} 100%)` }}>
      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '18%',
          width: 260,
          height: 260,
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${SKY.sunCore} 0%, ${SKY.sunGlow} 35%, transparent 70%)`,
          opacity: lerp(0.15, 0.95, sunStrength),
          filter: `blur(${lerp(30, 4, sunStrength)}px)`,
        }}
      />
    </AbsoluteFill>
  );
};
