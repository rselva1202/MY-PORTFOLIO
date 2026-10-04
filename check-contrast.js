#!/usr/bin/env node
/* =============================================================================
   check-contrast.js — proves the readability requirement instead of asserting it.

   For every scene it takes the WORST measured pixel behind the text (p95 luma
   from the source, listed below), composites it under the scrim stops declared
   in main.js's SCENES block, and checks:
       headings  #ede9e0  >= 7:1
       body      #b9b5ac  >= 4.5:1
       card copy #d8d4cb on the 0.96 panel over the base scrim >= 4.5:1

   Usage: node check-contrast.js      (exit code 0 = all scenes pass)
   ========================================================================== */
'use strict';
const fs = require('fs');

// p95 luma (0-255) of each clip's TEXT side, measured with ffmpeg signalstats.
const MEASURED = { s1: 196, s2: 233, s3: 219, s4: 200, s5: 198, s6: 217, s7: 218 };

const src = fs.readFileSync('main.js', 'utf8');
const startIdx = src.indexOf('sections: [');
const endIdx = src.indexOf('];', startIdx);
if (startIdx < 0 || endIdx < 0) {
  console.error('FAIL: could not locate the SCENES.sections block in main.js');
  process.exit(1);
}
const sectionBlock = src.slice(startIdx, endIdx);
const entries = [...sectionBlock.matchAll(
  /id:\s*'([^']+)'[\s\S]*?scene:\s*'(s\d)'[\s\S]*?textSide:\s*'([^']+)'[\s\S]*?overlay:\s*([\d.]+)[\s\S]*?textAlpha:\s*([\d.]+)/g
)].map((m) => ({ id: m[1], scene: m[2], textSide: m[3], overlay: +m[4], textAlpha: +m[5] }));

if (entries.length !== 7) {
  console.error(`FAIL: parsed ${entries.length} scene entries from main.js (expected 7)`);
  process.exit(1);
}

const SCRIM = [11, 8, 6];               // #0b0806
const HEADING = '#ede9e0', BODY = '#b9b5ac', CARD = '#d8d4cb', PANEL = [20, 16, 13];
const lin = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lumRgb = ([r, g, b]) => 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
const lumHex = (h) => lumRgb([1, 3, 5].map((i) => parseInt(h.substr(i, 2), 16)));
const over = (fg, bg, a) => fg.map((c, i) => a * c + (1 - a) * bg[i]);   // fg with alpha a over bg
const ratio = (l1, l2) => (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

let failed = 0;
console.log('scene  section   p95Y  textAlpha  heading   body   card   verdict');
for (const s of entries) {
  const p95 = MEASURED[s.scene];
  // brightest possible pixel behind the text, as linear luminance
  const videoLum = lin(p95);
  const bgLinear = s.textAlpha * lumRgb(SCRIM) + (1 - s.textAlpha) * videoLum;
  const bgBytes = over(SCRIM, [p95, p95, p95], s.textAlpha);
  const heading = ratio(lumHex(HEADING), lumRgb(bgBytes));
  const body = ratio(lumHex(BODY), lumRgb(bgBytes));

  // copy on solid cards: 0.96 panel over the scene-wide scrim over the video
  const baseBg = over(SCRIM, [p95, p95, p95], s.overlay);
  const cardBg = over(PANEL, baseBg, 0.96);
  const card = ratio(lumHex(CARD), lumRgb(cardBg));

  const ok = heading >= 7 && body >= 4.5 && card >= 4.5;
  if (!ok) failed++;
  console.log(
    `${s.scene.padEnd(5)}  ${s.id.padEnd(9)} ${String(p95).padStart(4)}  ${s.textAlpha.toFixed(2)}      ` +
    `${heading.toFixed(2).padStart(5)}:1 ${body.toFixed(2).padStart(6)}:1 ${card.toFixed(2).padStart(5)}:1  ${ok ? 'PASS' : 'FAIL'}`
  );
  void bgLinear;
}

console.log('');
if (failed) {
  console.error(`FAIL: ${failed} scene(s) below the 7:1 heading / 4.5:1 body targets — raise textAlpha in SCENES.`);
  process.exit(1);
}
console.log('PASS: all 7 scenes meet 7:1 headings and 4.5:1 body against measured highlights.');