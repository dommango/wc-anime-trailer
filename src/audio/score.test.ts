import { describe, expect, it } from 'vitest';
import { DURATION_SEC, SAMPLE_RATE, synthesizeScore, writeWav } from './synth';

const buf = synthesizeScore();

const rmsAt = (t: number, windowSec = 0.2): number => {
  const s = Math.floor(t * SAMPLE_RATE);
  const n = Math.floor(windowSec * SAMPLE_RATE);
  let sum = 0;
  for (let i = s; i < s + n; i++) sum += buf.left[i] * buf.left[i];
  return Math.sqrt(sum / n);
};

describe('score synthesis', () => {
  it('produces exactly 30 seconds per channel', () => {
    expect(buf.left.length).toBe(SAMPLE_RATE * DURATION_SEC);
    expect(buf.right.length).toBe(SAMPLE_RATE * DURATION_SEC);
  });

  it('is not silent', () => {
    const rms = Math.sqrt(buf.left.reduce((s, v) => s + v * v, 0) / buf.left.length);
    expect(rms).toBeGreaterThan(0.01);
  });

  it('is louder at the 27.3s impact than the 25.9s hush', () => {
    expect(rmsAt(27.35)).toBeGreaterThan(rmsAt(25.95) * 2);
  });

  it('stays within [-1, 1]', () => {
    for (let i = 0; i < buf.left.length; i += 97) {
      expect(Math.abs(buf.left[i])).toBeLessThanOrEqual(1);
      expect(Math.abs(buf.right[i])).toBeLessThanOrEqual(1);
    }
  });

  it('writes a valid 44.1kHz stereo 16-bit RIFF/WAVE buffer', () => {
    const wav = writeWav(buf);
    expect(wav.toString('ascii', 0, 4)).toBe('RIFF');
    expect(wav.toString('ascii', 8, 12)).toBe('WAVE');
    expect(wav.readUInt32LE(24)).toBe(44100);
    expect(wav.readUInt16LE(22)).toBe(2);
    expect(wav.length).toBe(44 + SAMPLE_RATE * DURATION_SEC * 2 * 2);
  });
});
