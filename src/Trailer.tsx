import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './lib/timing';
import { Scene1 } from './scenes/Scene1';

export const Trailer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Sequence from={SCENES.S1.from} durationInFrames={SCENES.S1.duration}>
      <Scene1 />
    </Sequence>
    <Audio src={staticFile('score.wav')} />
  </AbsoluteFill>
);
