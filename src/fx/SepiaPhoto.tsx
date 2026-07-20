import React from 'react';
import { SEPIA } from '../lib/palette';
import { mulberry32 } from '../lib/timing';

/**
 * Original sepia illustration: a footballer silhouette gently holding a baby
 * at a photoshoot. NOT a reproduction of any real photograph.
 * `alive` 0→1 opens the baby's eyes and warms the print; `wind` 0→1 sweeps streaks across.
 */
export const SepiaPhoto: React.FC<{ alive: number; wind: number; width?: number }> = ({
  alive,
  wind,
  width = 860,
}) => {
  const streaks = React.useMemo(() => {
    const r = mulberry32(41);
    return Array.from({ length: 6 }, () => ({
      y: 60 + r() * 500,
      len: 120 + r() * 260,
      w: 1 + r() * 2.5,
      sp: 0.6 + r() * 0.8,
    }));
  }, []);
  return (
    <div
      style={{
        width,
        background: SEPIA.frame,
        padding: 22,
        transform: 'rotate(-2deg)',
        boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
      }}
    >
      <svg viewBox="0 0 900 620" style={{ display: 'block', width: '100%' }}>
        <defs>
          <radialGradient id="vig" cx="50%" cy="45%" r="75%">
            <stop offset="55%" stopColor={SEPIA.ink} stopOpacity="0" />
            <stop offset="100%" stopColor={SEPIA.ink} stopOpacity="0.55" />
          </radialGradient>
          <linearGradient id="backdrop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2cda4" />
            <stop offset="100%" stopColor="#b58f5c" />
          </linearGradient>
          <pattern id="dots" width="7" height="7" patternUnits="userSpaceOnUse">
            <circle cx="3.5" cy="3.5" r="0.9" fill={SEPIA.ink} opacity="0.16" />
          </pattern>
          <radialGradient id="warmglow" cx="50%" cy="45%" r="60%">
            <stop offset="0%" stopColor="#ffe9b8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffe9b8" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="900" height="620" fill="url(#backdrop)" />
        <rect y="470" width="900" height="150" fill="#a37c4c" opacity="0.55" />

        {/* adult silhouette, kneeling, cradling arms */}
        <g fill={SEPIA.ink}>
          <circle cx="380" cy="205" r="42" />
          <path d="M 382 250 C 340 292 328 356 344 420 L 318 508 L 362 514 L 386 444 C 408 476 448 486 478 474 L 508 528 L 544 512 L 512 448 C 528 380 486 296 432 258 C 414 246 396 244 382 250 Z" />
          <path d="M 366 318 C 330 356 372 402 436 396" stroke={SEPIA.ink} strokeWidth="26" strokeLinecap="round" fill="none" />
        </g>

        {/* baby bundle + head */}
        <ellipse cx="440" cy="386" rx="54" ry="34" fill="#5a4530" />
        <circle cx="466" cy="364" r="21" fill="#6b543a" />

        {/* baby eyes: closed lids fade out, open eyes fade in */}
        <g stroke={SEPIA.ink} strokeWidth="2.4" strokeLinecap="round" opacity={1 - alive}>
          <line x1="456" y1="362" x2="463" y2="362" />
          <line x1="469" y1="362" x2="476" y2="362" />
        </g>
        <g fill={SEPIA.ink} opacity={alive}>
          <circle cx="459.5" cy="360" r="2.2" />
          <circle cx="472.5" cy="360" r="2.2" />
        </g>

        <rect width="900" height="620" fill="url(#dots)" />
        <rect width="900" height="620" fill="url(#vig)" />
        <rect width="900" height="620" fill="url(#warmglow)" opacity={alive * 0.5} />

        {/* wind streaks tearing through the frame */}
        <g opacity={wind}>
          {streaks.map((s, i) => (
            <rect
              key={i}
              x={-300 + wind * 1400 * s.sp}
              y={s.y}
              width={s.len}
              height={s.w}
              fill="#fff8ea"
              opacity="0.7"
            />
          ))}
        </g>
      </svg>
    </div>
  );
};
