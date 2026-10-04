#!/usr/bin/env bash
# =============================================================================
# prepare-assets.sh — cut the scroll-driven background clips from the source video
#
# Timings were VERIFIED against assets/source/videoplayback.webm (2560x1440, 30fps,
# 41.33s) with ffmpeg blackdetect + scene detection + 1fps frame contact sheet.
# Corrections vs. the brief's nominal timeline (see CHANGELOG):
#   S2 start 8.0  -> 8.8   (real cut detected at 8.67)
#   S5 end   29.6  -> 29.2  (dark dip measured at 29.5, YAVG 32.8)
#   S7 end   38.0  -> 37.3  (fade to black begins ~37.5, black from 38.17)
#
# The "SUYO" watermark sits bottom-left/right in some scenes, so every clip is
# scaled to 106% and cropped from the TOP (drops ~5% off the bottom edge).
#
# NOTE: the footage is a third-party demo asset, not the portfolio owner's own
# video. Replace it before shipping to a real audience.
#
# Usage:  bash prepare-assets.sh [source.webm]
# =============================================================================
set -euo pipefail

SRC="${1:-assets/source/videoplayback.webm}"
OUT_V="assets/video"
OUT_P="assets/posters"
mkdir -p "$OUT_V" "$OUT_P"

# name:start:duration   (seconds)
SCENES=(
  "s1:1.8:5.2"    # golden autumn forest, figure with scroll
  "s2:8.8:4.0"    # farmland at golden hour
  "s3:13.2:4.0"   # cold blue snowy forest
  "s4:18.4:4.8"   # smiling portrait, soft sky
  "s5:24.0:5.2"   # golden hills at sunset
  "s6:30.6:1.2"   # sunset beach, figure from behind
  "s7:33.5:3.8"   # close-up looking down, golden beach
)

# 106% scale then crop from the top -> removes the bottom watermark strip.
CROP_HD="scale=2035:1145:flags=lanczos,crop=1920:1080:0:0"
CROP_SD="scale=1357:765:flags=lanczos,crop=1280:720:0:0"

for entry in "${SCENES[@]}"; do
  IFS=: read -r name start dur <<< "$entry"
  echo "==> $name  -ss $start -t $dur"

  # Desktop H.264 (Safari + everywhere), faststart for progressive playback.
  # CRF 27 rather than the brief's 23: at 23 the seven clips totalled 35.0 MB,
  # over the 30 MB budget. 27 lands at 20.8 MB with no visible gain lost.
  ffmpeg -y -v error -ss "$start" -i "$SRC" -t "$dur" \
    -vf "$CROP_HD" -r 30 \
    -c:v libx264 -crf 27 -preset slow -profile:v high -pix_fmt yuv420p \
    -g 30 -an -movflags +faststart "$OUT_V/$name.mp4"

  # Desktop VP9 (smaller where supported) — CRF 37 keeps the set inside 30 MB.
  ffmpeg -y -v error -ss "$start" -i "$SRC" -t "$dur" \
    -vf "$CROP_HD" -r 30 \
    -c:v libvpx-vp9 -crf 37 -b:v 0 -deadline good -cpu-used 4 -row-mt 1 -an \
    "$OUT_V/$name.webm"

  # Mobile 720p H.264 — CRF 28 keeps the set under the 12 MB budget.
  ffmpeg -y -v error -ss "$start" -i "$SRC" -t "$dur" \
    -vf "$CROP_SD" -r 30 \
    -c:v libx264 -crf 28 -preset slow -profile:v main -pix_fmt yuv420p \
    -g 30 -an -movflags +faststart "$OUT_V/$name-m.mp4"

  # Poster = first frame of the clip, 1920px wide
  ffmpeg -y -v error -ss "$start" -i "$SRC" -frames:v 1 \
    -vf "$CROP_HD" -q:v 3 "$OUT_P/$name.jpg"
done

echo ""
echo "=== sizes ==="
du -ch "$OUT_V"/s[1-7].mp4 "$OUT_V"/s[1-7].webm | tail -1   # desktop budget: 30 MB
du -ch "$OUT_V"/s[1-7]-m.mp4 | tail -1                      # mobile budget: 12 MB
ls -la "$OUT_V" "$OUT_P"