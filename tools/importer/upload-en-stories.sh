#!/usr/bin/env bash
# Upload every imported EN story page to Document Authoring, then preview + live
# publish it, so the query-index (which only sees PUBLISHED pages) picks up each
# page's `category`. Credentials are injected by the environment — no token here.
#
# DA page docs MUST be wrapped in <body><main>…</main></body>; the local
# .plain.html files are bare (<div>…). We wrap on upload.
#
# Usage: bash tools/importer/upload-en-stories.sh
set -uo pipefail

ORG=larsauffarth
REPO=skoda-storyboard
SRC_DIR="content/en/stories"
TMP=$(mktemp -d)
trap 'rm -rf "$TMP"' EXIT

ok=0; fail=0
for f in "$SRC_DIR"/*.plain.html; do
  base=$(basename "$f" .plain.html)
  path="en/stories/$base"
  wrapped="$TMP/$base.html"
  { printf '<body><main>'; cat "$f"; printf '</main></body>'; } > "$wrapped"

  # 1) upload to DA source
  up=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    -F "data=@$wrapped;type=text/html" \
    "https://admin.da.live/source/$ORG/$REPO/$path.html")
  # 2) preview  3) live
  pv=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "https://admin.hlx.page/preview/$ORG/$REPO/main/$path")
  lv=$(curl -s -o /dev/null -w "%{http_code}" -X POST \
    "https://admin.hlx.page/live/$ORG/$REPO/main/$path")

  if [[ "$up" =~ ^2 && "$pv" =~ ^2 && "$lv" =~ ^2 ]]; then
    ok=$((ok+1)); echo "✅ $path (up=$up pv=$pv lv=$lv)"
  else
    fail=$((fail+1)); echo "❌ $path (up=$up pv=$pv lv=$lv)"
  fi
done
echo "---- done: $ok ok, $fail failed ----"
