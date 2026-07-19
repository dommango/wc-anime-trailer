import { mulberry32 } from '../lib/timing';

export const SAMPLE_RATE = 44100;
export const DURATION_SEC = 30;

export interface Stereo {
  left: Float32Array;
  right: Float32Array;
}

/** Single seeded noise source — synthesis order is fixed, so output is deterministic. */
const noise = mulberry32(99);

const envAD = (t: number, a: number, d: number): number =>
  t < a ? t / a : Math.max(0, 1 - (t - a) / d);

const panGains = (pan: number): [number, number] => [
  Math.cos(((pan + 1) * Math.PI) / 4),
  Math.sin(((pan + 1) * Math.PI) / 4),
];

const addVoice = (buf: Stereo, at: number, len: number, pan: number, fn: (t: number) => number): void => {
  const [gl, gr] = panGains(pan);
  const start = Math.floor(at * SAMPLE_RATE);
  const n = Math.min(Math.floor(len * SAMPLE_RATE), buf.left.length - start);
  for (let i = 0; i < n; i++) {
    const v = fn(i / SAMPLE_RATE);
    buf.left[start + i] += v * gl;
    buf.right[start + i] += v * gr;
  }
};

/** Taiko-style drum: pitch-dropping sine thump + noise snap. */
const taikoHit = (buf: Stereo, at: number, gain: number): void => {
  addVoice(buf, at, 0.5, 0, (t) => {
    const f = 120 - 70 * Math.min(1, t / 0.16);
    const thump = Math.sin(2 * Math.PI * f * t) * envAD(t, 0.004, 0.38);
    const snap = (noise() * 2 - 1) * envAD(t, 0.002, 0.07) * 0.35;
    return (thump + snap) * gain;
  });
};

/** Slow string-ish pad: detuned saw pairs through a one-pole lowpass. */
const pad = (buf: Stereo, at: number, len: number, freqs: number[], gain: number): void => {
  const state = freqs.map(() => 0);
  const saw = (x: number) => 2 * (x - Math.floor(x + 0.5));
  addVoice(buf, at, len, 0, (t) => {
    const attack = Math.min(1, t / 0.8);
    const release = Math.min(1, (len - t) / 0.9);
    let v = 0;
    for (let i = 0; i < freqs.length; i++) {
      const raw = (saw(freqs[i] * t) + saw(freqs[i] * 1.006 * t)) * 0.5;
      state[i] += 0.06 * (raw - state[i]);
      v += state[i];
    }
    return (v / freqs.length) * gain * attack * release;
  });
};

/** Karplus-Strong plucked string ("Spanish guitar" motif voice). */
const pluck = (buf: Stereo, at: number, freq: number, gain: number, pan = 0.25): void => {
  const period = Math.round(SAMPLE_RATE / freq);
  const n = Math.floor(1.3 * SAMPLE_RATE);
  const ring = new Float32Array(period);
  for (let i = 0; i < period; i++) ring[i] = noise() * 2 - 1;
  const [gl, gr] = panGains(pan);
  const start = Math.floor(at * SAMPLE_RATE);
  let idx = 0;
  for (let i = 0; i < n && start + i < buf.left.length; i++) {
    const cur = ring[idx];
    ring[idx] = 0.996 * 0.5 * (cur + ring[(idx + 1) % period]);
    buf.left[start + i] += cur * gain * gl;
    buf.right[start + i] += cur * gain * gr;
    idx = (idx + 1) % period;
  }
};

/** Filtered-noise riser, opening lowpass + quadratic gain ramp. */
const riser = (buf: Stereo, at: number, len: number, gain: number): void => {
  let lp = 0;
  addVoice(buf, at, len, 0, (t) => {
    const k = t / len;
    lp += (0.01 + k * 0.25) * ((noise() * 2 - 1) - lp);
    return lp * gain * k * k;
  });
};

/** Cinematic impact: taiko + long noise crash. */
const bigHit = (buf: Stereo, at: number, gain: number): void => {
  taikoHit(buf, at, gain * 1.15);
  addVoice(buf, at, 1.4, 0, (t) => (noise() * 2 - 1) * envAD(t, 0.003, 1.2) * 0.5 * gain);
};

