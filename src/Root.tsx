import React from 'react';
import { Composition } from 'remotion';
import { Trailer } from './Trailer';

export const RemotionRoot: React.FC = () => (
  <Composition id="Trailer" component={Trailer} durationInFrames={900} fps={30} width={1920} height={1080} />
);
