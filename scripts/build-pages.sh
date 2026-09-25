#!/usr/bin/env bash
# Builds this repository's Pages site into _site/.
#
# site/ is copied to the root. An app is any top-level folder whose
# package.json has a "build" script: each is installed with `npm ci`, tested
# with `npm test`, and built with VITE_BASE=/<repo>/<folder>/ into
# _site/<folder>/. A failing test in any app fails the whole build, so nothing
# is published from a broken main.
#
# Run it locally to reproduce what CI publishes: `scripts/build-pages.sh`.
set -euo pipefail

root=$(cd "$(dirname "$0")/.." && pwd)
repo=${REPO_NAME:-mockent}
out="$root/_site"

rm -rf "$out"
mkdir -p "$out"
cp -R "$root/site/." "$out/"
# The design tokens and font are kept once, in design/; the site references them
# at design/tokens.css, so copy just those in.
mkdir -p "$out/design"
cp "$root/design/tokens.css" "$out/design/tokens.css"
cp -R "$root/design/fonts" "$out/design/fonts"

built=()
for pkg in "$root"/*/package.json; do
  [ -e "$pkg" ] || continue
  dir=$(dirname "$pkg")
  app=$(basename "$dir")
  if ! node -e 'process.exit(require(process.argv[1]).scripts?.build ? 0 : 1)' "$pkg"; then
    echo "-- $app: no build script, skipped"
    continue
  fi
  base="/$repo/$app/"
  echo "== $app -> $base"
  (
    cd "$dir"
    npm ci --no-audit --no-fund
    npm test
    VITE_BASE="$base" npm run build
  )

  # Every absolute asset URL must sit under the app's base. A stray "/assets/..."
  # means the base did not apply and the page will 404 its own JavaScript, which
  # only shows up once it is published.
  stray=$(grep -oE '(src|href)="[^"]*"' "$dir/dist/index.html" \
          | grep -E '="/' | grep -v "=\"$base" || true)
  if [ -n "$stray" ]; then
    echo "::error::$app/dist/index.html references paths outside $base"
    echo "$stray"
    exit 1
  fi

  cp -R "$dir/dist" "$out/$app"
  built+=("$app")
done

# The root page links to apps relatively; make sure each one it names exists.
for link in $(grep -oE 'href="[a-z0-9-]+/"' "$root/site/index.html" | sed -E 's/href="(.*)\/"/\1/'); do
  if [ ! -f "$out/$link/index.html" ]; then
    echo "::error::site/index.html links to $link/, which was not built"
    exit 1
  fi
done

echo "Built ${#built[@]} app(s) into _site/: ${built[*]:-none}"
