# MASTER PROMPT: Scroll-driven video background for the portfolio site

## ROLE
You are a senior frontend engineer (GSAP, ScrollTrigger, video performance, UI/UX). You are REVISING an existing single-page portfolio site (current code attached). Replace the Three.js tree background with a scroll-driven VIDEO background made from the attached video. Keep everything else that works: Lenis smooth scroll, GSAP + ScrollTrigger, nav, cards, cursor, grain overlay, copy and placeholder content. Return the complete updated project.

## SOURCE VIDEO
Attached file: `videoplayback` (1080p version of a ~41s, 30fps, silent video with 7 scenes). All timestamps below are in seconds and were measured on a 1440p version, so FIRST VERIFY THEM on the attached file (run ffmpeg `blackdetect` and scene detection, and extract frames at each boundary), and adjust by a few tenths of a second if they differ.

### SCENE TIMELINE (source range to use, trimmed away from transitions)

| Scene | Source range | Length | Content | Subject position | Avoid |
|---|---|---|---|---|---|
| S1 | 1.8 -> 7.0 | 5.2s | Golden autumn forest, subject holding a scroll | RIGHT | black 0-1.6, dark dip ~7.3-7.7 |
| S2 | 8.0 -> 12.8 | 4.8s | Farmland at golden hour, subject raising a tool | center-right | hard cut at ~12.97 |
| S3 | 13.2 -> 17.2 | 4.0s | Cold blue snowy forest, small figure | center-left | white-out ~17.4-18.2 |
| S4 | 18.4 -> 23.2 | 4.8s | Smiling portrait, soft sky | DEAD CENTER | orange leaf wipe ~23.4-23.8 |
| S5 | 24.0 -> 29.6 | 5.6s | Golden hills at sunset, profile face | RIGHT | dark dip ~29.9-30.3 |
| S6 | 30.6 -> 31.8 | 1.2s | Sunset beach, figure seen from behind | right | dark ~32-33.2 |
| S7 | 33.5 -> 38.0 | 4.5s | Close-up face looking down, golden beach | large, RIGHT | black from 38.17 to end |

Notes:
- S6 is very short: play it at 0.5x speed, then hold the last frame.
- A small "SUYO" watermark appears bottom-left or bottom-right in some scenes. Crop it out by scaling every clip to 106% and anchoring it at the top (cuts about 5% from the bottom), or hide it behind UI. This is a demo site, so keep a code comment noting the footage is a third-party demo asset.

## STEP 1: PREPARE THE ASSETS (do this first and show the commands you ran)
For each scene, make:
- `assets/video/sN.mp4` (H.264, 1920x1080, crf 23, preset slow, 30fps, yuv420p, `-an`, `-movflags +faststart`, `-g 30`)
- `assets/video/sN.webm` (VP9, crf 33, `-b:v 0`, `-an`)
- `assets/video/sN-m.mp4` (mobile: 1280x720, crf 26)
- `assets/posters/sN.jpg` (first frame, quality 3, 1920px wide)

Use `-ss START -i input -t DURATION` (input seeking with `-t`, not `-to`). Target total size: under 30 MB for desktop clips, under 12 MB for mobile.

## STEP 2: SECTIONS AND SCENE MAPPING
Expand the page from 4 to 7 sections, one scene each. Keep the existing copy and card styles, and write new placeholder content in the same tone.

1. HOME -> S1: text on the LEFT, subject stays visible on the right
2. WORK (cards) -> S2: heading left, 6 project cards in a grid on solid panels (about 90% opaque)
3. ABOUT -> S3: text on the RIGHT (figure is center-left); cool tint, calm layout
4. SKILLS -> S5: text on the LEFT; service cards plus skill chips
5. TESTIMONIALS -> S4: face is centered, so put a small heading top-left and a row of 3 quote cards anchored to the bottom 40% of the screen, leaving the face clear
6. CONTACT -> S6: form and email button on the LEFT
7. FOOTER -> S7: large closing line on the left, small footer row (S7 fades in during the last scroll)

