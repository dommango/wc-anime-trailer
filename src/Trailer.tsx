import React from 'react';
import { AbsoluteFill, Audio, Sequence, staticFile } from 'remotion';
import { SCENES } from './lib/timing';
import { Scene1 } from './scenes/Scene1';
import { Scene2 } from './scenes/Scene2';

export const Trailer: React.FC = () => (
  <AbsoluteFill style={{ backgroundColor: '#000' }}>
    <Sequence from={SCENES.S1.from} durationInFrames={SCENES.S1.duration}>
      <Scene1 />
    </Sequence>
    <Sequence from={SCENES.S2.from} durationInFrames={SCENES.S2.duration}>
      <Scene2 />
    </Sequence>
    <Audio src={staticFile('score.wav')} />
  </AbsoluteFill>
);
