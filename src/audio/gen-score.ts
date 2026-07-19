import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { synthesizeScore, writeWav } from './synth';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', '..', 'public', 'score.wav');
mkdirSync(dirname(out), { recursive: true });
writeFileSync(out, writeWav(synthesizeScore()));
console.log(`score written → ${out}`);
