import React from 'react';
import { AbsoluteFill } from 'remotion';

/** Applies camera-style transform to everything inside (text stays outside). */
export const CameraRig: React.FC<{
  scale?: number;
  x?: number;
  y?: number;
  rotate?: number;
  children: React.ReactNode;
}> = ({ scale = 1, x = 0, y = 0, rotate = 0, children }) => (
  <AbsoluteFill
    style={{
      transform: `scale(${scale}) translate(${x}px, ${y}px) rotate(${rotate}deg)`,
      transformOrigin: '50% 50%',
    }}
  >
    {children}
  </AbsoluteFill>
);
