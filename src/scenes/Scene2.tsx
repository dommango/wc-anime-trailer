import React from 'react';
import { AbsoluteFill, useCurrentFrame } from 'remotion';
import { CameraRig } from '../fx/CameraRig';
import { KineticText } from '../fx/KineticText';
import { SepiaPhoto } from '../fx/SepiaPhoto';
import { SmokeField } from '../fx/SmokeField';
import { easeInOutCubic, lerp, progress } from '../lib/timing';

/** 5–10s: the photograph comes alive. "Long before either of them knew… one legend held the future in his hands." */
export const Scene2: React.FC = () => {
  const frame = useCurrentFrame();
  const alive = progress(frame, 42, 28);
  const wind = progress(frame, 98, 40);
  const push = lerp(1, 1.06, easeInOutCubic(progress(frame, 0, 150)));
  return (
    <AbsoluteFill style={{ backgroundColor: '#14100b' }}>
      <CameraRig scale={push}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 50% 42%, rgba(255,225,170,0.14), transparent 60%)',
          }}
        />
        <div style={{ position: 'absolute', left: '50%', top: '46%', transform: 'translate(-50%, -50%)' }}>
          <SepiaPhoto alive={alive} wind={wind} width={880} />
        </div>
        <SmokeField clearing={0.25} tint="232,213,176" count={12} seed={21} rise={60} />
      </CameraRig>
      <KineticText
        size={50}
        lines={[
          { text: '"Long before either of them knew…"', at: 15, hold: 55 },
          { text: '"one legend held the future in his hands."', at: 74, hold: 52 },
        ]}
      />
    </AbsoluteFill>
  );
};
