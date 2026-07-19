import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { clamp01, easeOutCubic, lerp, progress } from '../lib/timing';

export interface NarrationLine {
  text: string;
  at: number;   // local frame the line starts appearing
  hold: number; // frames held before blurring out
}

/** Cinematic narration: blur-in with tightening letter-tracking, hold, blur-out. */
export const KineticText: React.FC<{
  lines: NarrationLine[];
  color?: string;
  size?: number;
  bottom?: string;
}> = ({ lines, color = '#ffffff', size = 54, bottom = '12%' }) => {
  const frame = useCurrentFrame();
  const IN = 18;
  const OUT = 14;
  return (
    <AbsoluteFill>
      <div style={{ position: 'absolute', bottom, width: '100%', textAlign: 'center', padding: '0 120px' }}>
        {lines.map((line, i) => {
          const pin = easeOutCubic(progress(frame, line.at, IN));
          const pout = progress(frame, line.at + line.hold, OUT);
          const opacity = clamp01(pin - pout);
          if (opacity <= 0) return null;
          return (
            <div
              key={i}
              style={{
                opacity,
                filter: `blur(${(1 - pin) * 10 + pout * 8}px)`,
                letterSpacing: `${lerp(0.45, 0.08, pin)}em`,
                color,
                fontSize: size,
                fontFamily: 'Georgia, "Times New Roman", serif',
                fontStyle: 'italic',
                textShadow: '0 2px 24px rgba(0,0,0,0.85)',
                lineHeight: 1.5,
              }}
            >
              {line.text}
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
