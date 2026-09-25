---
type: Decision
title: One Pages site, deployed from Actions on push to main
description: scripts/build-pages.sh assembles site/ plus every top-level app with a build script into _site/, and pages.yml publishes it at alejandroerickson.com/mockent/; a failing test blocks the deploy.
tags: [decision, deploy, github-pages, actions]
generated: {by: agent:claude, at: 2026-09-25T00:00:00Z}
status: stable
---

# One Pages site, deployed from Actions on push to main

## The choice

- `.github/workflows/pages.yml` runs on push to `main`, on pull requests (build and test only) and by hand. It calls `scripts/build-pages.sh`, then checks Pages is switched on, uploads `_site/` and deploys.
- `scripts/build-pages.sh` copies `site/` to the root of `_site/`, copies `design/tokens.css` and `design/fonts/` under `_site/design/`, and for every top-level folder whose `package.json` has a `build` script runs `npm ci`, `npm test` and `npm run build` with `VITE_BASE=/mockent/<folder>/`, then copies `dist/` to `_site/<folder>/`. It fails if a built page references a root-absolute path outside its base.
- The site lives at `https://alejandroerickson.com/mockent/` (the custom domain on Alejandro's GitHub Pages applies to every project site). Apps at `/mockent/<folder>/`.

## Consequences

- A failing test anywhere blocks every deploy. `main` is live; run the script before pushing.
- Base paths are load-bearing: no hand-written root-absolute URLs.
- The workflow token cannot switch Pages on; a maintainer does it once (Settings → Pages → Source: GitHub Actions).
- The path is plain, not behind an unguessable slug.
