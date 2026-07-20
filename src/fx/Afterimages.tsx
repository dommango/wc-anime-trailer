import React from 'react';
import { PlayerFigure, Pose } from './PlayerFigure';

/** Glowing ghost trail behind a moving figure. `xs` = past x positions, oldest first. */
export const Afterimages: React.FC<{
  xs: number[];
  y: number;
  pose: Pose;
  kit: 'argentina' | 'spain';
  rim: string;
}> = ({ xs, y, pose, kit, rim }) => (
  <>
    {xs.map((x, i) => (
      <div
        key={i}
        style={{
          position: 'absolute',
          left: x - 130,
          top: y - 320,
          opacity: 0.08 + (i / xs.length) * 0.25,
        }}
      >
        <PlayerFigure pose={pose} kit={kit} rim={rim} />
      </div>
    ))}
  </>
);
