#!/bin/zsh
# render.sh CARDS.json OUTDIR: render each card in CARDS.json with card.html to OUTDIR/<id>.png (headless Chrome, temp profile).
# CARDS.json: [{"id", "size": "feed|story|square", "kicker", "headline", "body", "cta", "img"?}]
set -eu
here=${0:A:h}
cards=${1:A}; out=${2:A}; mkdir -p $out
chrome="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
prof=$(mktemp -d "${TMPDIR:-/tmp}/postcard-chrome.XXXX")
trap 'rm -rf $prof' EXIT
python3 -I - "$cards" <<'EOF' | while IFS=$'\t' read -r id size qs; do
import json, sys, urllib.parse
for c in json.load(open(sys.argv[1])):
    q = {k: v for k, v in c.items() if k != "id" and v}
    print(c["id"], c.get("size", "feed"), urllib.parse.urlencode(q, quote_via=urllib.parse.quote), sep="\t")
EOF
  case $size in story) wh=1080,1920;; square) wh=1080,1080;; *) wh=1080,1350;; esac
  "$chrome" --headless=new --user-data-dir=$prof --hide-scrollbars --force-device-scale-factor=1 \
    --virtual-time-budget=4000 --window-size=$wh --screenshot=$out/$id.png "file://$here/card.html?$qs" 2>/dev/null
  echo "$id $size -> $out/$id.png"
done
