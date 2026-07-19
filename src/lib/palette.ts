const hexToRgb = (hex: string): [number, number, number] => {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

/** Interpolate two `#rrggbb` colors; t in [0,1]. */
export const lerpColor = (a: string, b: string, t: number): string => {
  const ca = hexToRgb(a);
  const cb = hexToRgb(b);
  return `#${ca
    .map((v, i) => Math.round(v + (cb[i] - v) * t).toString(16).padStart(2, '0'))
    .join('')}`;
};

export const SKY = {
  smokyTop: '#4a2410', smokyMid: '#a8501c', smokyBottom: '#d97a2b',
  clearTop: '#0b3d91', clearMid: '#2f7fd6', clearBottom: '#9fd0ff',
  sunCore: '#fff3d6', sunGlow: '#ffb347',
} as const;

export const GALAXY_AURA = { primary: '#7fd0ff', secondary: '#ffffff', deep: '#1a4fd6' } as const;
export const SOLAR_AURA = { primary: '#ffd23f', secondary: '#ff5a2a', deep: '#c1121f' } as const;
export const SEPIA = { bg: '#e8d5b0', ink: '#3d2b1a', mid: '#a08050', frame: '#f5ead0' } as const;
