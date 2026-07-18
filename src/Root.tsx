import React from 'react';
import { Composition } from 'remotion';
import { Trailer } from './Trailer';
import { DURATION_FRAMES, FPS } from './lib/timing';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Trailer"
    component={Trailer}
    durationInFrames={DURATION_FRAMES}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