const heartbeat = (buf: Stereo, at: number): void => {
  taikoHit(buf, at, 0.5);
  taikoHit(buf, at + 0.3, 0.34);
};

export const synthesizeScore = (): Stereo => {
  const buf: Stereo = {
    left: new Float32Array(SAMPLE_RATE * DURATION_SEC),
    right: new Float32Array(SAMPLE_RATE * DURATION_SEC),
  };

  // S1 (0–5s): low drone + distant taiko
  pad(buf, 0, 5.4, [55, 110, 110.6], 0.1);
  taikoHit(buf, 0.6, 0.5);
  taikoHit(buf, 2.6, 0.42);
  taikoHit(buf, 4.6, 0.55);

  // S2 (5–10s): warm pad + plucked motif
  pad(buf, 5, 5.4, [220, 277.18, 329.63], 0.11);
  pluck(buf, 5.6, 329.63, 0.5);
  pluck(buf, 7.0, 392.0, 0.5);
  pluck(buf, 8.4, 440.0, 0.55);

  // S3 (10–18s): riser into driving drums + faster motif
  riser(buf, 10, 1.2, 0.5);
  pad(buf, 10.5, 7.7, [110, 164.81, 220, 277.18], 0.1);
  for (let i = 0; i < 14; i++) taikoHit(buf, 11.2 + i * 0.5, i % 2 === 0 ? 0.5 : 0.32);
  [329.63, 392.0, 440.0, 523.25].forEach((f, i) => pluck(buf, 12.2 + i * 0.5, f, 0.4));
  [440.0, 392.0, 523.25, 587.33].forEach((f, i) => pluck(buf, 14.7 + i * 0.5, f, 0.42));

  // S4 (18–25s): clash percussion + rising sweep
  pad(buf, 18, 7.4, [146.83, 220, 293.66, 369.99], 0.1);
  for (let i = 0; i < 16; i++) bigHit(buf, 18 + i * 0.4375, i % 4 === 0 ? 0.55 : 0.26);
  riser(buf, 22.5, 2.6, 0.55);

  // S5 (25–30s): hush, heartbeat, white-flash impact (local frame 67 → 27.23s), resolve
  heartbeat(buf, 25.6);
  bigHit(buf, 27.3, 1.0);
  pad(buf, 27.4, 2.5, [220, 277.18, 329.63, 440], 0.13);

  // normalize + soft limit
  let peak = 0;
  for (let i = 0; i < buf.left.length; i++) {
    peak = Math.max(peak, Math.abs(buf.left[i]), Math.abs(buf.right[i]));
  }
  const scale = peak > 0 ? 0.89 / peak : 1;
  for (let i = 0; i < buf.left.length; i++) {
    buf.left[i] = Math.tanh(buf.left[i] * scale);
    buf.right[i] = Math.tanh(buf.right[i] * scale);
  }
  return buf;
};

/** 44.1kHz stereo 16-bit PCM WAV. */
export const writeWav = (buf: Stereo): Buffer => {
  const n = buf.left.length;
  const out = Buffer.alloc(44 + n * 2 * 2);
  out.write('RIFF', 0);
  out.writeUInt32LE(36 + n * 4, 4);
  out.write('WAVE', 8);
  out.write('fmt ', 12);
  out.writeUInt32LE(16, 16);
  out.writeUInt16LE(1, 20);
  out.writeUInt16LE(2, 22);
  out.writeUInt32LE(SAMPLE_RATE, 24);
  out.writeUInt32LE(SAMPLE_RATE * 4, 28);
  out.writeUInt16LE(4, 32);
  out.writeUInt16LE(16, 34);
  out.write('data', 36);
  out.writeUInt32LE(n * 4, 40);
  for (let i = 0; i < n; i++) {
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.left[i])) * 32767), 44 + i * 4);
    out.writeInt16LE(Math.round(Math.max(-1, Math.min(1, buf.right[i])) * 32767), 44 + i * 4 + 2);
  }
  return out;
};