Every section is at least 100vh (Home, Work and Skills can be 120 to 150vh).

## STEP 3: SCROLL-DRIVEN SCENE SYSTEM
- **Layers:** one fixed container (z-index below content, inset 0) holding 7 stacked `<video>` elements: muted, playsinline, `preload="metadata"` (the active and next one use `"auto"`), poster set, `object-fit: cover`, `will-change: opacity, transform`.
- **Crossfade (scrubbed):** for each boundary between two sections, use a ScrollTrigger with `scrub: true`, start `"top 80%"` and end `"top 30%"` of the NEXT section, tweening outgoing opacity 1 -> 0 and incoming 0 -> 1. The fade follows the scrollbar and reverses when the user scrolls up.
- **Playback:** when a scene's section is more than 50% in view, play it from the start (`currentTime = 0`). Play ONCE at `playbackRate` 0.8 and hold on the last frame (no hard loop, because the clips are only 4 to 5 seconds). S6 uses `playbackRate` 0.5. Pause every scene that is fully hidden. Handle the `play()` promise rejection (autoplay blocked) by showing the poster.
- **Scroll-linked motion** so the scene never feels frozen: a slow zoom (scale 1.06 -> 1.14) and a small vertical parallax on the active video, scrubbed to that section's scroll progress.
- **Per-scene tuning in ONE CONFIG object:** file name, source times, text side, overlay opacity, object-position (desktop and mobile), accent color, playbackRate.
- **Accent color per scene** (CSS variable animated by GSAP): warm gold `#ffc46b` for S1, S2, S4, S5, S6 and S7, ice blue `#7fd8ea` for S3.
- **Progress meter** on the right: 7 dots labeled Home, Work, About, Skills, Reviews, Contact, End. The active dot uses the scene accent, and clicking a dot smooth-scrolls to its section.

## STEP 4: READABILITY
- Add one flat single-color scrim over the video (warm black `#0b0806`): 35 to 55% depending on the scene (set in CONFIG), heavier on the text side.
- Keep text away from faces: left text for S1, S5, S6, S7; right text for S3; bottom cards for S4.
- Cards are solid dark panels with hairline borders. No glassmorphism.
- Meet contrast of 4.5:1 for body text and 7:1 for headings on every scene.

## STEP 5: PERFORMANCE, MOBILE, ACCESSIBILITY
- Only the active and next videos may be decoding at once. Free hidden ones by pausing them (and clear their `src` if memory is tight).
- Choose video sources in JS: desktop gets the 1080p MP4 or WebM (WebM first if supported), widths under 768px get the `-m` 720p MP4.
- On portrait phones, set object-position per scene so the subject stays visible (for example 75% center for S1, 80% center for S5).
- If `prefers-reduced-motion`, `navigator.connection.saveData`, or autoplay fails: show only the poster images with a CSS slow zoom, and keep the same crossfades.
- Remove Three.js and any code it needed. Keep the page's total JS small.
- Semantic HTML, visible focus states, keyboard-accessible nav and progress meter, `aria-hidden` on the video layer, and a pause-background button in the corner.

## DELIVERABLES
1. Updated project: `index.html`, `assets/video/*`, `assets/posters/*`.
2. A `scenes.config` block at the top of the JS (all per-scene settings).
3. The exact ffmpeg commands (a `prepare-assets.sh` script).
4. A short changelog and a note on how to change a scene, reorder scenes, or add a new section.

## PROCESS
1. Verify timestamps and run prepare-assets.
2. Build the stacked video layers and the scrubbed crossfade for all 7 scenes with placeholder sections.
3. Restore the real content and cards per section.
4. Scrim, readability and per-scene accent.
5. Mobile, reduced-motion and fallback posters.
6. Polish.

Do not ask questions unless something blocks the build.
