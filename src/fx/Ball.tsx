import React from 'react';

/** The ball — rendered small, glowing, often levitating. */
export const Ball: React.FC<{ x: number; y: number; scale?: number; glow?: string }> = ({
  x,
  y,
  scale = 1,
  glow = '#ffffff',
}) => (
  <svg
    width={64 * scale}
    height={64 * scale}
    viewBox="0 0 64 64"
    style={{
      position: 'absolute',
      left: x - 32 * scale,
      top: y - 32 * scale,
      filter: `drop-shadow(0 0 ${14 * scale}px ${glow})`,
    }}
  >
    <circle cx="32" cy="32" r="26" fill="#f6f8fb" stroke="#1c212b" strokeWidth="2.5" />
    <polygon points="32,22 41,28.5 37.5,39 26.5,39 23,28.5" fill="#1c212b" />
    <g stroke="#1c212b" strokeWidth="2">
      <line x1="32" y1="22" x2="32" y2="8" />
      <line x1="41" y1="28.5" x2="53" y2="24" />
      <line x1="37.5" y1="39" x2="45" y2="49" />
      <line x1="26.5" y1="39" x2="19" y2="49" />
      <line x1="23" y1="28.5" x2="11" y2="24" />
    </g>
  </svg>
);
