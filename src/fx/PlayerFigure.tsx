import React from 'react';

export type Pose = 'stand' | 'dribble' | 'sprint';

const LIMB = '#0b0d12';

const POSES: Record<Pose, { arms: string[]; legs: string[]; lean: number }> = {
  stand: {
    arms: ['M 84 84 C 68 102 62 124 66 148', 'M 116 84 C 132 102 138 124 134 148'],
    legs: [
      'M 88 150 L 84 232 L 82 296 L 96 296 L 99 232 L 100 150 Z',
      'M 112 150 L 116 232 L 118 296 L 104 296 L 101 232 L 100 150 Z',
    ],
    lean: 0,
  },
  dribble: {
    arms: ['M 84 84 C 66 96 58 112 56 132', 'M 116 84 C 134 96 142 114 146 136'],
    legs: [
      'M 88 150 C 82 190 78 236 80 296 L 94 296 C 96 240 98 196 100 150 Z',
      'M 110 150 C 128 172 138 200 136 234 L 146 290 L 132 296 L 120 240 C 112 210 104 180 100 150 Z',
    ],
    lean: 4,
  },
  sprint: {
    arms: ['M 84 84 C 64 92 52 108 48 128', 'M 116 84 C 136 94 148 112 152 134'],
    legs: [
      'M 108 150 C 130 168 142 194 144 226 L 158 282 L 144 290 L 126 236 C 116 206 106 178 100 150 Z',
      'M 90 150 C 74 178 62 210 56 244 L 40 292 L 54 298 L 72 248 C 82 216 92 182 100 150 Z',
    ],
    lean: 14,
  },
};

/** Stylized anime silhouette footballer. Identity comes from kit colors + rim glow, never a face. */
export const PlayerFigure: React.FC<{
  pose: Pose;
  kit: 'argentina' | 'spain';
  rim: string;
  flip?: boolean;
  size?: number;
}> = ({ pose, kit, rim, flip = false, size = 260 }) => {
  const p = POSES[pose];
  const gradId = `kit-${kit}`;
  return (
    <svg
      width={size}
      height={size * 1.6}
      viewBox="0 0 200 320"
      style={{
        transform: flip ? 'scaleX(-1)' : undefined,
        filter: `drop-shadow(0 0 16px ${rim})`,
        display: 'block',
        overflow: 'visible',
      }}
    >
      <defs>
        {kit === 'argentina' ? (
          <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#f2f6fa" />
            <stop offset="12%" stopColor="#f2f6fa" />
            <stop offset="12%" stopColor="#8fc3ee" />
            <stop offset="25%" stopColor="#8fc3ee" />
            <stop offset="25%" stopColor="#f2f6fa" />
            <stop offset="37%" stopColor="#f2f6fa" />
            <stop offset="37%" stopColor="#8fc3ee" />
            <stop offset="50%" stopColor="#8fc3ee" />
            <stop offset="50%" stopColor="#f2f6fa" />
            <stop offset="62%" stopColor="#f2f6fa" />
            <stop offset="62%" stopColor="#8fc3ee" />
            <stop offset="75%" stopColor="#8fc3ee" />
            <stop offset="75%" stopColor="#f2f6fa" />
            <stop offset="87%" stopColor="#f2f6fa" />
            <stop offset="87%" stopColor="#8fc3ee" />
            <stop offset="100%" stopColor="#8fc3ee" />
          </linearGradient>
        ) : (
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c21430" />
            <stop offset="100%" stopColor="#7d0d20" />
          </linearGradient>
        )}
      </defs>
      <g transform={`rotate(${p.lean} 100 150)`} stroke={rim} strokeOpacity="0.85" strokeWidth="1.6">
        {p.legs.map((d, i) => (
          <path key={`l${i}`} d={d} fill={LIMB} />
        ))}
        <path
          d="M 82 78 C 76 104 75 126 82 150 L 118 150 C 125 126 124 104 118 78 C 106 68 94 68 82 78 Z"
          fill={`url(#${gradId})`}
        />
        {p.arms.map((d, i) => (
          <path key={`a${i}`} d={d} fill="none" stroke={LIMB} strokeWidth="13" strokeLinecap="round" />
        ))}
        <circle cx="100" cy="46" r="19" fill={LIMB} />
      </g>
    </svg>
  );
};
