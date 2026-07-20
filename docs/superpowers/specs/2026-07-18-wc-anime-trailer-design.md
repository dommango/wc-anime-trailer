# WC Anime Trailer — Design Spec

**Date:** 2026-07-18
**Deliverable:** A 30-second, hyper-cinematic anime-style trailer for a fictional Argentina vs Spain FIFA World Cup Final, rendered to a real MP4 via Remotion.

## Hard requirements

- Exactly **30.0 seconds**, **1920×1080**, **30 fps** (900 frames), 16:9, h264 MP4 at `out/trailer.mp4`.
- Five scenes matching the user's script (timeline below), with on-screen narration text and an original synthesized score.
- All visuals are original, code-drawn animation. No AI-generated footage, no copyrighted assets, no reproduction of the real 2007 photograph, no photoreal likenesses of real people.

## Tech stack

- **Remotion v4** + React + TypeScript, 2D only: Canvas2D particle systems, SVG shapes/paths, CSS transforms.
- No three.js/WebGL. No external media assets. Node 20 + npm available; Remotion bundles its own ffmpeg for rendering.

## Timeline (frame-exact, 30 fps)

| Scene | Frames | Sec | Beats |
|---|---|---|---|
| S1 | 0–149 | 0–5 | Stadium wide shot under orange wildfire-haze sky; drifting smoke particles; faint sun disc; nervous crowd silhouettes. Narration: *"Tomorrow… beneath a sky consumed by smoke… history waits."* |
| S2 | 150–299 | 5–10 | Sepia "photograph" (original stylized illustration: adult player silhouette holding a baby, photoshoot vibe). Photo comes alive: baby's eyes open, wind streaks tear through, smoke starts moving. Narration: *"Long before either of them knew… one legend held the future in his hands."* |
| S3 | 300–539 | 10–18 | Photo explodes into glowing shards. Two figures appear at opposite pitch ends: albiceleste figure with icy blue-white galaxy aura; red-kit figure with crimson-gold lightning. Ball levitates center. Stadium transforms into floating battlefield above Earth. Footsteps crack ground; ball touches emit shockwave rings. |
| S4 | 540–749 | 18–25 | Duel montage: afterimage dribble trails (blue) vs explosive feints (crimson); fast orbiting camera; radial speed lines; smoke canopy splits with each clash; sky crossfades orange haze → brilliant blue as sunlight breaks through. |
| S5 | 750–899 | 25–30 | Time slows; ball hangs still; 3-frame sepia photo flashback; both nod; both explode toward ball — the red figure arrives first; white flash on his contact frame (the winning strike); smoke gone, perfect blue sky, ball launched skyward, galaxy aura dimmed, solar aura flooding. Narration: *"Even the smoke could not hide what destiny had already written. / One last dance. / Destiny wears red."* Fade to black. Title cards: **ARGENTINA vs SPAIN** / **FIFA WORLD CUP FINAL** / **SPAIN — WORLD CHAMPIONS**. |

## Characters & likeness policy

- Players are original anime-style **silhouetted figures**; identity carried by kit colors (Argentina white/sky stripes, Spain red) and aura color, never by faces.
- The S2/S5 "photograph" is drawn from scratch in a sepia illustration style — compositionally inspired by the famous shoot but not a copy of the actual copyrighted photo.

## FX component library (`src/fx/`)

Each component is small, single-purpose, frame-driven (deterministic from `useCurrentFrame()`), and takes a `frame`/`progress` plus palette props.

- `SmokeField` — layered drifting haze particles (Canvas2D, seeded PRNG so renders are deterministic).
- `Aura` — swirling galaxy particle aura (blue-white variant) and crackling jagged-polyline lightning variant (crimson-gold).
- `SpeedLines` — radial/directional animated SVG lines for clashes and sprint bursts.
- `ShatterShards` — polygon shards of the photo scattering with simple physics (velocity + rotation + fade).
- `Shockwave` — expanding glow rings on ball touches and clashes.
- `Afterimages` — trailing ghost silhouettes behind the dribbling figure.
- `GroundCracks` — animated SVG crack paths radiating from footsteps.
- `SkyGradient` — keyframed sky: smoky orange → hazy transition → brilliant blue; sun disc that strengthens as haze clears.
- `KineticText` — cinematic serif narration: blur-in, letter-tracking expansion, line-by-line timing.
- `CameraRig` — wrapper applying per-scene camera motion: slow push-ins, shake on clashes, orbit illusion via scale+rotate, whip transitions.

## Audio (`src/audio/gen-score.ts`)

Build-time Node script (no deps) synthesizes an original ~30 s WAV, cued to scene boundaries:

- **S1:** low drone + distant taiko hits (sine thump + filtered noise).
- **S2:** soft string pad (detuned saws through lowpass) + sparse Karplus-Strong plucked "guitar" motif.
- **S3:** riser (noise sweep) into driving drum pattern + pad; pluck motif returns faster.
- **S4:** percussion intensifies, rhythmic hits synced to clash frames; rising pitch sweep.
- **S5:** sudden near-silence at slow-mo, single heartbeat thump, then full hit + cymbal-ish noise bloom on the white flash; short resolving tail under title cards.

Output: `public/score.wav` (44.1 kHz stereo), wired into the composition with `<Audio>`. No copyrighted music, no voice synthesis — narration is on-screen text only.

## File structure

```
projects/wc-anime-trailer/
  package.json  tsconfig.json  remotion.config.ts
  src/
    Root.tsx            # composition registration (900 frames, 1080p30)
    Trailer.tsx         # scene sequencer (<Sequence> per scene)
    lib/timing.ts       # frame constants, easing/lerp helpers, seeded PRNG
    scenes/Scene1.tsx … Scene5.tsx
    fx/                 # components listed above
    audio/gen-score.ts  # WAV synthesis script (npm run score)
  public/score.wav      # generated
  out/trailer.mp4       # render target
```

## Build & verification

1. `npm install` (remotion, @remotion/cli, react, react-dom, typescript).
2. `npm run score` → generates `public/score.wav`.
3. Iterate per scene: render short segment previews, extract frames, visually inspect.
4. Final: `npx remotion render` → `out/trailer.mp4`.
5. Verify: `ffprobe` shows duration 30.0 s, 1920×1080, 30 fps; extract one frame per scene midpoint and inspect; spot-check audio waveform exists (`ffprobe` stream info).

## Out of scope

- Voiceover narration, licensed music, real photographs or logos (FIFA/adidas/etc.), photoreal faces, 3D/WebGL, multi-language text.
