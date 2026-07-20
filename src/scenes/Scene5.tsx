import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { Aura } from '../fx/Aura';
import { Ball } from '../fx/Ball';
import { KineticText } from '../fx/KineticText';
import { PlayerFigure } from '../fx/PlayerFigure';
import { SepiaPhoto } from '../fx/SepiaPhoto';
import { SkyGradient } from '../fx/SkyGradient';
import { SmokeField } from '../fx/SmokeField';
import { SpeedLines } from '../fx/SpeedLines';
import { lerp, progress } from '../lib/timing';

/** 25–30s: slow-mo, flashback, the nod, Spain's strike, white flash, blue sky, titles. */
export const Scene5: React.FC = () => {
  const frame = useCurrentFrame();
  const nod = Math.sin(progress(frame, 44, 14) * Math.PI) * 6;
  const lunge = progress(frame, 59, 8);   // Spain — a half-step quicker
  const lungeL = progress(frame, 59, 14); // Argentina — arrives late
  const xL = lerp(660, 800, lungeL);      // falls short of the ball (960)
  const xR = lerp(1130, 900, lunge);      // reaches it
  const flash = frame >= 67 && frame < 69 ? 1 : frame >= 69 ? Math.max(0, 1 - (frame - 69) / 26) : 0;
  const clearSky = progress(frame, 67, 20);
  const hazeLeft = 0.8 + 0.2 * clearSky; // faint remnants, fully gone after the flash
  const dim = progress(frame, 118, 18);
  const title = progress(frame, 128, 12);
  const ballRise = progress(frame, 69, 12);

  return (
    <AbsoluteFill style={{ backgroundColor: '#04060c' }}>
      <SkyGradient clearing={hazeLeft} sunStrength={clearSky} />
      {clearSky < 1 && <SmokeField clearing={hazeLeft} count={26} seed={17} rise={120} />}

      <svg viewBox="0 0 1920 1080" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <ellipse cx="960" cy="820" rx="880" ry="180" fill="#1a3a24" />
      </svg>

      {/* the ball hangs perfectly still — until the strike launches it skyward */}
      <Ball x={960} y={lerp(640 + 3 * Math.sin(frame / 8), -260, ballRise)} scale={1.35} />

      {/* face to face: the nod, then both explode toward the ball — Spain gets there first */}
      <div style={{ position: 'absolute', left: xL, top: 480, transform: `translateY(${nod}px)` }}>
        <PlayerFigure pose={frame >= 69 || lungeL === 0 ? 'stand' : 'sprint'} kit="argentina" rim="#7fd0ff" size={300} />
      </div>
      <div style={{ position: 'absolute', left: xR, top: 480, transform: `translateY(${nod}px)` }}>
        <PlayerFigure pose={frame >= 69 || lunge === 0 ? 'stand' : 'sprint'} kit="spain" rim="#ffd23f" size={300} flip />
      </div>
      <Aura variant="galaxy" cx={xL + 130} cy={650} intensity={(0.8 + lungeL * 0.2) * (1 - clearSky * 0.75)} seed={5} />
      <Aura variant="solar" cx={xR + 130} cy={650} intensity={0.8 + lunge * 0.2 + clearSky * 0.6} seed={8} />
      <SpeedLines intensity={lunge * 0.9} seed={9} />

      {/* 3-frame sepia flashback */}
      {frame >= 40 && frame < 43 && (
        <AbsoluteFill style={{ backgroundColor: '#14100b' }}>
          <div style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}>
            <SepiaPhoto alive={1} wind={0} width={880} />
          </div>
        </AbsoluteFill>
      )}

      {/* Spain's contact — white light engulfs the screen */}
      <AbsoluteFill style={{ backgroundColor: '#fff', opacity: flash }} />

      <KineticText
        size={46}
        lines={[
          { text: '"Even the smoke could not hide what destiny had already written."', at: 74, hold: 24 },
          { text: '"One last dance."', at: 100, hold: 15 },
          { text: '"Destiny wears red."', at: 117, hold: 16 },
        ]}
      />

      {/* fade to black, then title cards */}
      <AbsoluteFill style={{ backgroundColor: '#000', opacity: dim }} />
      <AbsoluteFill style={{ opacity: title, justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', fontFamily: 'Georgia, serif', color: '#fff' }}>
          <div style={{ fontSize: 88, letterSpacing: '0.32em', textIndent: '0.32em' }}>ARGENTINA vs SPAIN</div>
          <div style={{ width: 520, height: 2, background: '#d4af37', margin: '26px auto' }} />
          <div style={{ fontSize: 36, letterSpacing: '0.5em', textIndent: '0.5em', color: '#d4af37' }}>
            FIFA WORLD CUP FINAL
          </div>
          <div style={{ marginTop: 40, fontSize: 34, letterSpacing: '0.42em', textIndent: '0.42em', color: '#ff5a3c' }}>
            SPAIN — WORLD CHAMPIONS
          </div>
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
