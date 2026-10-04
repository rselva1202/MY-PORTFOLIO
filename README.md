# SELVAGANAPATHY R — Portfolio 2026 (scroll-driven video edition)

A single-page portfolio whose background is **seven scroll-driven video scenes**.
Plain HTML + CSS + Tailwind utilities, GSAP 3.12.5 + ScrollTrigger for motion,
Lenis 1.1.14 for smooth scroll. No bundler, no framework, **no Three.js**.

**Files:** `index.html` · `style.css` · `main.js` · `prepare-assets.sh` ·
`check-contrast.js` · `assets/video/*` · `assets/posters/*`

> **Footage note:** the clips are a **third-party demo asset** (`assets/source/videoplayback.webm`),
> not the portfolio owner's own video, and some scenes carry a "SUYO" watermark that
> is cropped out by the 106%-scale/top-crop in `prepare-assets.sh`. Replace the source
> before publishing to a real audience.

---

## How it works

| Piece | Where |
|---|---|
| Per-scene settings (`scenes.config`) | `SCENES` — top of `main.js` |
| Video layers, sources, playback, crossfades | `SceneSystem` — `main.js` §08 |
| Text reveals / card staggers (per breakpoint) | `setupChoreography()` — §09 |
| Progress meter + background toggle | §10 |
| Asset pipeline | `prepare-assets.sh` |
| Contrast proof | `check-contrast.js` |

Seven `.scene` wrappers are stacked in a fixed `#sceneLayer` under a fixed
`#sceneScrim`. Scrolling scrubs a crossfade at each section boundary
(`start: "top 80%"`, `end: "top 30%"`), a slow zoom `1.06 → 1.14` with a ±2%
parallax, and the scrim/accent — the boundary crossfade animates the
**wrapper's** opacity, never the clips inside it.

Each wrapper holds **two identical `<video>` elements (A and B)** at
`playbackRate` (0.8, and 0.5 for the 1.2s S6). Neither element uses the native
`loop` attribute; a `requestAnimationFrame` pump starts B from
`currentTime 0` and crossfades A → B over `loopFade` (`ease: "none"`), pauses A,
then swaps their roles — so the clip loops indefinitely with no visible seam.
The lead is measured in **media** seconds (`loopFade * playbackRate`), so the
0.5× S6 clip starts its swap early enough to land on the same frame.

The loop runs while the section holding the viewport midpoint is active
(>50% in view) and is torn down when it is not: `cancelAnimationFrame`, both
clips paused, in-flight tweens killed. Only the active scene and the one after
it are `preload="auto"`, so at most four clips decode.

Set `SCENES.loop = false` to fall back to play-once-and-hold.

## Changing, reordering or adding a scene

**Swap a clip** — drop `assets/video/s5.webm`, `s5.mp4`, `s5-m.mp4` and
`assets/posters/s5.jpg` into place. No code change.

**Change a scene's look** — edit its entry in `SCENES.sections`: `overlay`
(scene-wide scrim 0.35–0.55), `textAlpha` (text-side stop), `accent`,
`playbackRate`, and `objectPosition.desktop` / `.mobile` (keeps the subject in
frame on portrait). Re-run `node check-contrast.js` after changing `textAlpha`.

**Reorder scenes** — reorder the array. The page order follows the array order,
so the array must match the `<section>` order in `index.html`.

**Add an eighth scene** — 1. add a `<section class="panel" data-scene="s8" id="…">`;
2. append `{ id, label, scene:'s8', source, textSide, overlay, textAlpha, accent,
playbackRate, objectPosition }` to `SCENES.sections`; 3. add `s8:START:DURATION`
to `SCENES` in `prepare-assets.sh` and re-run it. The meter, crossfades, scrim,
accent, zoom and playback all derive from the array — nothing else to wire up.

## Editing content

All copy lives in the single `CONFIG` object at the top of `main.js` (§02) — the
HTML holds no editable text. Edit one place and reload:

- `CONFIG.name` / `role` — the hero name and the line under it. The display name
  is **auto-fitted**: `fitName()` measures the text column on load, on resize and
  after the webfont lands, so it never wraps or reaches the subject.
- `CONFIG.about.bio` — one array entry per paragraph. `showStats` and
  `showCareAbout` are `false`; the stats row and the "what I care about" list
  are not built until real figures exist.
- `CONFIG.projects` — one object per card: `title`, `description`, `tags`,
  `year` (`''` hides it), `image`, `panel` (styled placeholder when there is no
  screenshot yet), `link` (`null` renders a non-navigating "Links coming soon"
  card). Drop a screenshot into `assets/projects/` and set `image`; set `link`
  and the whole card becomes the anchor, opening in a new tab.
- `CONFIG.skillGroups` — the bento cards. `span` is a 6-track column count at
  desktop (`2+2+2` on row one, `4+2` on row two); `icon` picks a key from
  `ICONS`.
- `CONFIG.socials` / `CONFIG.email` — contact links and the address the form
  hands to the visitor's mail app.

## Verified

- `node check-contrast.js` → **PASS**, all 7 scenes: headings **13.9–14.6:1**,
  body **8.2–8.7:1**, card copy **12.3:1** against *measured* p95 text-side luma
  (S1 196, S2 233, S3 219, S4 200, S5 198, S6 217, S7 218 — ffmpeg `signalstats`).
- Clip weights: desktop MP4 **20.8 MB**, desktop WebM **22.4 MB** (budget 30 MB),
  mobile 720p **9.6 MB** (budget 12 MB). Re-encoded at CRF 27/37/28 to fit;
  the brief's CRF 23/33/26 produced 35.0/31.1/12.5 MB.
- Crossfade measured in-browser: `[1,0,…]` at rest → `[0.5,0.5,0,…]` mid-boundary
  → `[0,1,0,…]` inside the next section, with the scrim morphing 0.89 → 0.93.
- Playback rules: `playbackRate` 0.8 normally, **0.5** on Contact; only the active
  and next scenes are `preload="auto"` (four clips decode).
- A/B loop verified in-browser with a stubbed `requestAnimationFrame`: the swap
  fires exactly inside the lead window and not outside it — S1 lead **0.48s**
  (0.6 × 0.8), S6 lead **0.30s** (0.6 × 0.5) — B starts at `currentTime 0`,
  opacities cross `1/0 → 0.5/0.5 → 0/1`, A pauses, roles swap. Observed live on
  a fresh load with both clips playing mid-fade. Tearing a scene down leaves
  `raf: 0`, both clips paused, and `preload="metadata"` off the active pair.
- WebM chosen on desktop, `-m.mp4` under 768px; Three.js never requested.

## Deploying

Static — drag the folder to Netlify, or `vercel` with no build command and output
directory `.`. Assets are relative paths, so any static host works. Self-host
the two fonts and the three CDN libraries if you need offline operation.

## Accessibility & performance notes

- Muted + `playsinline` videos; `aria-hidden` on the video layer. Background
  motion pauses on `visibilitychange` and whenever the tab is hidden.
- `prefers-reduced-motion` or `navigator.connection.saveData` → **no clip is
  fetched at all**; posters show with a CSS slow zoom and the crossfades remain.
- Autoplay refused (`NotAllowedError`) → same poster fallback. A benign
  `AbortError` from scrolling between scenes is ignored, not treated as a block.
- Semantic sections, skip link, `:focus-visible` outlines in the scene accent,
  keyboard-operable meter. The case-study overlay markup and its FLIP code are
  still in the tree but currently unreached: cards now link out to real sites or
  stand alone, and its click handler is scoped to `.card-link[data-case]` so it
  cannot swallow a card's external link.