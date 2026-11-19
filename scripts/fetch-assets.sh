#!/usr/bin/env bash
# Downloads the image assets used by the mockup from the public WeGame CDN into
# public/images/, stripping the content-hash suffix from each filename.
# Videos are intentionally NOT downloaded (≈20 MB each) — they are hotlinked.
set -euo pipefail

CDN="https://wegame.gtimg.com/g.55555-r.c4663"
OUT="$(cd "$(dirname "$0")/.." && pwd)/public/images"
mkdir -p "$OUT/posters"

fetch() { # fetch <remote-path> <local-path>
  local dest="$OUT/$2"
  [[ -s "$dest" ]] && return 0
  curl -fsSL --retry 2 "$CDN/$1" -o "$dest" || { echo "failed: $1" >&2; rm -f "$dest"; }
}

for p in lol df val cf dnf ca nba heping poe heishenhua mingchao sanguosha bt rainbow cala; do
  fetch "poster/$p.png" "posters/$p.png"
done

HOME_ASSETS=(
  wegame-h5-share.f036f35a.jpg
  kv-light.82120042.svg
  kv-code.a7b15949.svg
  topic-bg.45f6873f.svg
  frame-main-store.00c3bb06.png
  frame-video-game.0db82b5c.jpg
  ui-bg.c9b9cbe1.jpg
  feature-bg-1.920b2796.png feature-bg-2.ddb06283.png feature-bg-3.553ca1c1.png
  feature-role-1.22da63bf.png feature-role-2.9d897daf.png feature-role-3.f0ce8067.png
  feature-inner-1.9d658538.png feature-inner-2.94f7875e.png feature-inner-3.ba4b598a.png
  feature-ai-avatar.55d3ac4c.png
  teamup-bg.13a26c8a.jpg
  teamup-hero-01.d7ced137.png teamup-hero-02.c97d6179.png teamup-hero-03.47e55826.png
  teamup-hero-04.d0a1a0cf.png teamup-hero-05.93371a1a.png
  teamup-avatar-01.58e768c2.png teamup-avatar-02.b53b0c55.png teamup-avatar-03.ea346988.png
  teamup-avatar-04.a6e4880b.png teamup-avatar-05.84381e4f.png
  college-app.091b6e97.jpg college-app-card-01.8ceca947.png college-app-card-02.8598b92e.png
  college-ddj.03aa3bc0.png
  games.94edac38.avif
  logo.73a48350.svg
)
for f in "${HOME_ASSETS[@]}"; do
  # "feature-bg-1.920b2796.png" -> "feature-bg-1.png"
  local_name="$(echo "$f" | sed -E 's/\.[0-9a-f]{8}\././')"
  fetch "wegame-home/$f" "$local_name"
done

fetch "rail/fragments/header/icon-logo-Dw016lLI.svg" "icon-logo.svg"
fetch "rail/fragments/header/link-entry-creator-4GPhyl1R.png" "creator-entry.png"
fetch "rail/fragments/footer/qrcode-wechat-CxxJ0_Tw.jpg" "qrcode-wechat.jpg"
fetch "rail/fragments/footer/qrcode-wechat-video-CnFbB75u.jpg" "qrcode-wechat-video.jpg"

echo "Assets in $OUT:"
find "$OUT" -type f | wc -l
