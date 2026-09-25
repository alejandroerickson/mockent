# Mockent — agent orientation

This file is for any agent working in this repository. It is vendor-neutral by
design; `CLAUDE.md` is a symlink to it. Keep the real file here; never fork
content into two copies that drift.

## This repository is public

`alejandroerickson/mockent` is a **public** repository (since 2026-09-25).
Everything committed here is published, and so is every commit in its
history. That shapes how you work:

- **Session memory does not live here.** No log, no session history, no
  handoff notes, no record of what Alejandro asked or said, no "current
  stage" or to-do list. Keep that in your own private memory, outside the
  repository. Do not recreate `okf/log.md` (it is gitignored as a guard), and
  do not add a skill or hook that writes one.
- **Never name** employers, clients, customers, colleagues, other private
  repositories, or files elsewhere on Alejandro's machine, even when he uses
  them as input to a task. If something from outside shaped a change, the
  change stands on its own; do not cite where it came from.
- **No secrets, no absolute local paths, no personal details.** Commits use
  Alejandro's GitHub noreply address (his global git config); never commit
  with any other address.
- If you are unsure whether something may be published, leave it out and ask.

## What this repo is

A **mock enterprise application** published to GitHub Pages by GitHub Actions.
**The app is ADIT**, an invented mineral-exploration management system (vendor
Brannock Geosystems, tenant Kestrel Range Resources) in `adit/`, live at
`https://alejandroerickson.com/mockent/adit/`. What it is and how its data is
made: `okf/domain/adit-mock-world.md`.

| Path | What it is |
|---|---|
| `adit/` | The app: Vite + React + TypeScript, hash routes, seeded in-browser data (`src/data/world.ts`), the user manual (`src/pages/Manual.tsx`), Vitest tests. `npm run dev` there. |
| `okf/` | Stable reference knowledge: the charter, the decisions, the mock world. Not a log. |
| `PRODUCT.md` | impeccable's product record, with every inference marked. |
| `DESIGN.md`, `.impeccable/design.json`, `design/` | The design system, derived from the built app. |
| `site/` | The Pages root: a one-line page linking to `adit/`. |
| `scripts/build-pages.sh`, `.github/workflows/pages.yml` | Deploy: every top-level folder with a `build` script, plus `site/`, to one Pages site. |
| `.claude/`, `.codex/`, `.cursor/` | The impeccable design hook manifests (the skill itself is installed locally, see below). |

## Knowledge: `okf/` is reference, not memory

`okf/` is a small [OKF](okf/README.md) bundle of Markdown with YAML
frontmatter: what the repository is, the durable decisions, and the invented
world. **Update the concept a change makes untrue**, in place, dated. A
changed decision gets a dated line saying what replaced it. Run
`python3 okf/tools/validate_okf.py` before committing a change to it.

Say where a claim comes from (observed in the code, decided by Alejandro,
dated, or inferred), without naming anything the rules above keep out.

## Design: impeccable, and the design system

UI work uses the **impeccable** skill. It is **not committed**: install it
locally with `npx impeccable install` (the installed copies under
`.agents/`, `.claude/skills/`, `.cursor/skills/` and the subagents are
gitignored). The hook manifests (`.claude/settings.json`, `.codex/hooks.json`,
`.cursor/hooks.json`) are committed and do nothing until the skill is
installed. Do not run `/impeccable hooks on`: it would write a second copy
into `.claude/settings.local.json` and fire the detector twice.

impeccable's records are `PRODUCT.md`, `DESIGN.md` with
`.impeccable/design.json`, and `.impeccable/surfaces/adit-index-html.md` (the
direction contract for the app: "the stage board"). The design system is
recorded in `DESIGN.md` (`okf/decisions/design-system.md`). Token values
are `design/tokens.css` (imported by `adit/src/app.css`); the font is
`design/fonts/`.

UI work on `adit/` is a refinement or extension of an established world: keep
the incumbent vocabulary (see `DESIGN.md`), and record a new surface's
direction in `.impeccable/surfaces/`.

## Deploy

- **One GitHub Pages site**, from Actions, on push to `main`:
  `scripts/build-pages.sh` copies `site/` to the root of `_site/` and, for every
  top-level folder whose `package.json` has a `build` script, runs `npm ci`,
  `npm test` and `npm run build` with `VITE_BASE=/mockent/<folder>/`, publishing
  it at `https://alejandroerickson.com/mockent/<folder>/`. A failing test
  blocks the whole deploy. Run the script locally before pushing.
- **Base path is load-bearing.** Never hand-write a root-absolute URL; use a
  relative path, an `import`, or `import.meta.env.BASE_URL`. The script fails
  the build if `dist/index.html` references anything outside the base.

## Git

- Start a session with `git pull --rebase --autostash`; other devices push to
  `main`.
- **Push to `main` directly.** A ruleset blocks force-pushes to `main` and
  deletion of `main`; never rewrite published history.
- Commit only when Alejandro asks. Messages are a plain sentence describing
  the change.

## Standing cautions

- **Nothing in `adit/` may say why the mock exists.** No mention of agents,
  automation or experiments in the app's copy, markup, ids or data. The
  environment chip says the data is synthetic, and nothing else does.
- **No AI assistant in the app** (Alejandro, 2026-09-21).
- **No real company, person or dataset** in the app. The invented names are
  placeholders until Alejandro confirms them.
- **Do not launder an assumption into a premise.** Mark inferences as
  inferences.
